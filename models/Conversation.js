import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"

const conversationSchema = mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        messages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message",
                required: true,
            },
        ],
    },
    { timestamps: true }
);
conversationSchema.plugin(softDelete)
var Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
