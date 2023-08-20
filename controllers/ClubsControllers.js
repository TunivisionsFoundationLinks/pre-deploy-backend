import Club from "../models/ClubModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import ChapterModel from "../models/ChapterModel.js";
import UserModel from "../models/userModel.js";

const UserDetails = {
  profilePicture: 1,
  club: 1,
  coverPicture: 1,
  email: 1,
  DetailsTunimateur: 1,
  clubName: 1,
  firstname: 1,
  lastname: 1,
  following: 1,
  Departement: 1,
  role: 1,
  _id: 1,
};
const chapterDetails = {
  ChapterName: 1,
  followers: 1,
  _id: 1,
};
const ClubDetails = {
  requeste: 1,
  ClubName: 1,
  ChapterId: 1,
  followers: 1,
  Tunimateurs: 1,
  Bureau: 1,
  score: 1,
  coverImage: 1,
  profileImage: 1,
  Events: 1,
};
export const CreateClub = asyncHandler(async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPass;
    const newClub = new Club(req.body);
    // addition new
    const oldClub = await Club.findOne({
      ClubName: newClub.ClubName,
    });
    const UsedEmail = await Club.findOne({
      emailClubs: newClub.emailClubs,
    });
    if (oldClub)
      return res.status(400).json({ message: "Club already exists" });
    if (UsedEmail)
      return res.status(400).json({ message: "Email already Used" });

    // changed
    const Clubs = await newClub.save();
    //add the club to the chapter
    const Chapter = await ChapterModel.findByIdAndUpdate(
      req.body.ChapterId,
      {
        $push: { Clubs: newClub },
      },
      {
        new: true,
      }
    );

    res.status(200).json({ Chapter, Clubs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getAllClubs = asyncHandler(async (req, res) => {
  try {
    let Clubs = await Club.find();
    Clubs = Clubs.map((Club) => {
      const { password, ...otherDetails } = Club._doc;
      return otherDetails;
    });
    res.status(200).json(Clubs);
  } catch (error) {
    res.status(500).json(error);
  }
});

export const getClub = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Clubs = await Club.findById(id);
    if (Club) {
      const { password, ...otherDetails } = Clubs._doc;

      res.status(200).json({ otherDetails });
    } else {
      res.status(404).json("No such Club");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export const UpdateClub = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Club = await Club.findByIdAndUpdate(id, req.body);
    Club.save();
    res.status(200).json({ Club });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

export const DeleteClub = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const Club = await Club.findById({ _id: id });
    await Club.deleteOne();
    res.status(200).json({ msg: "Club deleted success" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

export const addTunimateurs = asyncHandler(async (req, res) => {
  try {
    const Clubs = await Club.findById(req.params.id).select(ClubDetails); // getting the club
    const index = Clubs.Tunimateurs.findIndex(
      (e) => e.membres === req.body.userid
    ); // find index of tunimateur in the Club

    if (index !== -1) return res.status(400).json("already Tunimateur"); // check if exist
    var dateobj = new Date().getFullYear();
    var dateObject = dateobj.toString(); // get mondat year

    const User = await UserModel.findById(req.body.userid).select(UserDetails); // find user informations
    const indexRequest = Clubs.requeste.findIndex(
      (e) => e.userid.toString() === req.body.userid
    );

    if (indexRequest === -1) {
      return res.status(401).json("must be send request to join in this club");
    }
    const UserRole = User.DetailsTunimateur?.findIndex(
      (e) =>
        e.DetailsTunimateur &&
        e.DetailsTunimateur.Departement === req.body.Departement &&
        e.DetailsTunimateur.role === req.body.role
    ); // find index of role in tunimateur if they have this role

    if (UserRole !== -1) {
      return res.status(400).json("User already have this role");
    } else {
      const Chapters = await ChapterModel.findById(Clubs.ChapterId).select(
        chapterDetails
      );

      if (index === -1) {
        Clubs.Tunimateurs.push({
          membres: User,
          Departement: Clubs.requeste[indexRequest].Departement,
          Mondat: dateObject,
          EndMondat: dateobj + 1,
        }); //create new tunimateur in club
        Clubs.requeste?.splice(indexRequest, 1);
      } else {
        return res.status(401).json("user already in this club");
      }
      await User.DetailsTunimateur?.push({
        Chapter: Chapters._id,
        ChapterName: Chapters.ChapterName,
        role: req.body.role,
        Departement: req.body.Departement,
        club: Clubs._id,
        ClubName: Clubs.ClubName,
        Mondat: dateObject,
        EndMondat: dateobj + 1,
      }); // add new role to tunimateur
      User.club = Clubs._id;
      User.clubName = Clubs.ClubName;
      User.role = req.body.role;
      User.Departement = req.body.Departement;
      await User.following.push(Clubs.ChapterId);
      await User.following.push(Clubs._id);
      await Clubs.followers.push(User._id);

      await User.save();
      await Clubs.save();
      // save the modification in club & tunimateur
      return res.status(200).json(" Tunimateur Registred success");
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//add new Bureau members
export const addBureau = asyncHandler(async (req, res) => {
  try {
    const Clubs = await Club.findById(req.params.id).select(ClubDetails); // getting the club
    const index = Clubs.Tunimateurs?.findIndex(
      (e) => e.membres.toString() === req.body.userid
    ); // find index of tunimateur in the Club
    const indexBureau = Clubs.Bureau?.findIndex(
      (e) => e.membres.toString() === req.body.userid
    );

    if (index === -1 && indexBureau === -1)
      return res.status(400).json("is not Tunimateur");
    var dateobj = new Date().getFullYear();
    var dateObject = dateobj.toString(); // get mondat year

    const User = await UserModel.findById(req.body.userid).select(UserDetails); // find user informations

    const UserRole = Clubs.Bureau.findIndex(
      (e) =>
        e.Bureau &&
        e.Bureau.role.toString?.() === req.body.role.toString?.() &&
        e.Bureau.Departement.toString?.() === req.body.Departement.toString?.()
    ); // find index of role in tunimateur if they have this role
    if (UserRole !== -1) {
      return res.status(400).json("Role already taked !!");
    } else {
      const Chapters = await ChapterModel.findById(Clubs.ChapterId).select(
        chapterDetails
      );

      if (index !== -1) {
        Clubs.Bureau.push({
          membres: User,
          role: req.body.role,
          Departement: req.body.Departement,
          Mondat: dateObject,
          EndMondat: dateobj + 1,
        }); //create new tunimateur in club

        User.DetailsTunimateur.push({
          Chapter: Chapters._id,
          ChapterName: Chapters.ChapterName,
          role: req.body.role,
          Departement: req.body.Departement,
          ClubName: Clubs.ClubName,
          Mondat: dateObject,
          EndMondat: dateObject + 1,
        }); // add new role to tunimateur

        Clubs.Tunimateurs.splice(index, 1);
        User.club = Clubs._id;
        User.clubName = Clubs.ClubName;
        User.role = req.body.role;
        User.Departement = req.body.Departement;
        await User.save();
        await Clubs.save();
        // save the modification in club & tunimateur
        return res.status(200).json(" Tunimateur Registred success");
      }
      if (indexBureau !== -1) {
        Clubs.Bureau.splice(indexBureau, 1);
        Clubs.Bureau.push({
          membres: User,
          role: req.body.role,
          Departement: req.body.Departement,
          Mondat: dateObject,
          EndMondat: dateobj + 1,
        }); //create new tunimateur in club

        User.DetailsTunimateur.push({
          Chapter: Chapters._id,
          ChapterName: Chapters.ChapterName,
          role: req.body.role,
          Departement: req.body.Departement,
          ClubName: Clubs.ClubName,
          Mondat: dateObject,
          EndMondat: dateObject + 1,
        }); // add new role to tunimateur

        User.club = Clubs._id;
        User.clubName = Clubs.ClubName;

        User.role = req.body.role;
        User.Departement = req.body.Departement;
        await User.save();
        await Clubs.save();
        // save the modification in club & tunimateur
        return res.status(200).json(" Tunimateur Registred success");
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export const UpdateTunimateurs = asyncHandler(async (req, res) => {
  try {
    const Clubs = await Club.findById(req.params.id).select(ClubDetails); // getting the club
    const index = Clubs.Tunimateurs.findIndex(
      (e) => e.membres.id === req.body.userid
    ); // find index of tunimateur in the Club

    if (index === -1) return res.status(400).json("already Tunimateur"); // check if exist
    var dateobj = new Date().getFullYear();
    var dateObject = dateobj.toString(); // get mondat year

    const User = await UserModel.findById(req.body.userid).select(UserDetails); // find user informations

    const UserRole = User.DetailsTunimateur.findIndex(
      (e) =>
        e.Tunimateurs.Departement.toString?.() ===
          req.body.Departement.toString?.() &&
        e.Tunimateurs.role.toString?.() === req.body.role.toString?.()
    ); // find index of role in tunimateur if they have this role
    if (UserRole !== -1)
      return res.status(400).json("User already have this role");
    const Chapters = await ChapterModel.findById(Clubs.ChapterId).select(
      chapterDetails
    );
    if (index !== -1) {
      Clubs.Tunimateurs.push({
        membres: User,
        Departement: req.body?.Departement,
        Mondat: dateObject,
      }); //create new tunimateur in club
      User.DetailsTunimateur.push({
        Chapter: Chapters._id,
        ChapterName: Chapters.ChapterName,
        role: req.body.role,
        Departement: req.body.Departement,
        ClubName: Clubs.ClubName,
        Mondat: dateObject,
        EndMondat: dateobj + 1,
      }); // add new role to tunimateur
      Clubs.Tunimateurs.splice(index, 1);
      User.club = Clubs._id;
      User.clubName = Clubs.ClubName;

      User.role = req.body.role;
      User.Departement = req.body.Departement;
      await User.save();
      await Clubs.save();
      // save the modification in club & tunimateur
      return res.status(200).json("Tunimateur updated success");
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

//update role in Bureau members
export const UpdateBureau = asyncHandler(async (req, res) => {
  try {
    const Clubs = await Club.findById(req.params.id).select(ClubDetails); // getting the club
    const index = Clubs.Bureau.findIndex(
      (e) => e._id.toString() === req.body.userid
    ); // find index of tunimateur in the Club

    if (index === -1) return res.status(400).json("is not Tunimateur");
    var dateobj = new Date().getFullYear();
    var dateObject = dateobj.toString(); // get mondat year
    const User = await UserModel.findById(Clubs.Bureau[index]?.membres).select(
      UserDetails
    ); // find user informations

    const UserRole = Clubs.Bureau.findIndex(
      (e) =>
        e.Bureau &&
        e.Bureau?.role === req.body.role &&
        e.Bureau?.Departement === req.body.Departement
    ); // find index of role in tunimateur if they have this role

    if (UserRole !== -1) {
      return res.status(400).json("role is reserved");
    } else {
      const Chapters = await ChapterModel.findById(Clubs.ChapterId).select(
        chapterDetails
      );
      if (index !== -1) {
        Clubs.Bureau.push({
          membres: User,
          role: req.body.role,
          Departement: req.body.Departement,
          Mondat: dateObject,
          EndMondat: dateobj + 1,
        }); //create new tunimateur in club

        User.DetailsTunimateur.push({
          Chapter: Chapters._id,
          ChapterName: Chapters.ChapterName,
          role: req.body.role,
          Departement: req.body.Departement,
          ClubName: Clubs.ClubName,
          Mondat: dateObject,
          EndMondat: dateobj + 1,
        }); // add new role to tunimateur
        User.club = Clubs._id;
        User.clubName = Clubs.ClubName;

        User.role = req.body.role;
        User.Departement = req.body.Departement;
        Clubs.Bureau.splice(index, 1);

        await User.save();
        await Clubs.save();
        // save the modification in club & tunimateur
        return res.status(200).json(" Tunimateur Updated success");
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export const RequestesJoinIn = asyncHandler(async (req, res) => {
  try {
    const users = await UserModel.findById(req.body.userid).select(UserDetails);
    const Clubs = await Club.findById(req.params.id).select(ClubDetails);
    if (users.club) {
      return res.status(401).json("user already in club");
    }

    const index = await Clubs.requeste.findIndex(
      (e) => e.userid.toString() === users._id.toString()
    );

    if (index === -1) {
      Clubs.requeste.push({ userid: users, Departement: req.body.Departement });
      users.request = true;
      await users.save();
      await Clubs.save();
      return res.status(200).json("request saved success");
    } else {
      return res.status(400).json("you have already send request");
    }
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
});
export const DeleteRequestJoinIn = asyncHandler(async (req, res) => {
  try {
    const Clubs = await Club.findById(req.params.id).select(ClubDetails);
    const index = Clubs.requeste.findIndex((e) => e.id === req.body.userid);
    if (index !== -1) {
      Clubs.requeste.splice(index, 1);
      await Clubs.save();
      return res.status(200).json("request deleted success");
    } else {
      return res.status(400).json("you don't have any request");
    }
  } catch (error) {
    return res.status(500).json({ err: error.message });
  }
});
