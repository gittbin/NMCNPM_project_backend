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
            delete: false,
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
    try {
        const roles_data = await Roles.find({ delete: false });
        res.json(roles_data);
    } catch (error) {
        console.error('Khong lay duoc data Role', error); 
        res.status(500).json({ message: 'Error', error });
    }
};

const deleteRole = async (req, res) => {
    const { user, role_id} = req.body; // Nhận dữ liệu từ frontend
    try {
        const roleToDelete = await Roles.findOne({ _id: role_id });
        if (!roleToDelete) {
            return res.status(404).json({ message: 'Role not found' });
        }
        roleToDelete.delete = true; // Giả sử bạn có trường delete là một object chứa boolean
        await roleToDelete.save(); // Lưu lại thay đổi
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Khong lay duoc data Role', error); 
        res.status(500).json({ message: 'Error', error });
    }
};

const editRole = async (req, res) => {
    try {
        const rolesWithPermissions = req.body;
        for (const role of rolesWithPermissions) {
            await Roles.findByIdAndUpdate(
                { _id: role._id }, 
                { permissions: role.permissions }
            );
        }
        res.status(200).json({ message: 'Cập nhật thành công!' });
    } catch (error) {
        console.error("Error updating permissions:", error);
        res.status(500).json({ message: 'Lỗi khi cập nhật phân quyền.' });
    }
}

// Xuất hàm createRole
module.exports = {
    createRole,
    showRole,
    deleteRole,
    editRole
};
