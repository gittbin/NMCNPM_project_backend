const OrderDetailHistory = require("../modules/OrderDetailHistory");
const Products = require("../modules/products");
const OrderHistory = require("../modules/orderHistory");
const loggingOrder = require("../modules/loggingOrder");
const mongoose = require("mongoose");

const listOrderDetail = async (req, res) => {
  const { idOrder } = req.query;
  try {
    const orderDetails = await OrderDetailHistory.aggregate([
      {
        $match: { orderId: new mongoose.Types.ObjectId(idOrder) },
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
        },
      },
      {
        $project: {
          orderId: 1,
          productId: 1,
          status: 1,
          quantity: 1,
          updatedAt: 1,
          name: "$product.name",
          image: "$product.image",
          price: "$product.purchasePrice",
          description: "$product.description",
        },
      },
    ]);

    if (orderDetails.length === 0) {
      return res.status(404).json({ message: "Order details not found" });
    }

    res.json(orderDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
const updateDetail = async (req, res) => {
  const { formData,status,total,userName,userId,ownerId } = req.body;
  const  data= {
    formData,
    status,
    total,
    userName,
    userId,
    ownerId,
  }
  console.log(data)
  try {
    const orderHis = await OrderHistory.findOne({
      _id: new mongoose.Types.ObjectId(data.formData[0].orderId),
    });

    if (!orderHis) {
      return res.status(404).json({ message: "Order history not found" });
    }

    if (orderHis.generalStatus !== data.status || orderHis.amount !== data.total) {
      orderHis.generalStatus = data.status;
      orderHis.amount = data.total;
      orderHis.updatedAt = new Date().toISOString();
      await orderHis.save();
    }

    // Update each order detail
    const promises = data.formData.map(async (info) => {
      try {
        const orderDetail = await OrderDetailHistory.findOne({
          _id: new mongoose.Types.ObjectId(info._id),
        });

        if (!orderDetail) {
          console.error(`Order detail with ID ${info._id} not found`);
          return;
        }
        const oldStatus = orderDetail.status;
        // Check if status or quantity has changed
        if (orderDetail.status !== info.status || orderDetail.quantity !== info.quantity) {
          orderDetail.status = info.status;
          orderDetail.quantity = info.quantity;
          orderDetail.updatedAt = new Date().toISOString();
          await orderDetail.save();

          // Create a logging entry for the update
          const newLogging = new loggingOrder({
            orderId: info.orderId,
            orderDetailId: info._id,
            status: info.status === "canceled" ? "delete" : "update",
            userId: data.userId,
            userName: data.userName,
            details: info.note,
            ownerId:ownerId,
          });
          await newLogging.save();
        }

        // Update product quantity if order is delivered
        if (oldStatus === "pending" && info.status === "deliveried") {
          const product = await Products.findOne({ _id: info.productId });
          if (product) {
            product.stock_in_Warehouse += Number(info.quantity);
            await product.save();
          } else {
            console.error(`Product with ID ${info.productId} not found`);
          }
        }
        
      } catch (error) {
        console.error("Error updating order detail:", error);
      }
    });

    // Wait for all promises to complete
    await Promise.all(promises);

    res.status(200).json({ message: "Order details updated successfully" });
  } catch (error) {
    console.error("Error updating order history:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  listOrderDetail,
  updateDetail,
};