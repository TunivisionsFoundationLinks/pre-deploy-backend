import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"

const ChatSchema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);
ChatSchema.plugin(softDelete)
const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;
