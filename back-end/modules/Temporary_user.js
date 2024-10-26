const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: null },
    code: String,
    resetCodeExpire:Date
}, { timestamps: true });


const User_temporary = mongoose.model('User_temporarys', userSchema, 'User_temporarys');

module.exports = User_temporary;
