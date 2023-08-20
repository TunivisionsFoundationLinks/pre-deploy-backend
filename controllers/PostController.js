import PostModel from "../models/postModel.js";
import UserModel from "../models/userModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
// creating a post

export const createPost = asyncHandler(async (req, res) => {
  try {
    const newPost = new PostModel({
      createBy: req.body.id,
      desc: req.body.desc,
      content: req.files.map((file) => file.filename),
    });
    await newPost.save();
    return res.status(200).send(newPost);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// get a post

export const getPost = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const post = await PostModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
export const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const posts = await PostModel.find();
    return res.status(201).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
});
// update post
export const updatePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(postId);
    if (post.userId === userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).send("Post updated!");
    } else {
      res.status(403).send("Authentication failed");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await PostModel.findById(id);
    if (post.userId === userId) {
      await post.deleteOne();
      res.status(200).send("Post deleted.");
    } else {
      res.status(403).send("Action forbidden");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// like/dislike a post
export const likePost = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;
  try {
    const post = await PostModel.findById(id);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).send("Post disliked");
    } else {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).send("Post liked");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get timeline posts
export const getTimelinePosts = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  try {
    const currentUserPosts = await PostModel.find({ userId: userId });

    const followingPosts = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "following",
          foreignField: "userId",
          as: "followingPosts",
        },
      },
      {
        $project: {
          followingPosts: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).json(
      currentUserPosts
        .concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        })
    );
  } catch (error) {
    res.status(500).send(error);
  }
});
