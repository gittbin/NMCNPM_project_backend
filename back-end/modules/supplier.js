const mongoose = require('mongoose');

const SuppliersSchema = new mongoose.Schema({
    name: { type: String},
    phone: { type: String, required: true },
    email: { type: String},
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
}, { timestamps: true });

const Suppliers = mongoose.model('Suppliers', SuppliersSchema,'Suppliers');
module.exports = Suppliers;
