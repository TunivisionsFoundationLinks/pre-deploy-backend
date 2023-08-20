import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete";

const projectSchema = mongoose.Schema(
  {
    name: String,
    description: { type: String, required: true },
    likes: [],
    createdAt: {
      type: Date,
      default: new Date(),
    },
    CreateBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ["Chapter", "Club", "Project"],
    },
    image: String,
    verify: Boolean,
  },

  { timestamps: true }
);

projectSchema.plugin(softDelete);
var projects = mongoose.model("Projects", projectSchema);
export default projects;
