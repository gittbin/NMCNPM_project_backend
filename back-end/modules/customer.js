const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String},
    phone: { type: String, required: true },
    email: { type: String},
    rate: { type: Number,default:0},
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
    money:{
        type:String,
        default:"0.000"
    },
    lastPurchaseDate: { type: Date ,default:null},
    firstPurchaseDate: { type: Date ,default:null},
}, { timestamps: true });

const Customer = mongoose.model('Customers', customerSchema,'Customers');
module.exports = Customer;
