const mongoose = require('mongoose');

const orderDetailHistorySchema = new mongoose.Schema({
    orderId:{type: mongoose.Schema.Types.ObjectId},
    productId:{type: mongoose.Schema.Types.ObjectId},
    price:{type: String},
    quantity:{type: String},
    status:{type: String},
    ownerId:{type: mongoose.Schema.Types.ObjectId},
},{ 
    timestamps: true,
});
const OrderDetailHistory = mongoose.model('OrderDetailHistory', orderDetailHistorySchema,'Order_Detail_History');
module.exports = OrderDetailHistory;