const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: null },
    GoogleID: { type: String, default: null },
    role: {
        type: String,
        default: "Admin",
    },
    id_owner: { type: mongoose.Schema.Types.ObjectId },// Thêm trường email_owner
    resetCode: String,
    resetCodeExpire:Date,
}, { timestamps: true });

// Middleware trước khi lưu tài liệu
userSchema.pre('save', function (next) {
    // Gán giá trị cho email_owner bằng email
    if (!this.id_owner) {
        this.id_owner = this._id; // Gán email_owner
    }
    next(); // Tiến hành lưu
});

const User = mongoose.model('Users', userSchema, 'Users');

module.exports = User;
