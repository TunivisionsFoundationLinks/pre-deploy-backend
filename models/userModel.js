import bcrypt from "bcrypt";
import mongoose from "mongoose";
const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    gender: { required: true, type: String, enum: ["female", "male"] },
    points: {
      type: Number,
      default: 0,
    },
    skills: [
      {
        name: { type: String },
        level: { type: String },
      },
    ],
    certificates: [
      {
        name: { type: String },
        date: { type: Date },
        file: { type: String },
        company: { type: String },
        url: { type: String },
      },
    ],
    cv: { type: String },
    birthDate: { type: Date },
    profilePicture: String,
    coverPicture: String,
    followers: [],
    following: [],
    totalScore: { type: Number, default: 0 },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    groupChats: [{ type: mongoose.Schema.Types.ObjectId, ref: "GroupChat" }],
    region: {
      type: String,
      required: true,
    },
    isAdmin: { type: Boolean, default: false },
    isBureau: { type: Boolean, default: false },
    isClub: { type: Boolean, default: false },
    DetailsTunimateur: [
      {
        club: { type: String },
        ClubName: { type: String },
        Chapter: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "chapters",
        },
        ChapterName: {
          type: String,
          ref: "chapters",
        },
        role: {
          type: String,
          enum: [
            "Tunimateur",
            "Assistant",
            "Vice President",
            "Manager",
            "President",
            "Coordinateur",
          ],
          default: "Tunimateur",
        },
        Departement: {
          type: String,
          enum: [
            "Marketing",
            "Events",
            "Sponsoring",
            "Ressource Humaine",
            "Club",
            "Chapter",
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
    Chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chapters",
    },
    ChapterName: {
      type: String,
      ref: "chapters",
    },
    club: { type: String },
    clubName: { type: String },
    role: {
      type: String,
      enum: [
        "Tunimateur",
        "Assistant",
        "Vice President",
        "President",
        "Manager",
        "Coordinateur",
      ],
      default: "Tunimateur",
    },
    Departement: {
      type: String,
      enum: [
        "Marketing",
        "Events",
        "Sponsoring",
        "Ressource Humaine",
        "Club",
        "Chapter",
      ],
    },
    activityParticipation: [
      { type: mongoose.Schema.Types.ObjectId, ref: "activities" },
    ],
    request: { type: Boolean, default: false },
    Blocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function (password) {
  try {
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (err) {
    throw err;
  }
};
UserSchema.pre("save", async function (nxt) {
  try {
    if (!this.isModified("password")) return nxt();
    this.password = await bcrypt.hash(this.password, 10);
    return nxt();
  } catch (err) {
    throw err;
  }
});

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;
