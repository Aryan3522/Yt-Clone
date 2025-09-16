import comment from "../Modals/comment.js";
import mongoose from "mongoose";

export const likeComment = async (req, res) => {
  const { userId, commentId } = req.body;
  try {
    const cmt = await comment.findById(commentId);
    if (!cmt) return res.status(404).json({ message: "Comment not found" });
    const alreadyLiked = cmt.likedUsers.some((u) => u.toString() === userId);
    const alreadyDisLiked = cmt.dislikedUsers.some(
      (u) => u.toString() === userId
    );
    if (alreadyLiked) {
      await comment.findByIdAndUpdate(
        commentId,
        {
          $inc: { likes: -1 },
          $pull: { likedUsers: userId },
        },
        { new: true }
      );
      return res.status(200).json({ message: "already Liked" });
    } else {
      if (alreadyDisLiked) {
        const updated = await comment.findByIdAndUpdate(
          commentId,
          {
            $inc: { likes: 1, dislikes: -1 },
            $push: { likedUsers: userId },
            $pull: { dislikedUsers: userId },
          },
          { new: true }
        );
        return res.status(200).json({ liked: true, comment: updated });
      } else {
        const updated = await comment.findByIdAndUpdate(
          commentId,
          {
            $inc: { likes: 1 },
            $push: { likedUsers: userId },
          },
          { new: true }
        );
        return res.status(200).json({ liked: true, comment: updated });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};
export const disLikeComment = async (req, res) => {
  const { userId, commentId } = req.body;
  try {
    const cmt = await comment.findById(commentId);
    if (!cmt) return res.status(404).json({ message: "Comment not found" });
    if (cmt.dislikes >= 2) {
      await comment.findByIdAndDelete(cmt._id);
      return res
        .status(200)
        .json({ message: "Comment deleted due to dislikes" });
    }
    const alreadyDisLiked = cmt.dislikedUsers.some(
      (u) => u.toString() === userId
    );
    const alreadyLiked = cmt.likedUsers.some((u) => u.toString() === userId);
    if (alreadyDisLiked) {
      await comment.findByIdAndUpdate(
        commentId,
        {
          $inc: { dislikes: -1 },
          $pull: { dislikedUsers: userId },
        },
        { new: true }
      );
      return res.status(200).json({ message: "already disLiked" });
    } else {
      if (alreadyLiked) {
        const updated = await comment.findByIdAndUpdate(
          commentId,
          {
            $inc: { dislikes: 1, likes: -1 },
            $push: { dislikedUsers: userId },
            $pull: { likedUsers: userId },
          },
          { new: true }
        );
        return res.status(200).json({ disliked: true, comment: updated });
      } else {
        const updated = await comment.findByIdAndUpdate(
          commentId,
          {
            $inc: { dislikes: 1 },
            $push: { dislikedUsers: userId },
          },
          { new: true }
        );
        return res.status(200).json({ disliked: true, comment: updated });
      }
    }
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const postComment = async (req, res) => {
  const commentData = req.body;
  const postComment = new comment(commentData);
  try {
    await postComment.save();
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error("error: " + error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getAllComment = async (req, res) => {
  const { videoId } = req.params;
  try {
    const commentVideos = await comment.find({ videoId: videoId }).exec();
    return res.status(200).json(commentVideos);
  } catch (error) {
    console.error("error: " + error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const deleteComment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No comment with that id");
  }
  try {
    await comment.findByIdAndDelete(_id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("error: " + error);
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const editComment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No comment with that id");
  }

  try {
    const updatedComment = await comment.findByIdAndUpdate(
      _id,
      { $set: { commentbody: commentbody } },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).send("Comment not found");
    }

    return res.status(200).json(updatedComment);
  } catch (error) {
    console.error("error: " + error);
    return res.status(500).json({ message: "something went wrong" });
  }
};
