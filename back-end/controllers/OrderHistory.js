const mongoose = require("mongoose");
const OrderHistory = require("../modules/orderHistory");
const OrderDetailHistory = require("../modules/OrderDetailHistory");
const LoggingOrder = require("../modules/loggingOrder");
const Products = require("../modules/products");
const Suppliers = require("../modules/supplier");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Sử dụng Gmail làm ví dụ
  port: 465,
  secure: true,
  auth: {
    user: "baolong081104@gmail.com", // Email của bạn
    pass: "sugi azhu mxpz snjy", // Mật khẩu ứng dụng
  },
});
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: "baolong081104@gmail.com", // Địa chỉ email gửi
      to: to, // Địa chỉ email nhận
      subject: subject, // Tiêu đề email
      text: text, // Nội dung email dạng text
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const template = (listOrder) => {
  const needsEmail = listOrder.filter((order) => order.email);
  if (needsEmail.length === 0) return null;
  return (
    `dear ${listOrder[0].supplier}\n` +
    needsEmail.map(
      (order) => `tôi muốn nhập ${order.quantity} sản phẩm  ${order.name}\n`
    ) +
    "Cảm ơn vì đã xem"
  );
};
const saveOrderHistory = async (req, res) => {
  const session = await mongoose.startSession(); // Bắt đầu session transaction
  session.startTransaction();
  try {
    // Lấy dữ liệu từ req.body
    const listOrder = Object.values(req.body.dataForm);
    console.log(req.body);
    // Dùng for...of để xử lý bất đồng bộ đúng cách
    for (const suppOrders of listOrder) {
      // Tạo đơn hàng (OrderHistory)
      await sendEmail(
        "nguyenkhoe2k4@gmail.com",
        "nhập hàng",
        template(suppOrders)
      );

      const ord = new OrderHistory({
        supplierId: suppOrders[0].supplierId,
        generalStatus: suppOrders.some((item) => item.status == "pending")
          ? "pending"
          : "deliveried",
        amount: suppOrders.reduce(
          (acc, curr) => acc + Number(curr.price) * Number(curr.quantity),
          0
        ).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
        ownerId: new mongoose.Types.ObjectId(req.body.user.ownerId),
        tax: req.body.tax
      });

      const savedOrder = await ord.save({ session });

      // Tạo các chi tiết đơn hàng (OrderDetailHistory)
      const ordDetails = suppOrders.map(
        (item) =>
          new OrderDetailHistory({
            orderId: savedOrder._id,
            productId: new mongoose.Types.ObjectId(item.productId),
            price: item.price,
            quantity: item.quantity,
            status: item.status,
            ownerId: new mongoose.Types.ObjectId(req.body.user.ownerId),
          })
      );
      // Lưu các chi tiết đơn hàng
      const savedOrderDetails = await OrderDetailHistory.insertMany(
        ordDetails,
        { session }
      );

      // Tạo các bản ghi log cho đơn hàng
      const loggOrder = savedOrderDetails.map((savedOrderDetail) => {
        return new LoggingOrder({
          orderId: savedOrder._id,
          orderDetailId: savedOrderDetail._id, // Sử dụng _id của từng order detail đã lưu
          status: savedOrderDetail.status ==="deliveried"?"deliveried":"create", // Lấy status tương ứng
          userId: req.body.user.id,
          userName: req.body.user.name,
          details: "create a new item",
          ownerId: new mongoose.Types.ObjectId(req.body.user.ownerId),
          tax:req.body.tax,
        });
      });

      // Lưu các bản ghi loggingOrder
      await LoggingOrder.insertMany(loggOrder, { session });
    }

    const productDeliveried = listOrder
      .flat()
      .map((item) => {
        if (item.status == "deliveried")
          return { id: item.productId, quantity: item.quantity };
      })
      .filter((item) => item !== undefined);

    for (const item of productDeliveried) {
      const product = await Products.findOne({ _id: item.id });
      if (product) {
        await Products.updateOne(
          { _id: item.id }, // Điều kiện tìm sản phẩm
          { $inc: { stock_in_Warehouse: item.quantity } } // Tăng số lượng tồn kho
        );
      }
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();
    res.status(200).send({ message: "Order history saved successfully!" });
  } catch (error) {
    // Nếu có lỗi, rollback transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Error during the transaction:", error);

    // Gửi phản hồi lỗi
    res
      .status(500)
      .send({ message: "An error occurred during the transaction", error });
  }
};

const getOrder = async (req, res) => {
  try {
    const { search, ownerId } = req.query;
    console.log("khoe", ownerId);
    let matchConditions = {};
    if (search) {
      if (mongoose.Types.ObjectId.isValid(search)) {
        matchConditions._id = new mongoose.Types.ObjectId(search);
      } else if (isNaN(Date.parse(search))) {
        matchConditions["supplier.name"] = { $regex: search, $options: "i" };
      } else {
        const parsedDate = new Date(search);
        if (isNaN(parsedDate)) {
          return res.status(400).json({ error: "Invalid date format" });
        }
        // Tìm tất cả các đơn hàng trong ngày cụ thể (từ 00:00 đến 23:59:59)
        matchConditions.createdAt = {
          $gte: parsedDate,
          $lt: new Date(parsedDate.getTime() + 24 * 60 * 60 * 1000),
        };
      }
    }
    console.log(matchConditions);
    const result = await OrderHistory.aggregate([
      {
        $lookup: {
          from: "Suppliers",
          localField: "supplierId",
          foreignField: "_id",
          as: "supplier",
        },
      },
      {
        $match: {
          ...matchConditions,
          generalStatus: "pending",
          ownerId: new mongoose.Types.ObjectId(ownerId),
        },
      },
      {
        $unwind: {
          path: "$supplier",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          supplierId: 1,
          generalStatus: 1,
          amount: 1,
          updatedAt: 1,
          nameSupplier: "$supplier.name",
          emailSupplier: "$supplier.email",
          supplierId: "$supplier._id",
        },
      },
    ]);

    if (result.length === 0) {
      return res.status(404).json({
        message: "Order not found or no supplier associated with this order.",
      });
    }

    // Trả về kết quả
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in aggregate query:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const updateOrderHistory = async (req, res) => {
  const newOrder = req.body;
  console.log(newOrder);
  console.log("em");
  try {
    const orderH = await OrderHistory.findOne({
      _id: new mongoose.Types.ObjectId(newOrder.id),
    });
    if (!orderH) {
      return res.status(404).json({ message: "Order history not found" });
    }

    if (newOrder.status !== orderH.generalStatus) {
      const listOrderChange = await OrderDetailHistory.find({
        orderId: new mongoose.Types.ObjectId(newOrder.id),
        status: "pending",
      });

      if (newOrder.status === "deliveried") {
        const promises = listOrderChange.map(async (orderChange) => {
          try {
            await Products.updateOne(
              { _id: orderChange.productId },
              { $inc: { stock_in_Warehouse: orderChange.quantity } }
            );

            orderChange.status = "deliveried";
            orderChange.updatedAt = newOrder.date;
            await orderChange.save();

            const newLogging = new LoggingOrder({
              orderId: newOrder.id,
              orderDetailId: orderChange._id,
              status: "update",
              userId: newOrder.userid,
              userName: newOrder.userName,
              details: newOrder.notes,
              ownerId: newOrder.ownerId,
            });
            console.log(newLogging);
            await newLogging.save();
          } catch (error) {
            console.error(
              `Error updating order detail ${orderChange._id}:`,
              error
            );
          }
        });
        await Promise.all(promises);
      } else if (newOrder.status === "Canceled") {
        const promises = listOrderChange.map(async (orderChange) => {
          try {
            orderChange.status = "Canceled";
            orderChange.updatedAt = newOrder.date;
            await orderChange.save();

            const newLogging = new LoggingOrder({
              orderId: newOrder.id,
              orderDetailId: orderChange._id,
              status: "delete",
              userId: newOrder.userid,
              userName: newOrder.userName,
              details: newOrder.notes,
            });
            await newLogging.save();
          } catch (error) {
            console.error(
              `Error canceling order detail ${orderChange._id}:`,
              error
            );
          }
        });
        await Promise.all(promises);
      }
    }

    orderH.updatedAt = newOrder.date;
    orderH.generalStatus = newOrder.status;
    orderH.amount = newOrder.total;

    await orderH.save();

    res.status(200).json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating OrderHistory:", error);
    res
      .status(500)
      .json({ message: "Error updating order", error: error.message });
  }
};
const getSupplierByOrderId = async (req, res) => {
  const { orderId, ownerId } = req.query;
  console.log(ownerId);
  if (!orderId) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const orders = await OrderHistory.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: "Suppliers",
          localField: "supplierId", // Trường trong orderHistory chứa _id nhà cung cấp
          foreignField: "_id", // Trường _id trong collection supplier
          as: "supplierDetails", // Kết quả nối sẽ được lưu trong trường này
        },
      },

      {
        $unwind: "$supplierDetails", // "Giải nở" (unwind) để chuyển dữ liệu từ mảng thành đối tượng
      },
      {
        $project: {
          tax: 1,
          supplierName: "$supplierDetails.name", // Lấy tên nhà cung cấp
          supplierEmail: "$supplierDetails.email", // Lấy email nhà cung cấp
        },
      },
    ]);
    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    console.log(orders[0])
    res.json(orders[0]);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
