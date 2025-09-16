import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VideoFiles",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    commentbody: { type: String },
    usercommented: { type: String },
    location: { type: String },
    commentedon: { type: Date, default: Date.now() },
    likes: Number,
    dislikes: Number,
    likedUsers: [{type: mongoose.Schema.Types.ObjectId}],
    dislikedUsers: [{type: mongoose.Schema.Types.ObjectId}]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", commentSchema);
