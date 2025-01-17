const Products =require('../modules/products')
const History =require('../modules/history')
const cloudinary = require('cloudinary').v2;
const Suppliers=require('../modules/supplier')
const supplierCHistory =require('../modules/history_change_supplier')
const mongoose = require("mongoose");
cloudinary.config({ 
    cloud_name: 'ddgrjo6jr', 
    api_key: '951328984572228', 
    api_secret: 'IBEHKrE-_AuUbTcxhks0jxLb6lE' 
  });
const show=async (req, res) => {
    const { user } = req.body;
    try {
        // Tìm user theo email
        const products = await Products.find({ owner: user.id_owner })
        res.json(products);
    } catch (error) {
        console.error('show error', error); 
        res.status(500).json({ message: 'Error', error });
    }
}
const edit = async (req, res) => {
    const { user, product_edit, detail, check } = req.body;

    try {
        let product = await Products.find({ _id: product_edit._id });
        product = product[0];

        if (product.image && product.image.public_id && check) {
            const publicId = product.image.public_id;
            // Xóa ảnh trên Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
            if (result.error) {
                console.error('Error deleting image from Cloudinary:', result.error);
            }
            console.log('Cloudinary delete result:', result);
        }

        // Lưu giá trị cũ của sản phẩm trước khi cập nhật
        const oldProduct = JSON.parse(JSON.stringify(product));

        // Cập nhật thông tin sản phẩm
        product = await Products.findByIdAndUpdate(
            product_edit._id,
            product_edit,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Sử dụng Change Stream để theo dõi thay đổi

                const updatedFields = Object.keys(product_edit);

                // Loại bỏ trường createdAt khỏi danh sách thay đổi
                const filteredFields = updatedFields.filter(field => {
                    if(field=='supplier') {
                        return oldProduct[field] !== product_edit[field]._id}
                    
                if(field=="image"){
                        return JSON.stringify(oldProduct[field]) !== JSON.stringify(product_edit[field])

                    }
                    return oldProduct[field] !== product_edit[field]
                });
                    
                console.log(filteredFields)
                if (filteredFields.length > 0) {
                    // Lấy các thay đổi chi tiết (so sánh cũ và mới)
                    const changes = filteredFields.map(field => {
                        if(field=='supplier'||field=='image') return  `${field} changed`
                        // Lấy giá trị cũ và giá trị mới
                        const oldValue = oldProduct[field];
                        const newValue = product_edit[field];
                        
                        // Ghi lại thay đổi theo format "field changed from oldValue to newValue"
                        return `${field} changed from '${oldValue}' to '${newValue}'`;
                    });

                    const history = new History({
                        owner: user.id_owner, // ID của chủ cửa hàng
                        employee: user._id,   // ID của nhân viên thực hiện
                        product: product_edit.name,
                        action: 'update',
                        details: `${detail+"  "} \n${changes.join(', ')}. `  // Thêm chi tiết thay đổi vào lịch sử
                    });

                    try {
                        await history.save();
                    } catch (err) {
                        console.error('Error saving history:', err);
                    }
                }
            

        // Trả về phản hồi thành công
        res.json({ message: "success" });
    } catch (error) {
        console.error('Server Error:', error); // Thêm dòng này để ghi log lỗi vào console server
        res.status(500).json({ message: 'Server error', error: error.message }); // Trả về chỉ thông điệp lỗi
    }
};


const deletes = async (req, res) => {
    const { user,product_delete,detail } = req.body;
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
            details: detail
        });
        await history.save();
        if (product.image && product.image.public_id) {
            const publicId = product.image.public_id;
            console.log(publicId)
            // Xóa ảnh trên Cloudinary
            const result = await cloudinary.uploader.destroy(publicId);
      
            if (result.error) {
              console.error('Error deleting image from Cloudinary:', result.error);
            //   return res.status(500).json({ message: 'Error deleting image from Cloudinary' });
            }
      
            console.log('Cloudinary delete result:', result);
          }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const show_detail = async (req, res) => {
    try {
        const product = await Products.findOne({ _id: req.params.id})
        .populate("supplier")
        .lean();
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
const create=async (req, res) => {
    const { user,newPr,detail } = req.body;
    console.log({
        ...newPr,
    });
    const Check=await Products.find({owner:user.id_owner,sku:newPr.sku})
    if(Check.length>0) {
      return res.status(500).json({ message: 'sku đã bị trùng' });} 
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
            details: detail,
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
        const activities = await History.find({ owner: user.id_owner }) // Lấy lịch sử hoạt động của người chủ
            .populate('employee', 'name email') // Lấy tên nhân viên
            .sort({ timestamp: -1 }) // Sắp xếp theo thời gian
            .select('employee product action timestamp details') // Chọn các trường cần thiết
            .lean();
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error in get_history:', error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
};

const get_supplier=async(req, res)=>{
    const { user } = req.body;
    console.log(user)
    try {
      // Tìm user theo email
      const suppliers = await Suppliers.find({ owner: user.id_owner })
      .populate("creater")
      .sort({ orderDate: -1 }) // Sắp xếp theo ngày đặt hàng, nếu muốn
        .lean();
      if (suppliers) {
        const send = { suppliers: [...suppliers], message: "success" };
        res.json(send);
      } else {
        res.status(500).json({ message: "Error" });
      }
    } catch (error) {
      console.error("show error", error);
      res.status(500).json({ message: "Error", error });
    }
}

const create_supplier=async(req,res)=>{
    const { name, email, phone, user } = req.body;
    try {
      let check = await Suppliers.findOne({ owner: user.id_owner, phone });
      if (check) {
        return res.json({ message: "Số điện thoại này đã được đăng ký" });
      }
      let new_supplier = new Suppliers({
        name,
        email,
        phone,
        owner: user.id_owner,
        creater:user._id
      });
      await new_supplier.save();
      res.json({new_supplier, message: "success" });
    } catch (err) {
      return res.status(404).json({ message: "Error" });
    }
}
const edit_supplier=async(req,res)=>{
    const { user, supplier_edit } = req.body;
    try {
        let supplier = await Suppliers.find({ _id: supplier_edit._id });
        if(supplier.length==0){res.json({ message: "Không tìm thấy supplier" });}
        supplier = supplier[0];
        let check = await Suppliers.findOne({ 
          _id: { $ne: supplier._id }, 
          phone: supplier_edit.phone 
        });
        if (check) {
          return res.json({ message: "Số điện thoại này đã được đăng ký" });
        }
        const oldProduct = JSON.parse(JSON.stringify(supplier));

        // Cập nhật thông tin sản phẩm
        supplier = await Suppliers.findByIdAndUpdate(
            supplier_edit._id,
            supplier_edit,
            { new: true, runValidators: true }
        );

        if (!supplier) {
            return res.status(404).json({ message: 'supplier not found' });
        }

        // Sử dụng Change Stream để theo dõi thay đổi

                const updatedFields = Object.keys(supplier_edit);

                // Loại bỏ trường createdAt khỏi danh sách thay đổi
                const filteredFields = updatedFields.filter(field => {
                    if(field=='creater'||field=='owner') {
                        return false;}
                    
                    return oldProduct[field] !== supplier_edit[field]
                });
                    
                console.log(filteredFields)
                if (filteredFields.length > 0) {
                    // Lấy các thay đổi chi tiết (so sánh cũ và mới)
                    const changes = filteredFields.map(field => {
                        const oldValue = oldProduct[field];
                        const newValue = supplier_edit[field];
                        
                        // Ghi lại thay đổi theo format "field changed from oldValue to newValue"
                        return `${field} changed from '${oldValue}' to '${newValue}'`;
                    });

                    const history = new supplierCHistory({
                        owner: user.id_owner, // ID của chủ cửa hàng
                        employee: user._id,   // ID của nhân viên thực hiện
                        supplier: supplier_edit.name,
                        action: 'update',
                        details: `${changes.join(', ')}. `  // Thêm chi tiết thay đổi vào lịch sử
                    });

                    try {
                        await history.save();
                    } catch (err) {
                        console.error('Error saving history:', err);
                    }
                }
            

        // Trả về phản hồi thành công
        res.json({ message: "success" });
    } catch (error) {
        console.error('Server Error:', error); // Thêm dòng này để ghi log lỗi vào console server
        res.status(500).json({ message: 'Server error', error: error.message }); // Trả về chỉ thông điệp lỗi
    }

}
const get_history_supplier=async(req,res)=>{
    const { user } = req.body;
    try {
        const activities = await supplierCHistory.find({ owner: user.id_owner }) // Lấy lịch sử hoạt động của người chủ
            .populate('employee', 'name email') // Lấy tên nhân viên
            .populate('supplier')
            .sort({ timestamp: -1 }) // Sắp xếp theo thời gian
            .select('employee supplier action timestamp details') // Chọn các trường cần thiết
            .lean();
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error in get_history:', error); // Log lỗi chi tiết
        res.status(500).json({ message: error.message });
    }
}
const delete_supplier=async(req,res)=>{
    const { user,supplier_delete,detail } = req.body;
    try {
        const supplier = await Suppliers.findByIdAndDelete(supplier_delete._id);
        if (!supplier) {
            return res.status(404).json({ message: 'supplier not found' });
        }
        const history = new supplierCHistory({
            owner: user.id_owner, // ID của người chủ
            employee: user._id, // ID của nhân viên thực hiện hành động
            supplier: supplier.name,
            action: 'delete',
            details: detail
        });
        await history.save();
        res.status(200).json({ message: 'success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getProductsBySupplier = async (req, res) => {
    const { productId,ownerId } = req.query;
    console.log(productId,ownerId)
    const objectIdSupplierId = new mongoose.Types.ObjectId(productId);
    // Kiểm tra xem productId có tồn tại trong query params không
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    try {
      const products = await Products.aggregate([
        {
          $lookup: {
            from: "Suppliers",
            localField: "supplier",
            foreignField: "_id",
            as: "supplierDetails",
          },
        },
        {
          $unwind: {
            path: "$supplierDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "supplierDetails._id": objectIdSupplierId,
            "supplierDetails.owner":new mongoose.Types.ObjectId(ownerId),
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            image: 1,
            purchasePrice: 1,
            "supplierDetails._id": 1,
            "supplierDetails.name": 1,
            "supplierDetails.email": 1,
          },
        },
      ]);
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for this supplier" });
      }
      // Trả về danh sách sản phẩm nếu tìm thấy
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products by supplier:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  const getProductsByProductName = async (req, res) => {
    const { query,ownerId } = req.query;
    const objectProductId = query;
    console.log(query,ownerId)
    // Kiểm tra xem productId có tồn tại trong query params không
    if (!objectProductId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    try {
      const products = await Products.aggregate([
        {
          $lookup: {
            from: "Suppliers",
            localField: "supplier",
            foreignField: "_id",
            as: "supplierDetails",
          },
        },
        {
          $unwind: {
            path: "$supplierDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            name: {
              $regex: objectProductId, 
              $options: "i", 
            },
            "supplierDetails.owner": new mongoose.Types.ObjectId(ownerId) 
          },
        },
        {
          $project: {
            name: 1,
            description: 1,
            image: 1,
            purchasePrice: 1,
            "supplierDetails._id": 1,
            "supplierDetails.name": 1,
            "supplierDetails.email": 1,
          },
        },
      ]);
      if (products.length === 0) {
        return res
          .status(404)
          .json({ message: "No products found for this supplier" });
      }
      // Trả về danh sách sản phẩm nếu tìm thấy
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products by supplier:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
module.exports = {
    show,
    edit,
    deletes,
    show_detail,
    create,
    get_history,
    get_supplier,
    create_supplier,
    edit_supplier,
    get_history_supplier,
    delete_supplier,
    getProductsBySupplier,
    getProductsByProductName,
}