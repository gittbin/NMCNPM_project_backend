const Roles = require('../modules/roles'); // Import mô-đun vai trò

// Hàm tạo vai trò mới
const createRole = async (req, res) => {
    const { role, description, permissions } = req.body; // Nhận dữ liệu từ frontend
    try {
        // Tạo vai trò mới
        const newRole = new Roles({
            role,
            description,
            permissions,
            createAt: new Date(),
            deleteAt: null,
            delete: { boolean: false }
        });
        
        // Lưu vai trò vào cơ sở dữ liệu
        await newRole.save();

        // Trả về phản hồi thành công
        console.log(newRole);
        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        console.error('Error creating role:', error); // Ghi lại lỗi vào console
        res.status(500).json({ message: 'Server error', error: error.message }); // Trả về thông báo lỗi
    }
};

const showRole = async (req, res) => {
    const { role, description, permissions } = req.body; // Nhận dữ liệu từ frontend
    try {
        // Tạo vai trò mới
        const roles_data = await Roles.find();
        res.json(roles_data);
    } catch (error) {
        console.error('Khong lay duoc data Role', error); 
        res.status(500).json({ message: 'Error', error });
    }
};

// Xuất hàm createRole
module.exports = {
    createRole,
    showRole
};
