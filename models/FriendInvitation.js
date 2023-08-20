import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"

const friendInvitationSchema = mongoose.Schema(
    {
        // User sending the invitation
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // User who is being invited
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);
friendInvitationSchema.plugin(softDelete)
var friendInvitation = mongoose.model("FriendInvitation", friendInvitationSchema);

export default friendInvitation
