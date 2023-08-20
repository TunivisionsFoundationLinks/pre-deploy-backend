import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete";

const postSchema = mongoose.Schema(
  {
    createBy: { type: String, required: true },
    desc: { type: String },
    likes: [],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    content: [String],
  },
  {
    timestamps: true,
  }
);
postSchema.plugin(softDelete);
var PostModel = mongoose.model("Posts", postSchema);

export default PostModel;
