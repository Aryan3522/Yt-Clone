import video from "../Modals/video.js";
import Likes from "../Modals/like.js";

// export const handleLike = async (req, res) => {
//   const { userId } = req.body;
//   const { videoId } = req.params;
//   try {
//     const exisitinglike = await Likes.findOne({
//       viewer: userId,
//       videoid: videoId,
//     });
//     if (exisitinglike) {
//       await Likes.findByIdAndDelete(exisitinglike._id);
//       await video.findByIdAndUpdate(videoId, { $inc: { Likes: -1 } });
//       return res.status(200).json({ liked: false });
//     } else {
//       await Likes.create({ viewer: userId, videoId: videoId });
//       await video.findByIdAndUpdate(videoId, { $inc: { Likes: 1 } });
//       return res.status(200).json({ liked: true });
//     }
//   } catch (error) {
//     console.error(" error:", error);
//     return res.status(500).json({ message: "Something went wrong" });
//   }
// };

export const handleLike = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;
  console.log("handleLike")
  try {
    const existingLike = await Likes.findOne({
      viewer: userId,
      videoId: videoId,
    });
    if (existingLike) {
      await Likes.findByIdAndDelete(existingLike._id);
      await video.findByIdAndUpdate(videoId, { $inc: { Likes: -1 } });
      return res.status(200).json({ liked: false });
    } else {
      await Likes.create({
        viewer: userId,
        videoId: videoId,
      });
      await video.findByIdAndUpdate(videoId, { $inc: { Likes: 1 } });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.log(error);
    console.log("error in like controller: " + error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllLikedVideos = async (req, res) => {
  console.log("getting all liked videos");
  const { userId } = req.params;
  try {
    const likedVideos = await Likes
      .find({ viewer: userId })
      .populate({ path: "videoId", model: "VideoFiles" }).exec();
      return res.status(200).json(likedVideos);
  } catch (error) {}
};