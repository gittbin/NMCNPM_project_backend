const Products =require('../modules/products')
const findcode=async (req, res) => {
const {user}=req.body
try {
    // Tìm user theo email
    const products = await Products.find({ owner: user.id_owner });
    if(products){
        console.log(products)
       const send={product:[...products],message:"success"}
    res.json(send); 
    }else{
        res.status(500).json({ message: 'Error' });
    }
    
} catch (error) {
    console.error('show error', error); 
    res.status(500).json({ message: 'Error', error });
}
}
module.exports = {
    findcode,

}