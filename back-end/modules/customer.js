const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String},
    phone: { type: String, required: true },
    email: { type: String},
    rate: { type: Number,default:0},
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    money:{
        type:String,
        default:"0.000"
    }
});

const Customer = mongoose.model('Customers', customerSchema,'Customers');
module.exports = Customer;
