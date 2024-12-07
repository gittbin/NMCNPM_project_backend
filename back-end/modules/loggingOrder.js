const mongoose = require('mongoose');

const loggingOrderSchema = new mongoose.Schema({
    orderId:{type: mongoose.Schema.Types.ObjectId},
    orderDetailId:{type: mongoose.Schema.Types.ObjectId},
    status:{type: String},
    userId:{type: mongoose.Schema.Types.ObjectId},
    userName: {type: String},
    details:{type: String },
    ownerId:{type: mongoose.Schema.Types.ObjectId},
    tax:{type:Number},
},{ 
    timestamps: true,
});
const LoggingOrders = mongoose.model('LoggingOrders', loggingOrderSchema,'Logging_Order');
module.exports = LoggingOrders;