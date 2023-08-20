import mongoose from "mongoose";
import softDelete from "mongoosejs-soft-delete";
const activity = new mongoose.Schema({
  activityName: {
    type: String,
    required: true,
  },
  activityCover: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  DateEvent: {
    type: String,
    required: true,
  },
  Themes: {
    type: String,
    enum: [
      "Conference",
      "Evenement",
      "Competition",
      "Training",
      "Action",
      "Team-building",
      "Party",
    ],
    required: true,
  },
  EventType: {
    type: String,
    enum: ["National", "Regional", "Intern"],
    required: true,
  },
  DossierSponsing: {
    type: String,
  },
  CreatorId: {
    type: String,
    required: true,
  },
  collabs: {
    type: Boolean,
    default: false,
  },

  partners: [],
  Chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
  },
  Participant: [
    {
      userid: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
      recu: { type: String, default: null },
      verify: { type: Boolean, default: false },
    },
  ],
  CoordinationEvent: [],
  accepted: {
    type: String,
    default: "waiting",
    enum: ["waiting", "Refused", "Accepted"],
  },
  giftedScore: { type: Number },
});

activity.plugin(softDelete);
const ActivityModel = mongoose.model("activity", activity);
export default ActivityModel;
