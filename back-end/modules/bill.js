const mongoose = require('mongoose');
const Bill_Schema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    creater: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers'},
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: String, required: true },
    items: [
        {
            productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: String, required: true },
            discount: { type: String},
            totalAmount:{ type: String}
        }
    ],
    discount:{type: String},
    vat: { type: String},
    paymentMethod: {type:String},
    notes: String
});

const Bills = mongoose.model('Bills', Bill_Schema,'Bills');

module.exports = Bills;
