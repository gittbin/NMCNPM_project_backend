const Message = require("../modules/Message");

const saveMessageToDB = async (data) => {
  const newMessage = new Message({
    sender: data.sender,
    owner: data.owner,
    content: data.content,
  });

  try {
    await newMessage.save();
    console.log("Message saved to MongoDB");
  } catch (err) {
    console.error("Error saving message to MongoDB:", err);
  }
};

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected in chat controller:", socket.id);

    socket.on("send_message", async (data) => {
      await saveMessageToDB(data);

      // Phát tin nhắn cho tất cả client
      io.emit("receive_message", data);
    });

    socket.on("receive_message", async (data) => {
      await saveMessageToDB(data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected from chat controller:", socket.id);
    });
  });
};

module.exports.getMessages = async (req, res) => {
  const { user } = req.body;
  try {
    const messages = await Message.find({ owner: user.id_owner })
      .populate('owner')
      .populate('sender') // Lấy thông tin từ bảng Users (name và email)
      .sort({ createdAt: 1 }); // Sắp xếp theo thời gian
    res.json(messages);
  } catch (err) {
    console.error('Error fetching messages:', err.message); // Ghi log lỗi vào console
    res.status(500).json({ error: err.message }); // Chỉ trả về nội dung lỗi thay vì toàn bộ đối tượng lỗi
  }
};
