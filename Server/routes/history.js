import express from "express";
import { clearHistory, deleteHistory, getAllHistoryVideos, handleHistory, handleView } from "../controllers/history.js";

const routes = express.Router();

routes.get("/:userId", getAllHistoryVideos);
routes.post("/views/:videoId", handleView);
routes.post("/:videoId", handleHistory);
routes.delete("/clearhistory", clearHistory)
routes.delete("/deletehistory/:historyId", deleteHistory)

export default routes;
