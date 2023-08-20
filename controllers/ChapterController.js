import ChapterModel from "../models/ChapterModel.js";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import sharp from "sharp";
import path from "path";
export const CreateChapter = asyncHandler(async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
    const newChapter = new ChapterModel(req.body);
    // addition new
    const oldChapter = await ChapterModel.findOne({
      ChapterName: newChapter.ChapterName,
    });
    if (oldChapter)
      return res.status(400).json({ message: "Chapter already exists" });

    // changed
    const Chapter = await newChapter.save();
    res.status(200).json({ Chapter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getAllChapters = asyncHandler(async (req, res) => {
  try {
    let Chapters = await ChapterModel.find();
    Chapters = Chapters.map((chapter) => {
      const { password, ...otherDetails } = chapter._doc;
      return otherDetails;
    });
    res.status(200).json(Chapters);
  } catch (error) {
    res.status(500).json(error);
  }
});

export const getChapter = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Chapter = await ChapterModel.findById(id);
    if (Chapter) {
      const { password, ...otherDetails } = Chapter._doc;

      res.status(200).json({ otherDetails });
    } else {
      res.status(404).json("No such Chapter");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export const UpdateChapter = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Chapter = await ChapterModel.findByIdAndUpdate(id, req.body);
    Chapter.save();
    res.status(200).json({ Chapter });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

export const DeleteChapter = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Chapter = await ChapterModel.findById({ _id: id });
    await Chapter.deleteOne();
    res.status(200).json({ msg: "chapter deleted success" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

export const addMembresChapter = asyncHandler(async (req, res) => {
  try {
    const id = req.body.id;
    const Tunimateur = req.body.tunimateur;
    const role = req.body.role;
    const Departement = req.body.Departement;
    const upadateObject = ChapterModel.findById(id)
      .then((result) =>
        result.Tunimateurs.filter(
          (obj) => (obj.role === role) & (obj.Departement === Departement)
        )
      )
      .then((results) => console.log(results));
    console.log("updated" + JSON.stringify(upadateObject));
    ChapterModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          Tunimateurs: {
            membres: Tunimateur,
            role: req.body.role,
            Departement: req.body.Departement,
          },
        },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) return res.status(422).json({ error: err.message });
        UserModel.findByIdAndUpdate(Tunimateur, {
          role: req.body.role,
          Departement: req.body.Departement,
        })
          .then((result) => res.status(200).json(result))
          .catch((err) => {
            return res.status(422).json({ error: err.message });
          });
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
});
export const RemouveMembresChapter = asyncHandler((req, res) => {
  try {
    const id = req.body.id;
    const Tunimateur = req.body.tunimateur;
    console.log(req.body);
    ChapterModel.findByIdAndUpdate(
      { _id: id },
      {
        $pull: {
          Tunimateurs: {
            membres: Tunimateur,
            role: req.body.role,
            Departement: req.body.Departement,
          },
        },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) return res.status(422).json({ error: err.message });
        UserModel.findByIdAndUpdate(Tunimateur, {
          role: req.body.role,
          Departement: req.body.Departement,
        })
          .then((result) => res.status(200).json(result))
          .catch((err) => {
            return res.status(422).json({ error: err.message });
          });
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
});
export const updateProfileImage = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const profileImage = req.file.filename;

  try {
    const Chapter = await ChapterModel.findByIdAndUpdate(id, {
      profileImage: profileImage,
    });
    Chapter.save();
    res.status(200).json({ Chapter });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
export const updateCoverImage = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const coverImage = req.file.filename;

  try {
    const resized = await sharp(req.file.path)
      .resize({ width: 1200, height: 630 })
      .jpeg({ quality: 90 })
      .toFile(coverImage + "123xxx11");
    const Chapter = await ChapterModel.findByIdAndUpdate(id, {
      coverImage: resized,
    });
    console.log(resized);
    Chapter.save();
    res.status(200).json({ Chapter });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
