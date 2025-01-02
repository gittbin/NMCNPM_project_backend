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
    id_owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }, // Bỏ required
    resetCode: String,
    resetCodeExpire: Date,
    avatar: { type: String }
}, { timestamps: true });

// Middleware trước khi lưu tài liệu
userSchema.pre('save', function (next) {
    // Gán giá trị mặc định cho id_owner nếu chưa có
    if (!this.id_owner) {
        this.id_owner = this._id;
    }

    // Gán avatar ngẫu nhiên từ DiceBear nếu chưa có
    if (!this.avatar) {
        const randomSeed = Math.random().toString(36).substring(2); // Tạo chuỗi ngẫu nhiên
        this.avatar = `https://api.dicebear.com/6.x/adventurer/svg?seed=${randomSeed}`;
    }

    next(); // Tiếp tục lưu tài liệu
});

const User = mongoose.model('Users', userSchema, 'Users');

module.exports = User;
