import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"

const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
    },
    senderId: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
MessageSchema.plugin(softDelete)
const MessageModel = mongoose.model("Message", MessageSchema);
export default MessageModel
