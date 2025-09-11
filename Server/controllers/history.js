import video from "../Modals/video.js";
import History from "../Modals/history.js";

// export const handleHistory = async (req, res) => {
//   const { userId } = req.body;
//   const { videoId } = req.params;
//   try {
//     await History.create({
//       viewer: userId,
//       videoId: videoId,
//     });
//     await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
//     return res.status(200).json({ History: true });
//   } catch (error) {
//     console.log(error);
//     console.log("error in History controller: " + error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
export const handleHistory = async (req, res) => {
  const { userId } = req.body;
  const { videoId } = req.params;

  try {
    const existingHistory = await History.findOne({ viewer: userId, videoId: videoId });
    if (existingHistory) {
      return res.status(200).json({ message: "View already counted" });
    }
    await History.create({viewer: userId,videoId: videoId,});
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ History: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const handleView = async (req, res) => {
  const { videoId } = req.params;
  try {
    await video.findByIdAndUpdate(videoId, { $inc: { views: 1 } });
    return res.status(200).json({ message: "View count incremented" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllHistoryVideos = async (req, res) => {
  const { userId } = req.params;
  try {
    const historyVideos = await History.find({ viewer: userId }).populate({ path: "videoId", model: "VideoFiles" }).exec();
    return res.status(200).json(historyVideos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const clearHistory = async(req,res) =>{
  try {
    const cleared = await History.deleteMany()
    if (!cleared) {
      return res.status(404).json({ message: "History record not found" });
    }
    return res.status(200).json({ message: "History Cleared successfully" });
  } catch (error) {
    console.error("error " + error)
    return res.status(500).json({ message: "Something went wrong" });
  }
}
export const deleteHistory = async (req, res) => {
  const { historyId } = req.params;
  try {
    const deleted = await History.findByIdAndDelete(historyId);
    if (!deleted) {
      return res.status(404).json({ message: "History record not found" });
    }
    return res.status(200).json({ message: "History deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};