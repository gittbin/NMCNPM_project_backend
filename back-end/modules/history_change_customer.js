const mongoose = require('mongoose');

const customerCHistory = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', // Tham chiếu đến người chủ 
        required: true 
    },
    employee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Users', 
        required: true 
    },
    customer: { 
        type:String,
        required:true
    },
    action: { 
        type: String, 
        enum: ['update', 'delete'], 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    details: { 
        type: String // Có thể lưu thêm thông tin mô tả về thay đổi
    }

}, { timestamps: true });

const CustomerCHistory = mongoose.model('customerCHistory', customerCHistory,'customerCHistory');
module.exports = CustomerCHistory;
