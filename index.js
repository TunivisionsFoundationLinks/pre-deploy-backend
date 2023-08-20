import express from "express";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authMiddleWare from "./middleware/AuthMiddleware.js";
// routes
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import PostRoute from "./routes/PostRoute.js";
import UploadRoute from "./utils/upload.js";
import ChatRoute from "./routes/ChatRoute.js";
import MessageRoute from "./routes/MessageRoute.js";
import InfoRoute from "./routes/InfoRouter.js";
import RegionRoute from "./routes/StatesRoute.js";
import ChapterRoute from "./routes/ChapterRouter.js";
import RoleRoute from "./routes/AdminRoleRoute.js";
import friendInvitationRoutes from "./routes/friendInvitationRoutes.js";
import groupChatRoutes from "./routes/groupChatRoutes.js";
import ClubRoute from "./routes/clubsRoute.js";
import ActivityRoutes from "./routes/ActivityRoute.js";
import { createSocketServer } from "./socket/socketServer.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

app.use(
  cors({
    origin: process.env.PUBLIC_URL,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
console.log(process.env.PUBLIC_URL);
/* working in the deploy*/
// middleware
app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// to serve images inside public folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname, "build")));

const PORT = process.env.PORT;
const server = http.createServer(app);

// socket connection
createSocketServer(server);
const CONNECTION = process.env.MONGODB_CONNECTION;
mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Listening at Port ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.use("/auth", AuthRoute);
app.use("/information", InfoRoute);
app.use("/upload", UploadRoute);
app.use("/Chapters", authMiddleWare, ChapterRoute);
app.use("/user", authMiddleWare, UserRoute);
app.use("/posts", authMiddleWare, PostRoute);
app.use("/chat", authMiddleWare, ChatRoute);
app.use("/message", authMiddleWare, MessageRoute);
app.use("/region", RegionRoute);
app.use("/role", RoleRoute);
app.use("/invite-friend", friendInvitationRoutes);
app.use("/group-chat", groupChatRoutes);
app.use("/Clubs", authMiddleWare, ClubRoute);
app.use("/activity", ActivityRoutes);
app.use(errorHandler);
app.use(notFound);
