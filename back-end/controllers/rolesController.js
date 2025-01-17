const Roles = require('../modules/roles'); 
const Users = require('../modules/user');

const createRole = async (req, res) => {
    console.log(req.body);
    const {newRoleData, user} = req.body;
    const { role, description, permissions, id_owner } = newRoleData; 
    try {
        const newRole = new Roles({
            role,
            description,
            permissions,
            createAt: new Date(),
            id_owner,
        });
        await newRole.save();
        console.log(newRole);
        res.status(201).json({ message: 'Role created successfully', role: newRole });
    } catch (error) {
        console.error('Error creating role:', error); 
        res.status(500).json({ message: 'Server error', error: error.message }); 
    }
};

const showRole = async (req, res) => {
    try {
        const excludedId = 'Admin';
        const userId = req.query.userId;
        const roles_data = await Roles.find({ 
            id_owner: userId,
            role: { $ne: excludedId } 
        });
        res.json(roles_data);
    } catch (error) {
        console.error('Không lấy được dữ liệu vai trò', error); 
        res.status(500).json({ message: 'Error', error });
    }
};

const deleteRole = async (req, res) => {
    const { user, role_id } = req.body; 
    try {
        const roleToDelete = await Roles.findById(role_id);
        if (!roleToDelete) {
            return res.status(404).json({ message: 'Role not found' });
        }
        await Roles.findByIdAndDelete(role_id); 
        await Users.updateMany(
            { role: roleToDelete.role }, 
            { role: '' } 
        );
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        console.error('Không thể xóa vai trò', error); 
        res.status(500).json({ message: 'Error', error });
    }
};

const editRole = async (req, res) => {
    try {
        const rolesWithPermissions = req.body.rolesWithPermissions;
        for (const role of rolesWithPermissions) {
            const updatedRole = await Roles.findByIdAndUpdate(
                role._id,
                { permissions: role.permissions },
                { new: true } 
            );
            if (role.newRoleName && role.newRoleName !== updatedRole.role) {
                await Users.updateMany(
                    { role: updatedRole.role }, 
                    { role: role.newRoleName } 
                );
            }
        }
        res.status(200).json({ message: 'Cập nhật thành công!' });
    } catch (error) {
        console.error("Error updating permissions:", error);
        res.status(500).json({ message: 'Lỗi khi cập nhật phân quyền.' });
    }
};

module.exports = {
    createRole,
    showRole,
    deleteRole,
    editRole
};
