import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"

const messageSchema = mongoose.Schema(
    {
        // sender of the message
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        content: {
            type: String,
            required: [true, "can't be blank"],
        },

        type: {
            type: String,
        }
    },
    { timestamps: true }
);

messageSchema.plugin(softDelete)
var Message = mongoose.model("MessagesSocket", messageSchema);
export default Message
