// import axios from "axios";

// export const freeTranslate = async (req, res) => {
//     console.log("translate function")
//   try {
//     const { text, targetLang } = req.body;
//     const response = await axios.post("https://libretranslate.de/translate", {
//       q: text,
//       source: "en",
//       target: targetLang || "hi",
//       format: "text",
//     });

//     return res.json({ translatedText: response.data.translatedText });
//   } catch (error) {
//     console.error("Error in translation:", error);
//     return res.status(500).json({ message: "Translation failed" });
//   }
// };

// import translate from "google-translate-api-x"; // or your translation lib

// export const freeTranslate = async (req, res) => {
//   const { text, targetLang } = req.body;
//   try {
//     const result = await translate(text, { to: targetLang });
//     return res.json({ translatedText: result.text });
//   } catch (err) {
//     console.error("Translation failed:", err);
//     return res.status(500).json({ message: "Translation failed" });
//   }
// };

// import axios from "axios";

// export const freeTranslate = async (req, res) => {
//   try {
//     const { text, targetLang } = req.body;
//     const response = await axios.post("https://libretranslate.de/translate", {
//       q: text,
//       source: "en", // You might want to make this dynamic instead of hardcoded
//       target: targetLang || "hi",
//       format: "text",
//     },
//       {
//         headers: { "Content-Type": "application/json" }, // <-- important
//       });
//     console.log(response.data);
//     return res.json({ translatedText: response.data.translatedText });
//   } catch (error) {
//     console.error(
//       "Error in translation:",
//       error.response?.data || error.message
//     );
//     return res.status(500).json({ message: "Translation failed" });
//   }
// };

// import axios from "axios";

// export const freeTranslate = async (req, res) => {
//   try {
//     const { text, sourceLang = "auto", targetLang } = req.body;

//     const response = await axios.post(
//       "https://libretranslate.de/translate",
//       {
//         body: JSON.stringify({
//           q: text,
//           source: sourceLang,
//           target: targetLang,
//           format: "text",
//         }),
//       },
//       {
//         headers: { "Content-Type": "application/json" },
//       }
//     );
// console.log(response.data)
//     return res.json({ translatedText: response.data.translatedText });
//   } catch (error) {
//     console.error(
//       "Error in translation:",
//       error.response?.data || error.message
//     );
//     return res.status(500).json({ message: "Translation failed" });
//   }
// };

import axios from "axios";

export const freeTranslate = async (req, res) => {
  try {
    const { text, sourceLang = "auto", targetLang } = req.body;

    const response = await axios.post(
      "https://libretranslate.de/translate",
      {
        q: text,
        source: sourceLang,
        target: targetLang,
        format: "text",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    console.log("Translation response:", response.data);

    return res.json({ translatedText: response.data.translatedText });
  } catch (error) {
    console.error(
      "Error in translation:",
      error.response?.data || error.message
    );
    return res.status(500).json({ message: "Translation failed" });
  }
};
