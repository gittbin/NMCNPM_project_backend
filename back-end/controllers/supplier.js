const { mongo, default: mongoose } = require('mongoose');
const Suppliers =require('../modules/supplier')

const getSupplierSuggestion=async(req,res) =>{
    const { query,ownerId } = req.query;  // Lấy query từ tham số URL
    console.log(query,ownerId)
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }
  
    try {
      // Tìm kiếm nhà cung cấp có tên chứa từ khóa
      const suppliers = await Suppliers.find({
        name: { $regex: query, $options: 'i' },  
        owner: new mongoose.Types.ObjectId(ownerId)  
      })
      .select('_id name').limit(5);
      res.json(suppliers);  // Trả về các gợi ý tìm kiếm
    } catch (err) {
      console.error('Error searching suppliers:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

module.exports = {
    getSupplierSuggestion
}