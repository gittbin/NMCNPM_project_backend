const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
    supplierId:{type: mongoose.Schema.Types.ObjectId},
    generalStatus:{type: String},
    amount:{type: String},
    tax:{type:Number},
    ownerId:{type: mongoose.Schema.Types.ObjectId},
},{ 
    timestamps: true,
});
const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema,'Order_History');
module.exports = OrderHistory;