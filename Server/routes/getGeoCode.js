import express from "express";

const routes = express.Router();

routes.get("/geocode", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.LOCATION_API_KEY;

  try {
    const response = await axios.get('https://geocode.maps.co/reverse', {
      params: { lat, lon, api_key: apiKey },
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch geocode data' });
  }
});
// routes.post("/postcomment", postComment);

export default routes;
