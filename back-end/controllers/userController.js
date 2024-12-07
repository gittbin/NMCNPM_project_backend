// controllers/userController.js
const User = require('../modules/user'); // Đường dẫn đến tệp chứa schema User
const User_temporary =require('../modules/Temporary_user')
const crypto = require('crypto');
const { console } = require('inspector');
const nodemailer = require('nodemailer');

const createUser = async (req, res) => {
    console.log("req.body:", req.body);
    const {
        name,
        email,
        password,
        role,
        id_owner,
        confirmOtp,
        code
    } = req.body.dataUser;

    if (req.body.user._id !== req.body.user.id_owner) {
        return res.status(403).json({ message: 'Không có quyền truy nhập' });
    }

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Nếu người dùng đã tồn tại, sửa thông tin người dùng
            const updatedUser = await User.findByIdAndUpdate(
                existingUser._id, 
                { name, email, password, role, id_owner },
                { new: true }
            );
            return res.status(200).json({
                message: 'User_new updated successfully!',
                user: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    id_owner: updatedUser.id_owner,
                },
            });
        }

        // Tạo mã xác nhận và thời gian hết hạn nếu cần
        const codes = crypto.randomBytes(3).toString('hex'); // 6 ký tự
        const resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 phút

        if (confirmOtp) {
            let user = await User_temporary.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Người dùng không tồn tại!' });
            }
            if (user.code !== code || user.resetCodeExpire < Date.now()) {
                return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn!' });
            }

            // Tạo người dùng mới
            const newUser = new User({
                name,
                email,
                password,
                GoogleID: "",
                role,
                id_owner,
                resetCode: codes, // Sử dụng mã xác nhận
                resetCodeExpire, // Thời gian hết hạn mã
            });
            await newUser.save();
            return res.status(200).json({ message: 'Staff is created successfully', user: newUser });
        }

        // Xử lý người dùng tạm thời
        const user = await User_temporary.find({ email });
        if (user.length > 0) {
            // Xóa tất cả người dùng tạm thời có email này
            await User_temporary.deleteMany({ email });
        }

        const newUser_tmp = new User_temporary({
            name,
            email,
            password,
            GoogleID: "",
            role,
            id_owner,
            code: codes, // Thêm mã xác nhận
            resetCodeExpire, // Thêm thời gian hết hạn
        });

        await newUser_tmp.save();

        // Cấu hình gửi mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'baolong081104@gmail.com',
                pass: 'sugi azhu mxpz snjy',
            },
        });

        const mailOptions = {
            from: 'baolong081104@gmail.com',
            to: newUser_tmp.email,
            subject: 'Mã xác nhận đặt lại mật khẩu',
            text: `Mã xác nhận của bạn là: ${codes}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: 'Confirmation code sent' });
    } catch (error) {
        console.error('Lỗi tạo người dùng:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra trong quá trình tạo người dùng.',
            error: error.message || error,
        });
    }
};

const sendAgain =  async (req, res) => {
    console.log("req.body:", req.body);
    const {
        name,
        email,
        password,
        role,
        id_owner,
        confirmOtp,
        code
    } = req.body.dataUser;

    if (req.body.user._id !== req.body.user.id_owner) {
        return res.status(403).json({ message: 'Không có quyền truy nhập' });
    }

    try {

        // Tạo mã xác nhận và thời gian hết hạn nếu cần
        const codes = crypto.randomBytes(3).toString('hex'); // 6 ký tự
        const resetCodeExpire = Date.now() + 10 * 60 * 1000; // 10 phút


        // Xử lý người dùng tạm thời
        const user = await User_temporary.find({ email });
        if (user.length > 0) {
            // Xóa tất cả người dùng tạm thời có email này
            await User_temporary.deleteMany({ email });
        }

        const newUser_tmp = new User_temporary({
            name,
            email,
            password,
            GoogleID: "",
            role,
            id_owner,
            code: codes, // Thêm mã xác nhận
            resetCodeExpire, // Thêm thời gian hết hạn
        });

        await newUser_tmp.save();

        // Cấu hình gửi mail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'baolong081104@gmail.com',
                pass: 'sugi azhu mxpz snjy',
            },
        });

        const mailOptions = {
            from: 'baolong081104@gmail.com',
            to: newUser_tmp.email,
            subject: 'Mã xác nhận đặt lại mật khẩu',
            text: `Mã xác nhận của bạn là: ${codes}`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(201).json({ message: 'Confirmation code sent' });
    } catch (error) {
        console.error('Lỗi tạo người dùng:', error);
        return res.status(500).json({
            message: 'Có lỗi xảy ra trong quá trình tạo người dùng.',
            error: error.message || error,
        });
    }
};


const showUser = async (req, res) => {
    const userId = req.query.userId;
    if (!userId) {
        return res.status(400).json({
            message: 'Thiếu userId trong yêu cầu!'
        });
    }

    try {
        // Tìm tất cả người dùng có `id_owner` khớp với giá trị được truyền vào
        const users = await User.find({
            id_owner: userId
        });


        // Nếu không tìm thấy người dùng nào
        if (users.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy người dùng nào với id_owner này!'
            });
        }

        // Trả về danh sách người dùng nếu tìm thấy
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            message: 'Có lỗi xảy ra. Vui lòng thử lại!'
        });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id; 
    
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }
        
        res.status(200).json({
            message: 'User deleted successfully!'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            message: 'There was an error deleting the user. Please try again!'
        });
    }
};

const editUser = async (req, res) => {
    const userId = req.params.id; // Get the user ID from the URL parameters
    const {
        name,
        email,
        password,
        role
    } = req.body; 
    console.log(req.body);
    
    try {
        // Update user data
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name,
            email,
            password, 
            role,
        }, {
            new: true
        });

        if (!updatedUser) {
            return res.status(404).json({
                message: 'User not found!'
            });
        }

        res.status(200).json({
            message: 'User updated successfully!',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            message: 'There was an error updating the user. Please try again!'
        });
    }
};

module.exports = {
    createUser,
    showUser,
    deleteUser,
    editUser,
    sendAgain
};