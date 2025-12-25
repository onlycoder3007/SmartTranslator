
import { GoogleGenAI } from "@google/genai";
import { TranslationMode } from "./types";

export const translateText = async (
  text: string, 
  mode: TranslationMode,
  apiKey: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey });
  const targetLanguage = mode === TranslationMode.UZ_RU ? "Russian" : "English";
  
  const systemInstruction = `You are a professional translator. Translate the following Uzbek text into ${targetLanguage}. Provide only the translated text. Do not include explanations, quotes, or notes. Ensure the tone is natural and appropriate for social media messaging (Telegram, WhatsApp).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const translated = response.text;
    if (!translated) throw new Error("Empty response from AI");
    
    return translated.trim();
  } catch (error: any) {
    console.error("Translation Error:", error);
    throw new Error(error.message || "Failed to communicate with Gemini API");
  }
};
