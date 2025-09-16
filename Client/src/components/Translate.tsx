import React, { useState } from "react";
import { Button } from "./ui/button";
import axiosInstance from "@/lib/axiosInstance";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface TranslateProps {
  commentId: string;
  commentText: string;
  onTranslated: (id: string, newText: string) => void;
}

const langMap: Record<string, string> = {
  Hindi: "hi",
  English: "en",
  Spanish: "es",
  French: "fr",
  German: "de",
  Japanese: "ja",
  Korean: "ko",
  Russian: "ru",
  Arabic: "ar",
  Portuguese: "pt",
  Italian: "it",
  Dutch: "nl",
  Turkish: "tr",
  Vietnamese: "vi",
  Bengali: "bn",
  Polish: "pl",
  Thai: "th",
  Swedish: "sv",
  Greek: "el",
  Hebrew: "he",
  Indonesian: "id",
  Malay: "ms",
  Tamil: "ta",
  Ukrainian: "uk",
  Gujarati: "gu",
  Marathi: "mr",
  Telugu: "te",
  Kannada: "kn",
  Hausa: "ha",
  Persian: "fa",
};

const Translate: React.FC<TranslateProps> = ({
  commentId,
  commentText,
  onTranslated,
}) => {
  const [loading, setLoading] = useState(false);

  const handleTranslate = async (targetLang: string) => {
    setLoading(true);
    console.log(commentText)
    console.log(commentId)
    try {
      // const res = await axiosInstance.post("/api/translate", {
      //   text: commentText,
      //   targetLang,
      // });
      const res = await axiosInstance.post("/api/translate", {
        text: commentText,
        sourceLang: "auto", // or omit for 'auto'
        targetLang,
      });
      console.log(res.data.translatedText);

      if (res.data?.translatedText) {
        onTranslated(commentId, res.data.translatedText);
      }
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={loading}
          className="px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          {loading ? "Translating..." : "Translate"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {Object.entries(langMap).map(([languageName, langCode]) => (
          <DropdownMenuItem key={langCode}>
            <Button
              type="button"
              variant="ghost"
              className="w-full text-left"
              onClick={() => handleTranslate(langCode)}
              disabled={loading}
            >
              {languageName}
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Translate;