const getProductTop100 = async (req, res) => {
  const { ownerId } = req.query;

  const firstDayOfLastMonth = new Date();
  firstDayOfLastMonth.setMonth(firstDayOfLastMonth.getMonth() - 1);
  firstDayOfLastMonth.setDate(1);
  firstDayOfLastMonth.setHours(0, 0, 0, 0);

  const lastDayOfLastMonth = new Date(firstDayOfLastMonth);
  lastDayOfLastMonth.setMonth(lastDayOfLastMonth.getMonth() + 1);
  lastDayOfLastMonth.setDate(0);
  lastDayOfLastMonth.setHours(23, 59, 59, 999);

  if (!ownerId) {
    return res.status(400).json({ error: "Owner ID is required" });
  }

  try {
    const products = await OrderDetailHistory.aggregate([
      {
        $match: {
          ownerId: new mongoose.Types.ObjectId(ownerId),
          createdAt: {
            $gte: firstDayOfLastMonth,
            $lt: lastDayOfLastMonth,
          },
        },
      },
      {
        $lookup: {
          from: "Products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: {
          path: "$product",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "Suppliers",
          localField: "product.supplier",
          foreignField: "_id",
          as: "supplier",
        },
      },
      {
        $unwind: {
          path: "$supplier",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $addFields: {
          numericQuantity: { $toDouble: "$quantity" }, // Chuyển quantity từ string sang number
        },
      },
      {
        $group: {
          _id: "$productId",
          totalQuantity: { $sum: "$numericQuantity" },
          name: { $first: "$product.name" },
          description: { $first: "$product.description" },
          image: { $first: "$product.image" },
          purchasePrice: { $first: "$product.purchasePrice" },
          supplierId: { $first: "$supplier._id" },
          supplierName: { $first: "$supplier.name" },
          supplierEmail: { $first: "$supplier.email" },
        },
      },
      {
        $project: {
          // productId: "$_id",
          // _id: "$",
          // totalQuantity: 1,
          name: 1,
          description: 1,
          image: 1,
          purchasePrice: 1,
          supplierDetails:{
            _id:'$supplierId',
            name:'$supplierName',
            email:'$supplierEmail',
          },
        },
      },
      {
        $sort: {
          totalQuantity: -1,
        },
      },
      {
        $limit: 100,
      },
    ]);

    return res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "An error occurred" });
  }
};


module.exports = {
  saveOrderHistory,
  getOrder,
  updateOrderHistory,
  getSupplierByOrderId,
  getProductTop100,
};