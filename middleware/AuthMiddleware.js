import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/userModel.js";

dotenv.config();
const secret = process.env.JWTKEY;
const authMiddleWare = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
      await jwt.verify(token, secret, (err, payload) => {
        if (err)
          return res.status(401).json({ error: "you must be Logged in" });
        const { id } = payload;
        UserModel.findById(id).then((userData) => {
          req.user = userData;
        });
        next();
      });
    }
  } catch (error) {
    res.status(500).send({ message: "Invalid permissions" });
  }
};

export default authMiddleWare;
