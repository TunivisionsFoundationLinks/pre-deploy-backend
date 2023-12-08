import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete";
import bcrypt from "bcrypt";
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
          enum: [
            "Marketing",
            "Events",
            "Sponsoring",
            "Ressource Humaine",
            "Chapter",
          ],
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

ChapterSchema.pre("save", async function (nxt) {
  try {
    if (!this.isModified("password")) return nxt();
    this.password = await bcrypt.hash(this.password, 10);
    return nxt();
  } catch (err) {
    throw err;
  }
});
ChapterSchema.plugin(softDelete);
const ChapterModel = mongoose.model("Chapter", ChapterSchema);
export default ChapterModel;
