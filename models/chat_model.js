// models/message_model.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  cmd: { type: String, required: true },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AUTH",
    required: true,
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AUTH",
    required: true,
  },
  msgtext: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const ChatMessage = mongoose.model("ChatMessage", messageSchema);
module.exports = ChatMessage;
