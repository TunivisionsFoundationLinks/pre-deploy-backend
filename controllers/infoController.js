import InfoModel from "../models/informations.js";
import asyncHandler from "express-async-handler"
// get all infos event
export const getInfo = asyncHandler(async (req, res) => {
  try {
    const informations = await InfoModel.find();
    return res.status(200).json(informations);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all infos event by id
export const getInfoById = asyncHandler(async (req, res) => {
  const info = req.params.id;
  try {
    const informations = await InfoModel.findOne({ id: info });
    return res.status(200).json(informations);
  } catch (error) {
    res.status(500).json(error);
  }
});
// create infos event
export const CreateInfo = asyncHandler(async (req, res) => {
  const newInfos = new InfoModel(req.body);
  try {
    await newInfos.save();
    return res.status(200).send(newInfos);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// update infos
export const updateInfo = asyncHandler(async (req, res) => {
  const infoId = req.params.id;
  const { userId } = req.body;

  try {
    const info = await InfoModel.findById(infoId);
    if (info.userId === userId) {
      await info.updateOne({ $set: req.body });
      res.status(200).send("info updated!");
    } else {
      res.status(403).send("Authentication failed");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete info
export const deleteInfo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const info = await InfoModel.findById(id);
    if (info.userId === userId) {
      await info.deleteOne();
      res.status(200).send("info deleted.");
    } else {
      res.status(403).send("Action forbidden");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
