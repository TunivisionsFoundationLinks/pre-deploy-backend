import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"

const groupChatSchema = mongoose.Schema(
    {
        name: {
            type: String,
            unique: false,
            required: [true, "can't be blank"],
        },
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        ],

        // creator of the group
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

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
groupChatSchema.plugin(softDelete)
var GroupChat = mongoose.model("GroupChat", groupChatSchema);

export default GroupChat