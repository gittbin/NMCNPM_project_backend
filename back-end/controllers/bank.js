
const Banks = require('../modules/bank.js'); // Model đã tạo

const get_bank=async (req, res)=>{
const {user}=req.body;
const bankAccounts=await Banks.find({owner:user.id_owner})
res.status(200).json(bankAccounts);
}
const add_bank=async (req, res)=>{
const {user,newPr}=req.body;
try{const bankAccounts=new Banks({
owner:user.id_owner,
...newPr,
})
await bankAccounts.save();
return res.status(201).json({message:"Success"});}
catch(err){res.status(500).json({ message: 'Server error2', err });}
}
const delete_bank = async (req, res) => {
    try {
        const { user, accountNumber, bankName } = req.body;
console.log(user,accountNumber,bankName)
        // Kiểm tra dữ liệu đầu vào
        if (!user  || !accountNumber || !bankName) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Xóa tài khoản ngân hàng
        const deletedBank = await Banks.findOneAndDelete({
            owner: user.id_owner,
            accountNumber,
            bankName,
        });

        if (!deletedBank) {
            return res.status(404).json({ message: 'Account not found' });
        }

        return res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error('Error deleting bank:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports={
    get_bank,
    add_bank,
    delete_bank
}