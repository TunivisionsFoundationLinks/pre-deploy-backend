import UserModel from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// Get a User
export const getUser = asyncHandler(async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await UserModel.findById(_id);
    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).send(otherDetails);
    } else {
      res.status(404).json("No such User");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    let users = await UserModel.find();
    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

// udpate a user

export const updateUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // console.log("Data Received", req.body)
  const { _id, currentUserAdmin, password } = req.body;

  if (id === _id) {
    try {
      // if we also have to update password then password will be bcrypted again
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      // have to change this
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWTKEY,
        { expiresIn: "1h" }
      );
      console.log({ user, token });
      res.status(200).json({ user, token });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res
      .status(403)
      .json("Access Denied! You can update only your own Account.");
  }
});

// Delete a user
export const deleteUser = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const { currentUserId, currentUserAdmin } = req.body;

  if (currentUserId == id || currentUserAdmin) {
    try {
      await UserModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully!");
    } catch (error) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("Access Denied!");
  }
});

// Follow a User
// changed
export const followUser = asyncHandler((req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;

  try {
    UserModel.findByIdAndUpdate(
      id,
      {
        $push: { followers: userId },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err.message });
        }
        UserModel.findByIdAndUpdate(userId, {
          $push: { following: id },
        })
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Unfollow a User
// changed
export const unfollowUser = asyncHandler((req, res) => {
  const id = req.params.id;
  const userId = req.body.userId;

  try {
    UserModel.findByIdAndUpdate(
      id,
      {
        $pull: { followers: userId },
      },
      {
        new: true,
      },
      (err, result) => {
        if (err) {
          return res.status(422).json({ error: err.message });
        }
        UserModel.findByIdAndUpdate(userId, {
          $pull: { following: id },
        })
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            return res.status(422).json({ error: err });
          });
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
});
