import express from "express";
import { deleteComment, disLikeComment, editComment, getAllComment, likeComment, postComment } from "../controllers/comment.js";

const routes = express.Router();

routes.get("/:videoId", getAllComment);
routes.post("/postcomment", postComment);
routes.post("/editcomment/:id", editComment);
routes.post("/like/:commentId", likeComment);
routes.post("/dislike/:commentId", disLikeComment);
routes.delete("/deletecomment/:id", deleteComment);

export default routes;
