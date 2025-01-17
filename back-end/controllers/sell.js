const Products = require("../modules/products");
const Bills = require("../modules/bill");
const Customer = require("../modules/customer");
const customerCHistory = require("../modules/history_change_customer");
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
      creater:user._id,
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
  try {
    let newBill;
    if (customerId != "") {
      let check = await Customer.findOne({ phone: customerId });
      if (!check) {
        const new_customer = new Customer({ phone: customerId, owner,firstPurchaseDate:Date.now(),lastPurchaseDate:Date.now(),creater:creater });
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
      if(customer.firstPurchaseDate==null){
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
            firstPurchaseDate:Date.now(),
            lastPurchaseDate: Date.now(),
          }, // Tăng trường rate lên 1
          { new: true } // Tuỳ chọn này sẽ trả về tài liệu đã cập nhật
        );
      }else{
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
          lastPurchaseDate: Date.now(),
        }, // Tăng trường rate lên 1
        { new: true } // Tuỳ chọn này sẽ trả về tài liệu đã cập nhật
      );
      }
      // Chuyển chuỗi `money` thành
      
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
        product.rate=product.rate+1;
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
    const activities = await Bills.find({ owner: user.id_owner }) // Lấy lịch sử hoạt động của người chủ
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
const get_history_customer=async (req,res) => {
  const { user } = req.body;
  try {
      const activities = await customerCHistory.find({ owner: user.id_owner }) // Lấy lịch sử hoạt động của người chủ
          .populate('employee', 'name email') // Lấy tên nhân viên
          .populate('customer')
          .sort({ timestamp: -1 }) // Sắp xếp theo thời gian
          .select('employee customer action timestamp details') // Chọn các trường cần thiết
          .lean();
      res.status(200).json(activities);
  } catch (error) {
      console.error('Error in get_history:', error); // Log lỗi chi tiết
      res.status(500).json({ message: error.message });
  }
}
const edit_customer=async (req,res)=>{
  const { user, customer_edit } = req.body;
  try {
      let customer = await Customer.find({ _id: customer_edit._id });
      if(customer.length==0){        res.json({ message: "Không tìm thấy customer" });}
      customer = customer[0];
      let check = await Customer.findOne({ 
        _id: { $ne: customer._id }, 
        phone: customer_edit.phone 
      });
      if (check) {
        return res.json({ message: "Số điện thoại này đã được đăng ký" });
      }
      
      
      const oldProduct = JSON.parse(JSON.stringify(customer));

      // Cập nhật thông tin sản phẩm
      customer = await Customer.findByIdAndUpdate(
          customer_edit._id,
          customer_edit,
          { new: true, runValidators: true }
      );

      if (!customer) {
          return res.status(404).json({ message: 'customer not found' });
      }

      // Sử dụng Change Stream để theo dõi thay đổi

              const updatedFields = Object.keys(customer_edit);

              // Loại bỏ trường createdAt khỏi danh sách thay đổi
              const filteredFields = updatedFields.filter(field => {
                  if(field=='creater'||field=='owner'||field=="updatedAt") {
                      return false;}
                  if(field=="rate"){
                    customer_edit[field] =parseInt(customer_edit[field])  
                  }
                  return oldProduct[field] !== customer_edit[field]
              });
                  
              console.log(filteredFields)
              if (filteredFields.length > 0) {
                  // Lấy các thay đổi chi tiết (so sánh cũ và mới)
                  const changes = filteredFields.map(field => {
                      const oldValue = oldProduct[field];
                      const newValue = customer_edit[field];
                      // Ghi lại thay đổi theo format "field changed from oldValue to newValue"
                      return `${field} changed from '${oldValue}' to '${newValue}'`;
                  });

                  const history = new customerCHistory({
                      owner: user.id_owner, // ID của chủ cửa hàng
                      employee: user._id,   // ID của nhân viên thực hiện
                      customer: customer_edit.name,
                      action: 'update',
                      details: `${changes.join(', ')}. `  // Thêm chi tiết thay đổi vào lịch sử
                  });

                  try {
                      await history.save();
                  } catch (err) {
                      console.error('Error saving history:', err);
                  }
              }
          

      // Trả về phản hồi thành công
      res.json({ message: "success" });
  } catch (error) {
      console.error('Server Error:', error); // Thêm dòng này để ghi log lỗi vào console server
      res.status(500).json({ message: 'Server error', error: error.message }); // Trả về chỉ thông điệp lỗi
  }
}
const delete_customer=async(req,res)=>{
  const { user,customer_delete,detail } = req.body;
  try {
      const customer = await Customer.findByIdAndDelete(customer_delete._id);
      if (!customer) {
          return res.status(404).json({ message: 'supplier not found' });
      }
      const history = new customerCHistory({
          owner: user.id_owner, // ID của người chủ
          employee: user._id, // ID của nhân viên thực hiện hành động
          customer: customer.phone,
          action: 'delete',
          details: detail
      });
      await history.save();
      res.status(200).json({ message: 'success' });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}
module.exports = {
  findcode,
  create_customer,
  history,
  get_customer,
  get_history,
  get_history_customer,
  edit_customer,
  delete_customer
};
