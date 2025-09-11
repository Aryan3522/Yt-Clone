import express from "express";
import { freeTranslate } from "../controllers/translate.js";
// import axios from "axios"
const routes = express.Router();
routes.post("/translate", freeTranslate)

// const TRANSLATION_API_URL = "https://translation.googleapis.com/language/translate/v2";
// const API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY; // Put your Google API key in .env

// routes.post("/translate", async (req, res) => {
//   const { text, targetLang } = req.body;

//   if (!text || !targetLang) {
//     return res.status(400).json({ error: "Missing text or target language" });
//   }

//   try {
//     const response = await axios.post(
//       TRANSLATION_API_URL,
//       {},
//       {
//         params: {
//           q: text,
//           target: targetLang,
//           key: API_KEY,
//         },
//       }
//     );
//     const translatedText = response.data.data.translations[0].translatedText;
//     res.json({ translatedText });
//   } catch (error) {
//     console.error("Translation API error:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to translate text" });
//   }
// });


export default routes;
