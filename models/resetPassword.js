import mongoose from "mongoose";
const Schema = mongoose.Schema;
const resetPasswordTokenSchema = new Schema({
    ref: {
        type: String,
        required: true,

    },
    owner: { type: Schema.Types.ObjectId, required: true },
    //expires after 5min
    expires: {
        type: Date,
        required: true,
        default: Date.now() + 1000 * 60 * 5,
        expires: 1000 * 60 * 5,
    },
});
const resetPasswordToken = mongoose.model(
    "resetPasswordToken",
    resetPasswordTokenSchema,
    "resetPasswordToken"
);
export default resetPasswordToken;
