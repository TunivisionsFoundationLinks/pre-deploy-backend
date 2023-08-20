import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete";

const ChapterSchema = new mongoose.Schema(
  {
    ChapterName: {
      type: String,
      required: true,
    },
    emailChapters: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    followers: [],
    Tunimateurs: [
      {
        membres: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        role: { type: String, enum: ["Assistant", "Manager", "Coordinateur"] },
        Departement: {
          type: String,
          enum: ["Marketing", "Events", "Sponsoring", "Ressource Humaine"],
        },
      },
    ],
    Clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }],
    EventNational: [
      { type: mongoose.Schema.Types.ObjectId, ref: "activities" },
    ],
  },

  {
    timestamps: true,
  }
);
ChapterSchema.plugin(softDelete);
const ChapterModel = mongoose.model("Chapter", ChapterSchema);
export default ChapterModel;
