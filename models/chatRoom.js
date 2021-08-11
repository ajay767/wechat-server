const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    roomId: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    admin: String,
    visibility: Boolean,
  },
  { timestamps: true }
);

const ChatRoomModel = mongoose.model('ChatRoom', chatSchema);

module.exports = ChatRoomModel;
