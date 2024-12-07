const Role = require('../modules/roles'); // Model kết nối với collection roles

const authorize = (permission) => {
    return async (req, res, next) => {
        console.log(req.body);
        try {
            const userRole = req.body.user.role;  
            const userId = req.body.user.id_owner;
            console.log(userRole);
            if(userRole==="Admin"){
                return next();
            }
            if (!userRole) {
                return res.status(400).json({ message: "Role không được cung cấp" });
            }

            console.log(`Đang kiểm tra quyền của vai trò: ${userRole}`);

            // Truy vấn quyền của vai trò từ database
            const roleData = await Role.findOne({ role: userRole, id_owner:userId });

            if (!roleData) {
                return res.status(404).json({ message: "Vai trò không tồn tại" });
            }
            
            // Kiểm tra xem role có quyền này không
            if (roleData.permissions && roleData.permissions.includes(permission)) {
                return next();  // Nếu có quyền, cho phép truy cập
            } else {
                return res.status(403).json({ message: "Không có quyền truy cập" });
            }
        } catch (err) {
            console.error("Lỗi trong middleware authorization:", err);
            return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
        }
    };
}

module.exports= {authorize}