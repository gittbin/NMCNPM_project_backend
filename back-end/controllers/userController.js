// controllers/userController.js
const User = require('../modules/user'); // Đường dẫn đến tệp chứa schema User
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const getCookie = require('../services/getCookie');

const createUser = async (req, res) => {
    console.log(req.body);
    const {
        name,
        email,
        password,
        role,
        id_owner
    } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                message: 'Email đã tồn tại!'
            });
        }

        // Tạo mã resetCode ngẫu nhiên và thời gian hết hạn cho mã này
        const resetCode = crypto.randomBytes(3).toString('hex'); // Tạo mã xác nhận 6 ký tự
        const resetCodeExpire = Date.now() + 10 * 60 * 1000; // Mã có hiệu lực trong 10 phút

        // Tạo người dùng mới với các thông tin từ request
        const newUser = new User({
            name,
            email,
            password,
            GoogleID: "",
            role,
            id_owner,
            resetCode,
            resetCodeExpire,
        });

        console.log("Tạo thành công người dùng mới");

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        // Thiết lập cấu hình gửi email (sử dụng App Password hoặc OAuth2 nếu cần)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'uyle3614@gmail.com',
                pass: process.env.GMAIL_PASSWORD,
            },
        });

        // Tạo nội dung email
        const mailOptions = {
            from: 'uyle3614@gmail.com',
            to: newUser.email,
            subject: 'Uy đẹp trai đã gửi cho bạn một lời mời làm thuyền viên: Mã xác nhận đăng ký tài khoản',
            text: `Mã xác nhận của bạn là: ${resetCode}`,
        };

        // Gửi email mã xác nhận
        await transporter.sendMail(mailOptions);

        // Phản hồi thành công với thông tin người dùng mới
        res.status(201).json({
            message: 'User created successfully! Please verify your email.',
            user: {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Lỗi tạo người dùng:', error);
        res.status(500).json({
            message: 'Có lỗi xảy ra ở create. Vui lòng thử lại!'
        });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
        }

        if (user.resetCode === otp && user.resetCodeExpire > Date.now()) {
            user.isVerified = true; // Đánh dấu tài khoản là đã xác thực
            user.resetCode = null;
            user.resetCodeExpire = null;
            await user.save();

            return res.status(200).json({ message: 'Xác thực OTP thành công!' });
        } else {
            return res.status(400).json({ message: 'OTP không hợp lệ hoặc đã hết hạn!' });
        }
    } catch (error) {
        console.error('Lỗi xác thực OTP:', error);
        res.status(500).json({ message: 'Có lỗi xảy ra khi xác thực OTP. Vui lòng thử lại!' });
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
    const user = getCookie.getCookie('user');
    console.log(user);
    const userId = req.params.id; // Get the user ID from the URL parameters
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
    verifyOTP
};