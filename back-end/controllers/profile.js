const User =require('../modules/user')
const Roles =require('../modules/roles')
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
        const role=await Roles.findOne({id_owner: user2.id_owner._id,role: user2.role})
        console.log({ ...user2,right:role })
            res.status(200).json({ ...user2,right:role });
        }
        

        // Nếu thành công, trả về thông báo thành công
        
    } catch (error) {
        console.error('Login error:',error); // Thêm thông tin lỗi vào console
        res.status(500).json({ message: 'Error logging in', error });
    }
}
const change_profile=async(req,res)=>{
    const { user } = req.body;
    try{const updated_user=await User.findByIdAndUpdate(
        {_id:user._id},
    {$set:{name:user.name,password:user.password}},
    { new: true })
res.status(200).json({respond:"success"})
}catch (err) {
        console.error(err)
        res.status(500).json({ respond:"error" });
    }
    
}
const update_avatar= async (req,res) => {
    const {user,newPr}=req.body;
    console.log(user,newPr)
    try{const updated_user=await User.findByIdAndUpdate(
        {_id:user._id},
    {$set:{avatar:newPr.image.secure_url}},
    { new: true })
    console.log(updated_user)
res.status(200).json({respond:"success"})
}catch (err) {
        console.error(err)
        res.status(500).json({ respond:"error" });
    }
}
module.exports = {
    get_profile,
    change_profile,
    update_avatar
}