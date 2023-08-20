import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete"

const InfoSchema = mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    typeProject: { type: String, required: true },
    dateProject: { type: String, required: true },
    Location: { type: String, required: true },
    mail: { type: String, required: true },
    public: { type: Boolean, required: true },
    objective: { type: String, required: true },
    plan: { type: String, required: true },
    logistic: { type: String, required: true },
    invite: { type: String, required: true },
    budget: { type: String, required: true },
    impact: { type: String, required: true },
    Programme: { type: String, required: true },
    taches: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
InfoSchema.plugin(softDelete)
var InfoModel = mongoose.model("Information", InfoSchema);

export default InfoModel;
