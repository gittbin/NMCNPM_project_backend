const Products = require("../modules/products");
const Bills = require("../modules/bill");
const Customer = require("../modules/customer");
const findcode = async (req, res) => {
  const { user } = req.body;
  try {
    // Tìm user theo email
    const products = await Products.find({ owner: user.id_owner });
    if (products) {
      console.log(products);
      const send = { product: [...products], message: "success" };
      res.json(send);
    } else {
      res.status(500).json({ message: "Error" });
    }
  } catch (error) {
    console.error("show error", error);
    res.status(500).json({ message: "Error", error });
  }
};
const get_customer = async (req, res) => {
  const { user } = req.body;
  try {
    // Tìm user theo email
    const customers = await Customer.find({ owner: user.id_owner })
    .populate("creater")
    .sort({ orderDate: -1 }) // Sắp xếp theo ngày đặt hàng, nếu muốn
      .lean();
    if (customers) {
      const send = { customers: [...customers], message: "success" };
      res.json(send);
    } else {
      res.status(500).json({ message: "Error" });
    }
  } catch (error) {
    console.error("show error", error);
    res.status(500).json({ message: "Error", error });
  }
};
const create_customer = async (req, res) => {
  const { name, email, phone, user } = req.body;
  try {
    let check = await Customer.findOne({ phone });
    if (check) {
      return res.json({ message: "Số điện thoại này đã được đăng ký" });
    }
    let new_customer = new Customer({
      name,
      email,
      phone,
      owner: user.id_owner,
      creater:user._id
    });
    await new_customer.save();
    res.json({new_customer, message: "success" });
  } catch (err) {
    return res.status(404).json({ message: "Error" });
  }
};
const history = async (req, res) => {
  const { owner, customerId, totalAmount, items, paymentMethod, notes,discount,vat,creater } =
    req.body;
console.log(discount,vat)
  try {
    let newBill;
    if (customerId != "") {
      let check = await Customer.findOne({ phone: customerId });
      if (!check) {
        const new_customer = new Customer({ phone: customerId, owner });
        await new_customer.save();
        check = await Customer.findOne({ phone: customerId });
      }

      newBill = new Bills({
        owner,
        creater,
        customerId: check._id,
        totalAmount,
        items,
        paymentMethod,
        notes,
        discount,
        vat
      });
      let customer = await Customer.findById(check._id);
      const currentMoney = parseFloat(
        customer.money.toString().replace(/\./g, "")
      );
      let rate = customer.rate;
      // Chuyển chuỗi `money` thành
      customer = await Customer.findByIdAndUpdate(
        check._id,
        {
          rate: rate + 1,
          $set: {
            money: (
              currentMoney +
              parseFloat(totalAmount.toString().replace(/\./g, ""))
            ).toLocaleString("vi-VN",),
          },
        }, // Tăng trường rate lên 1
        { new: true } // Tuỳ chọn này sẽ trả về tài liệu đã cập nhật
      );
    } else {
      newBill = new Bills({ owner, totalAmount, items, paymentMethod, notes ,discount,
        vat,creater});
    }

    await newBill.save();
    for (const item of items) {
      const product = await Products.findById(item.productID);
      if (product) {
        // Trừ số lượng sản phẩm dựa vào số lượng của `item`
        product.stock_in_shelf -= item.quantity;
        if (product.stock_in_shelf < 0) {
          product.stock_in_shelf = 0; // Đảm bảo số lượng không âm
        }
        await product.save();
      }
    }
    res.json({ message: "success" });
  } catch (err) {
    console.error("Error saving history:", err);
    return res.status(404).json({ message: "Error" });
  }
};
const get_history = async (req, res) => {
  const { user } = req.body;
  try {
    console.log(user);
    const activities = await Bills.find({ owner: user._id }) // Lấy lịch sử hoạt động của người chủ
      .populate("owner") // Lấy tất cả thông tin của chủ sở hữu
      .populate("creater") // Lấy tất cả thông tin của chủ sở hữu
      .populate("customerId") // Lấy tất cả thông tin của khách hàng nếu cần
      .populate({
        path: "items.productID", // Truy cập đến productID trong mảng items
        model: "Products", // Xác định mô hình cho productID
      })
      .sort({ orderDate: -1 }) // Sắp xếp theo ngày đặt hàng, nếu muốn
      .lean();

    res.status(200).json(activities);
  } catch (error) {
    console.error("Error in get_history:", error); // Log lỗi chi tiết
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  findcode,
  create_customer,
  history,
  get_customer,
  get_history,
};
