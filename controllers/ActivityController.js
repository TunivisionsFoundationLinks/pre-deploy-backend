import ActivityModel from "../models/activitesModel.js";
import Club from "../models/ClubModel.js";
import ChapterModel from "../models/ChapterModel.js";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
const chapterDetails = {
  ChapterName: 1,
  EventNational: 1,
  followers: 1,
  _id: 1,
};
const ClubDetails = {
  requeste: 1,
  ClubName: 1,
  ChapterId: 1,
  Events: 1,
};
const userDetails = {
  _id: 1,
  firstname: 1,
  lastname: 1,
  activityParticipation: 1,
};
export const CreateActivity = asyncHandler(async (req, res) => {
  try {
    const createdBy = req.body.CreatorId;

    const isChapter = await ChapterModel.findById(createdBy).select(
      chapterDetails
    );

    const isClub = await Club.findById(createdBy);

    const newActivity = new ActivityModel({
      ...req.body,
      CreatorId: createdBy,
      accpted: true,
      activityCover: req.files["activityCover"][0].filename,
    });

    if (req.files["DossierSponsing"][0]) {
      newActivity.DossierSponsing = req.files["DossierSponsing"][0].filename;
    }

    if (isChapter) {
      if (req.body.partners) {
        newActivity.collabs = true;
        newActivity.collabswith = req.body.collabswith;
      }
      newActivity.EventType = "National";
      newActivity.accpted = true;
      ChapterModel.findByIdAndUpdate(
        { _id: createdBy },
        {
          $push: {
            EventNational: newActivity._id,
          },
        },
        {
          new: true,
        },
        (err, result) => {
          if (err) {
            return res.status(422).json({ error: err.message });
          }
        }
      );
      await newActivity.save();
    }

    if (isClub) {
      if (req.body.partners) {
        newActivity.collabs = true;
      }
      Club.findByIdAndUpdate(
        { _id: createdBy },
        {
          $push: {
            Events: newActivity._id,
          },
        },
        {
          new: true,
        },
        (err, result) => {
          if (err) {
            return res.status(422).json({ error: err.message });
          }
        }
      );
      await newActivity.save();
    }

    return res.status(200).json(newActivity);
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
});
export const getAllActivitys = asyncHandler(async (req, res) => {
  try {
    const activitys = await ActivityModel.find();
    return res.status(200).json(activitys);
  } catch (error) {
    return res.status(200).json(error.message);
  }
});
export const getActivity = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;

    const activitys = await ActivityModel.findById(id);
    res.status(200).send(activitys);
  } catch (error) {
    return res.status(200).json(error.message);
  }
});
export const participation = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const userid = req.body.userid;
    const user = await UserModel.findById(userid);
    if (!user) {
      return res.status(422).json("User Indéfine");
    }
    const activity = await ActivityModel.findById(id);
    const exist = activity.Participant.findIndex(
      (user) => user.userid.toString() === req.body.userid
    );
    if (exist !== -1) {
      return res.status(422).json("already Participate in this event");
    }
    const index = user.activityParticipation.findIndex(
      (activity) => activity.toString() === id
    );
    if (index !== -1) {
      return res.status(422).json("already you are in the event");
    }
    ActivityModel.findByIdAndUpdate(
      id,
      {
        $push: { Participant: { userid: req.body.userid, verify: true } },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err.message });
        }
        UserModel.findByIdAndUpdate(userid, {
          $push: { activityParticipation: id },
        })
          .then((result) => {
            return res.status(200).json("participant");
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    return res.status(200).json(error.message);
  }
});
export const unparticipation = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const userid = req.body.userid;
    const user = await UserModel.findById(userid).select(userDetails);

    if (!user) {
      return res.status(422).json("User Indéfine");
    }
    const activitys = await ActivityModel.findById(id);
    const exist = await activitys.Participant.findIndex(
      (user) => user.userid.toString() === req.body.userid
    );
    if (exist === -1) {
      return res.status(422).json("user is not define in the event");
    }
    await activitys.Participant.splice(exist, 1);

    activitys.save();
    const index = user.activityParticipation.findIndex(
      (activity) => activity.toString() === id
    );
    user.activityParticipation.splice(index, 1);
    await user.save();
    return res.status(200).json("see you next event");
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
export const verified = asyncHandler(async (req, res) => {
  try {
    const uuserid = req.body.userid;
    const activity = req.params.id;
    const getActivity = await ActivityModel.findById(activity);
    const index = getActivity.Participant.findIndex(
      (e) => e.user.toString() === uuserid
    );

    if (index === -1) {
      return res.status(400).json("user undefined");
    }
    const isNation = getActivity.EventType === "National";
    if (isNation) {
      getActivity.Participant[index].verified = req.body.verify;
    }
    getActivity.save();
    return res.status(200).json("user exist");
  } catch (error) {
    return res.status(500).json(error);
  }
});
export const sendRecu = asyncHandler(async (req, res) => {
  try {
    const recus = req.file.filename;
    const id = req.params.id;
    const activitys = await ActivityModel.findById(id);
    const user = req.body.userid;
    const index = activitys?.Participant?.findIndex(
      (e) => e.user?.toString?.() === user
    );

    if (index === -1) {
      return res.status(400).json("user is not exist");
    }
    activitys.Participant[index].recu = recus;
    await activitys.save();
    return res.status(200).json("payment sent successfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
export const acceptedEvent = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    await ActivityModel.findByIdAndUpdate(id, {
      accepted: "Accepted",
    });
    return res.status(201).json("activity accepted");
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
export const RefusedEvent = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    await ActivityModel.findByIdAndUpdate(id, {
      accepted: "Refused",
    });
    return res.status(201).json("activity refused");
  } catch (error) {
    return res.status(500).json(error.message);
  }
});
