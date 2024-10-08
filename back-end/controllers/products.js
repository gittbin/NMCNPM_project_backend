const Products =require('../modules/products')
const History =require('../modules/history')
const show=async (req, res) => {
    const { user } = req.body;
    try {
        // Tìm user theo email
        const products = await Products.find({ owner: user._id });
        res.json(products);
    } catch (error) {
        console.error('show error', error); 
        res.status(500).json({ message: 'Error', error });
    }
}
const edit = async (req, res) => {
    const { user, product_edit } = req.body;
    
    // Kiểm tra quyền chỉnh sửa
    if (!user.rights.includes("edit_product")) {
        return res.status(403).json({ message: "You don't have the right to edit goods" });
    }

    try {
        // Tìm và cập nhật sản phẩm
        const product = await Products.findByIdAndUpdate(
            product_edit._id,
            product_edit,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ghi lại lịch sử hành động
        try {
            const history = new History({
                owner: user.id_owner, // ID của chủ cửa hàng
                employee: user._id,   // ID của nhân viên thực hiện
                product: product_edit.name,
                action: 'update',
                details: `Updated product: ${product_edit.name}`
            });
            await history.save();
        } catch (err) {
            console.error('Error saving history:', err);
        }

        // Trả về phản hồi thành công
        res.json({ message: "success" });
    } catch (error) {
        console.error('Server Error:', error); // Thêm dòng này để ghi log lỗi vào console server
    res.status(500).json({ message: 'Server error', error: error.message }); // Trả về chỉ thông điệp lỗi
    }
};

const deletes = async (req, res) => {
    const { user,product_delete } = req.body;
    let i=user.rights.includes("delete_product");
    if(!i){return res.status(404).json({ message: "you don't have right to delete goods" });}
    try {
        const product = await Products.findByIdAndDelete(product_delete._id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const history = new History({
            owner: user.id_owner, // ID của người chủ
            employee: user._id, // ID của nhân viên thực hiện hành động
            product: product.name,
            action: 'delete',
            details: `delete product: ${product.name}`
        });
        await history.save();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const show_detail = async (req, res) => {
    try {
        console.log(req.params.id)
        const product = await Products.findOne({ _id: req.params.id});
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
const create=async (req, res) => {
    const { user,newPr } = req.body;
    let i=user.rights.includes("add_product");
    if(!i){return res.status(404).json({ message: "you don't have right to create new goods" });}
    console.log({
        ...newPr,
    });
    try {
        const newProduct = new Products({
            ...newPr,
            owner:user.id_owner
        });
        await newProduct.save();
        try{const history = new History({
            owner: user.id_owner,
            employee: user._id, 
            product: newPr.name,
            action: 'create',
            details: `create product: ${newPr.name}`
        });
        await history.save();res.status(201).json({message:"Success"});}
        catch(err){res.status(500).json({ message: 'Server error2', err });}
        
    } catch (error) {
        console.error('Error in get_history:', error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
}
const get_history = async (req, res) => {
    const { user } = req.body;
    try {
        console.log('User:', user);
        const activities = await History.find({ owner: user._id }) // Lấy lịch sử hoạt động của người chủ
            .populate('employee', 'name') // Lấy tên nhân viên
            .sort({ timestamp: -1 }) // Sắp xếp theo thời gian
            .select('employee product action timestamp') // Chọn các trường cần thiết
            .lean();
        console.log('Activities:', activities);
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error in get_history:', error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    show,
    edit,
    deletes,
    show_detail,
    create,
    get_history
}