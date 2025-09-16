import translate from "google-translate-api-x"; 

export const freeTranslate = async (req, res) => {
  const { text, targetLang } = req.body;
  try {
    const result = await translate(text, { to: targetLang });
    return res.json({ translatedText: result.text });
  } catch (err) {
    console.error("Translation failed:", err);
    return res.status(500).json({ message: "Translation failed" });
  }
};