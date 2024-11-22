const Role = require('../modules/roles'); // Model kết nối với collection roles
const jwt = require("jsonwebtoken");

const authorize = (permission) => {
    return async (req, res, next) => {
        const authHeader = req.headers["authorization"];
        console.log(authHeader);
        
        const token = authHeader && authHeader.split(" ")[1];
        

        if (!token) return res.sendStatus(401);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded Token:", decoded);
            const userRole = decoded.role;
            console.log(userRole);
            

            // Truy vấn quyền của vai trò từ database
            const roleData = await Role.findOne({ role: userRole });
            if (roleData && roleData.permissions.includes(permission)) {
                next(); // Nếu có quyền, cho phép truy cập
            } else {
                res.status(403).json({ message: "Không có quyền truy cập" });
            }
        } catch (err) {
            console.error("Error verifying token:", err);
            res.status(403).json({ message: "Token không hợp lệ" });
        }
    };
}

module.exports= {authorize}