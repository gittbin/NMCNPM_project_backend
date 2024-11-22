const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    required: true 
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Users', 
    required: true 
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Message", messageSchema);
