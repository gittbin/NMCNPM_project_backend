const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    sku: { type: String, unique: true, required: true },
    price: { type: String, required: true },
    stock_in_shelf: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 10 },
    supplier: { type: String },
    purchaseDate: { type: Date, default: Date.now },
    location: { type: String },
    stock_in_Warehouse: { type: Number, default: 0 },
    unit: { type: String, default: 'pcs' },
    purchasePrice: { type: String },
    notes: { type: String },
    image: {
        secure_url: String,
        public_id: String,
    },
}, { 
    timestamps: true,
});


const Products = mongoose.model('Products', productSchema,'Products');

module.exports = Products;