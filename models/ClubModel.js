import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete";

const ClubSchema = new mongoose.Schema(
  {
    ClubName: {
      type: String,
      required: true,
    },
    emailClubs: {
      type: String,
      required: true,
    },
    ImageProfile: { type: String },
    ImageCover: { type: String },
    password: {
      type: String,
      required: true,
    },
    Events: [{ type: mongoose.Schema.Types.ObjectId, ref: "activities" }],
    score: { type: Number, default: 0 },
    ChapterId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "chapters",
    },
    followers: [],

    Bureau: [
      {
        membres: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        role: {
          type: String,
          enum: ["Assistant", "Vice President", "President"],
        },
        Departement: {
          type: String,
          enum: [
            "Marketing",
            "Events",
            "Sponsoring",
            "Ressource Humaine",
            "Club",
          ],
        },
        Mondat: {
          type: String,
        },
        EndMondat: {
          type: String,
        },
      },
    ],
    Tunimateurs: [
      {
        membres: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
        role: {
          type: String,
          enum: ["Tunimateur"],
        },
        Departement: {
          type: String,
          enum: ["Marketing", "Events", "Sponsoring", "Ressource Humaine"],
        },
        Mondat: {
          type: String,
        },
        EndMondat: {
          type: String,
        },
      },
    ],
    coverImage: {
      type: String,
    },
    profileImage: {
      type: String,
    },
    requeste: [
      {
        userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },

        Departement: {
          type: String,
          enum: ["Marketing", "Events", "Sponsoring", "Ressource Humaine"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
ClubSchema.plugin(softDelete);
const Club = mongoose.model("Club", ClubSchema);
export default Club;
