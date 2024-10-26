const mongoose = require('mongoose');

const history = new mongoose.Schema({
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
    product: { 
        type: String, 
        required: true 
    },
    action: { 
        type: String, 
        enum: ['create', 'update', 'delete'], 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    details: { 
        type: String // Có thể lưu thêm thông tin mô tả về thay đổi
    }
});
const History=mongoose.model('historys', history,'historys');
module.exports = History;
