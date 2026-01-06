
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AspectRatio } from "../types";

export class GeminiService {
  // Use the process.env.API_KEY directly when initializing.
  // Initializing within each call ensures the latest key is used if it changes.

  static async generateImage(prompt: string, aspectRatio: AspectRatio, refImages: string[] = []) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Map custom ratios to supported API ratios
    // Supported: "1:1", "3:4", "4:3", "9:16", "16:9"
    let apiRatio: any = aspectRatio;
    if (aspectRatio === '3:2') apiRatio = '4:3';
    if (aspectRatio === '2:3') apiRatio = '3:4';

    const parts: any[] = [{ text: prompt }];
    
    for (const base64 of refImages) {
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: base64.split(',')[1] || base64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        imageConfig: {
          aspectRatio: apiRatio as any,
        }
      }
    });

    const result = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (result?.inlineData?.data) {
      return `data:image/png;base64,${result.inlineData.data}`;
    }
    throw new Error("No image generated");
  }

  static async editImage(baseImage: string, prompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: baseImage.split(',')[1] || baseImage
            }
          },
          { text: prompt }
        ]
      }
    });

    const result = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (result?.inlineData?.data) {
      return `data:image/png;base64,${result.inlineData.data}`;
    }
    throw new Error("Editing failed");
  }

  static async imageToPrompt(base64Image: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: base64Image.split(',')[1] || base64Image
            }
          },
          { text: "Generate a simple, concise descriptive prompt for this image suitable for an AI image generator." }
        ]
      }
    });

    return response.text || "A beautiful artwork.";
  }

  static async enhancePrompt(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Enhance the following prompt to be more detailed, artistic, and descriptive for an AI image generator: "${prompt}". Keep it under 100 words.`
    });
    return response.text || prompt;
  }
}
