const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User =require('../modules/user')
const User_temporary =require('../modules/Temporary_user')
const jwt = require("jsonwebtoken");
const login_raw=async (req, res) => {
    const { email, password } = req.body;
console.log(email, password)
    try {
        // Tìm user theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid' });
        }else{
if (user.password!==password) {
            res.status(400).json({ message: 'wrong password' });
        }else{
            const token = jwt.sign({ userId: user._id, role: user.role }, 
                                    process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: 'Login successful',  user, token  });
        }
        }
        

        // Nếu thành công, trả về thông báo thành công
        
    } catch (error) {
        console.error('Login error:', error); // Thêm thông tin lỗi vào console
        res.status(500).json({ message: 'Error logging in', error });
    }
}
const login_google =async (req, res) => {
    const { GoogleID,family_name,given_name,email} = req.body;
    let name=family_name+" "+given_name;
    console.log(name,GoogleID);
    try{
        const user = await User.findOne({ GoogleID });
        if (!user) {
            const newUser = new User({ GoogleID,name,email });
        await newUser.save();  // Lưu người dùng mới vào cơ sở dữ liệu

        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
        }else{
            if (!user.isVerified) {
                return res.status(403).json({ message: 'Tài khoản chưa xác thực. Vui lòng kiểm tra email để xác thực tài khoản.' });
            }
            const token = jwt.sign({ userId: user._id, role: user.role }, 
                process.env.JWT_SECRET, { expiresIn: "1h" });
            res.status(200).json({ message: 'Login successful',  user, token  });            
        }

    }catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }

}
const sign_up = async (req, res) => {
    const { name, email, password,confirm,code} = req.body;
console.log(name, email,password,confirm,code);
    try {
        let user = await User_temporary.findOne({ email });
        if(confirm){
            console.log(user)
            if (user.code !== code || user.resetCodeExpire < Date.now()) {
                return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn!' });
            }else{
                const newUser = new User({ name, email, password });
                newUser.save();
                console.log(newUser)
               return  res.status(200).json({ message: 'User created successfully' ,user:newUser});
            }
        }
         user = await User.findOne({ email });
        if (user) {
            console.log(user)
            return res.status(400).json({ message: 'email đã tồn tại' });}
            user = await User_temporary.find({ email });
            if (user.length > 0) {
                // Xóa tất cả người dùng tạm thời có email này
                await User_temporary.deleteMany({ email });
            }
        const newUser = new User_temporary({ name, email, password });
        await newUser.save();  // Lưu người dùng mới vào cơ sở dữ liệu
        if (!newUser) {
            return res.status(400).json({ message: 'Có lỗi xảy ra khi tạo người dùng mới!' });
        }
                const codes = crypto.randomBytes(3).toString('hex'); // 6 ký tự
                newUser.code = codes;
                newUser.resetCodeExpire = Date.now() + 10 * 60 * 1000; // Mã code có hiệu lực trong 10 phút
                await newUser.save();
        
                // Cấu hình gửi mail
                const transporter = nodemailer.createTransport({
                    service: 'gmail', // Hoặc SMTP server khác
                    auth: {
                        user: 'baolong081104@gmail.com',
                        pass: 'sugi azhu mxpz snjy',
                    },
                });
        
                const mailOptions = {
                    from: 'baolong081104@gmail.com',
                    to: newUser.email,
                    subject: 'Mã xác nhận đặt lại mật khẩu',
                    text: `Mã xác nhận của bạn là: ${codes}`,
                };
        
                // Gửi email
                await transporter.sendMail(mailOptions);
        
        res.status(201).json({
            message: 'User created successfully',
        });
    } catch (error) {
        console.error('Error in :', error); // In thông tin lỗi ra console
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại !' });
    }
}
const forgot_password=async (req, res)=>{
    const { email } = req.body;
    console.log(email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại!' });
        }

        // Tạo mã xác nhận ngẫu nhiên
        const resetCode = crypto.randomBytes(3).toString('hex'); // 6 ký tự
        user.resetCode = resetCode;
        user.resetCodeExpire = Date.now() + 10 * 60 * 1000; // Mã code có hiệu lực trong 10 phút
        await user.save();

        // Cấu hình gửi mail
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Hoặc SMTP server khác
            auth: {
                user: 'baolong081104@gmail.com',
                pass: 'sugi azhu mxpz snjy',
            },
        });

        const mailOptions = {
            from: 'baolong081104@gmail.com',
            to: user.email,
            subject: 'Mã xác nhận đặt lại mật khẩu',
            text: `Mã xác nhận của bạn là: ${resetCode}`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email của bạn!' });
    } catch (error) {
        console.error('Error in forgotPassword:', error); // In thông tin lỗi ra console
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại lỗi forgotpassword!' });
    }
}
const change_password=async (req,res)=>{
    const { email,ma } = req.body;
    try{const user = await User.findOne({ email });
   if (user.resetCode !== ma || user.resetCodeExpire < Date.now()) {
        return res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn!' });
    }else{
        res.status(200).json({ message: 'Success' });
    }
    }catch (error) {
        console.error('Error in forgotPassword:', error); // In thông tin lỗi ra console
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại lỗi forgotpassword!' });
    }
 
}
const change_password2= async (req,res)=>{
    const { email,password } = req.body;
    try{const user = await User.findOne({ email });
    console.log(user);
user.password = password;
await user.save();
return res.status(200).json({ message: 'Success' });
    }catch (error) {
        console.error('Error in forgotPassword:', error); // In thông tin lỗi ra console
        res.status(500).json({ message: 'Có lỗi xảy ra. Vui lòng thử lại lỗi forgotpassword!' });
    }
 
}
module.exports = {
    login_raw,
    login_google,
    sign_up,
    forgot_password,
    change_password,
    change_password2
}