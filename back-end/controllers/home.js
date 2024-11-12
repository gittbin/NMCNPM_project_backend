const Products = require("../modules/products");
const Bills = require("../modules/bill");
const Customer = require("../modules/customer");
const total_revenue = async (req, res) => {
  const {user} =req.body

  try {
    // Lấy ngày hôm nay và ngày hôm qua
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const todayString = today.toISOString().substring(0, 10);
    const yesterdayString = yesterday.toISOString().substring(0, 10);
    // Fetch tất cả các hóa đơn
    const bills = await Bills.find({owner:user._id});

    // Tính tổng doanh thu cho hôm nay và hôm qua
    let totalRevenueToday = 0;
    let totalRevenueYesterday = 0;
    
    bills .forEach(bill => {
      const billDate = new Date(bill.orderDate); // Giả sử bạn có trường createdAt
      // Tính doanh thu cho ngày hôm nay
      const billDateString = billDate.toISOString().substring(0, 10);

      if (billDateString === todayString) {
        let amount = parseFloat(bill.totalAmount.replace(/\./g, '')) || 0;
        const discount = parseFloat(bill.discount.replace(/\./g, '')) || 0;
        const vat = parseFloat(bill.vat.replace(/\./g, '')) || 0;
  
  
        totalRevenueToday += amount;
      }
      // Tính doanh thu cho ngày hôm qua
      else if (billDateString === yesterdayString) {
        let amount = parseFloat(bill.totalAmount.replace(/\./g, '')) || 0;
        const discount = parseFloat(bill.discount.replace(/\./g, '')) || 0;
        const vat = parseFloat(bill.vat.replace(/\./g, '')) || 0;
  
        totalRevenueYesterday += amount;
      }
    });

    // Tính phần trăm thay đổi
    let percentChange = 0;
    let message = "";
    if (totalRevenueYesterday > 0) {
      percentChange = ((totalRevenueToday - totalRevenueYesterday) / totalRevenueYesterday) * 100;
    } else if (totalRevenueToday > 0) {
      percentChange = 100; // Nếu hôm qua không có doanh thu mà hôm nay có doanh thu
    }
    if (percentChange > 0) {
      message = `up`;
    } else if (percentChange < 0) {
      message = `down`;
      percentChange=-percentChange
    } else {
      message = 'notchange';
    }
    console.log("Total Revenue Today:", totalRevenueToday);
    console.log("Total Revenue Yesterday:", totalRevenueYesterday);
    console.log("Percent Change:", percentChange.toFixed(2) + "%");
    console.log("state:", message);
    // Trả về doanh thu hôm nay và phần trăm thay đổi
    return res.status(200).json({
      totalRevenueToday:totalRevenueToday.toLocaleString('vi-VN', { style: "currency", currency: "VND" }),
      totalRevenueYesterday:totalRevenueYesterday.toLocaleString('vi-VN' ,{ style: "currency", currency: "VND" }),
      percentChange: percentChange.toFixed(2)+ "%",
      state:message // Làm tròn đến 2 chữ số thập phân
    });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    return res.status(500).json({ error: "Error calculating total revenue" });
  }
};
const today_income = async (req, res) => {
  const { user } = req.body;

  try {
      // Lấy ngày hôm nay và ngày hôm qua
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const todayString = today.toISOString().substring(0, 10);
      const yesterdayString = yesterday.toISOString().substring(0, 10);
      
      // Fetch tất cả các hóa đơn
      const bills = await Bills.find({ owner: user._id }).populate('items.productID');
      // Tính tổng doanh thu cho hôm nay và hôm qua
      let totalRevenueToday = 0;
      let totalRevenueYesterday = 0;
      let totalCostToday = 0;
      let totalCostYesterday = 0;

      bills.forEach(bill => {
          const billDate = new Date(bill.orderDate); // Giả sử bạn có trường orderDate
          const billDateString = billDate.toISOString().substring(0, 10);

          // Tính doanh thu và chi phí cho ngày hôm nay
          if (billDateString === todayString) {
              let amount = parseFloat(bill.totalAmount.replace(/\./g, '')) || 0;
              totalRevenueToday += amount;
              // Tính tổng chi phí
              bill.items.forEach(item => {
                  const purchasePrice = parseFloat(item.productID.purchasePrice.replace(/\./g, '')); // Giá nhập
                  totalCostToday += purchasePrice * item.quantity; // Tính chi phí tổng
              });
          }
          // Tính doanh thu và chi phí cho ngày hôm qua
          else if (billDateString === yesterdayString) {
              let amount = parseFloat(bill.totalAmount.replace(/\./g, '')) || 0;
              totalRevenueYesterday += amount;

              // Tính tổng chi phí
              bill.items.forEach(item => {
                  const purchasePrice = parseFloat(item.productID.purchasePrice.replace(/\./g, '')); // Giá nhập
                  totalCostYesterday += purchasePrice * item.quantity; // Tính chi phí tổng
              });
          }
      });

      // Tính lợi nhuận
      const profitToday = totalRevenueToday - totalCostToday;
      const profitYesterday = totalRevenueYesterday - totalCostYesterday;
      let percentChange = 0;
      let message = "";
      if (profitYesterday > 0) {
        percentChange = ((profitToday - profitYesterday) / profitYesterday) * 100;
      } else if (profitToday > 0) {
        percentChange = 100; // Nếu hôm qua không có doanh thu mà hôm nay có doanh thu
      }
      if (percentChange > 0) {
        message = `up`;
      } else if (percentChange < 0) {
        message = `down`;
        percentChange=-percentChange
      } else {
        message = 'notchange';
      }
      res.json({
          profitToday:profitToday.toLocaleString('vi-VN', { style: "currency", currency: "VND" }),
          profitYesterday:profitYesterday.toLocaleString('vi-VN', { style: "currency", currency: "VND" }),
          percentChange:percentChange.toFixed(2)+"%",
          state: message,
      });
  } catch (error) {
      console.error('Error calculating income:', error);
      res.status(500).json({ error: 'An error occurred while calculating income.' });
  }
};
const new_customer = async (req, res) => {
  const { user } = req.body;

  try {
      // Lấy ngày hôm nay và ngày hôm qua
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const todayString = today.toISOString().substring(0, 10);
      const yesterdayString = yesterday.toISOString().substring(0, 10);
      
      // Fetch tất cả các hóa đơn
      const customers = await Customer.find({ owner: user._id });
      // Tính tổng doanh thu cho hôm nay và hôm qua
      let customerToday = 0;
      let customerYesterday = 0;


      customers.forEach(customer => {
          const billDate = new Date(customer.createdAt); // Giả sử bạn có trường orderDate
          const billDateString = billDate.toISOString().substring(0, 10);

          // Tính doanh thu và chi phí cho ngày hôm nay
          if (billDateString === todayString) {
            customerToday += 1;
          }
          // Tính doanh thu và chi phí cho ngày hôm qua
          else if (billDateString === yesterdayString) {
            customerYesterday += 1;
              
          }
      });

      // Tính lợi nhuận
      let percentChange = 0;
      let message = "";
      if (customerYesterday > 0) {
        percentChange = ((customerToday - customerYesterday) / customerYesterday) * 100;
      } else if (customerToday > 0) {
        percentChange = 100; // Nếu hôm qua không có doanh thu mà hôm nay có doanh thu
      }
      if (percentChange > 0) {
        message = `up`;
      } else if (percentChange < 0) {
        message = `down`;
        percentChange=-percentChange
      } else {
        message = 'notchange';
      }
      res.json({
          customerToday,
          customerYesterday,
          percentChange:percentChange.toFixed(2)+"%",
          state: message,
      });
  } catch (error) {
      console.error('Error calculating income:', error);
      res.status(500).json({ error: 'An error occurred while calculating income.' });
  }
};
const generateCustomerReport = async (req,res) => {
  const { user } = req.body;

  const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const report = [];

 try{ for (let i = 0; i < 11; i++) {
      const month = months[i];
      
      // Tính ngày bắt đầu và kết thúc của tháng hiện tại
      const startDate = new Date(`2024-${i + 1}-01`);
      const endDate = new Date(`2024-${i + 2}-01`);

      // Tìm khách hàng có giao dịch trong tháng i
      const customers = await Customer.find({
        owner: user._id, 
          $or: [
              { "firstPurchaseDate": { $gte: startDate, $lt: endDate } },
              { "lastPurchaseDate": { $gte: startDate, $lt: endDate } }
          ]
      })
      // Phân loại khách hàng
      const loyalCustomers = customers.filter(customer => 
          customer.rate >= 2 && parseFloat(customer.money.replace(/\./g,'')) >= 50000
      ).length;

      const newCustomers = customers.filter(customer => 
          customer.rate === 1 && new Date(customer.firstPurchaseDate).getMonth() === i
      ).length;

      const returningCustomers = customers.filter(customer => 
          customer.rate > 1 && 
          new Date(customer.lastPurchaseDate).getMonth() === i &&
          new Date(customer.firstPurchaseDate).getMonth() < i
      ).length;

      // Thêm dữ liệu vào báo cáo
      report.push({
          name: month,
          "Khách hàng trung thành": loyalCustomers,
          "Khách hàng mới": newCustomers,
          "Khách hàng quay lại": returningCustomers
      });
      
  }
res.json(report)
}catch(e){
    console.log(e.message);
  }

};



module.exports = {
  total_revenue,
  today_income,
  new_customer,
  generateCustomerReport
};
