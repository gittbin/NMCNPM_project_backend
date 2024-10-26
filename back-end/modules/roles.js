const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    role: { type: String, required: true },
    description: { type: String, required: true },
    permissions: { type: [String], default: [] },
    createAt: { type: Date, default: Date.now },
    deleteAt: { type: Date, default: null },
    delete: { boolean: { type: Boolean, default: false } }
});

module.exports = mongoose.model('Role', roleSchema,'Roles');
