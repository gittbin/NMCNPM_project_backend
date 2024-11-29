const User =require('../modules/user')
const get_profile=async (req, res) => {
    const { user } = req.body;
    try {
        // Tìm user theo email
        const user2 = await User.findOne({ email:user.email })
                            .populate( 'id_owner')
                            .lean();

        if (!user2) {
            return res.status(400).json({ message: 'Invalid' });
        }else{
            res.status(200).json({ user2 });
        }
        

        // Nếu thành công, trả về thông báo thành công
        
    } catch (error) {
        console.error('Login error:',error); // Thêm thông tin lỗi vào console
        res.status(500).json({ message: 'Error logging in', error });
    }
}

module.exports = {
    get_profile,
}