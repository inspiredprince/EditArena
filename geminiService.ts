
import { GoogleGenAI, Type } from "@google/genai";
import { Drill, DrillResult } from "./types";

const API_KEY = process.env.API_KEY || "";

export async function evaluateEdit(drill: Drill, userText: string): Promise<DrillResult> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const prompt = `
    As a Senior Editorial Mentor, evaluate the user's edit of the following text.
    
    Original Text:
    "${drill.originalText}"
    
    User's Edited Version:
    "${userText}"
    
    Your task:
    1. Compare the versions objectively.
    2. Provide scores (0-100) for Clarity, Grammar, Structure, Style, and Ethics/Tone.
    3. Generate a list of "Editorial Annotations" that highlight specific choices the user made (or missed), explaining WHY they matter.
    4. Provide an "Expert Version" of how a world-class editor would have handled the original text.
    5. Summarize the overall performance in a helpful, evaluative (not just generative) tone.
    
    Focus on human editorial judgment: word choice, pacing, logical flow, and impact.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          metrics: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                score: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["name", "score", "feedback"]
            }
          },
          overallEvaluation: { type: Type.STRING },
          annotations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                originalFragment: { type: Type.STRING },
                editedFragment: { type: Type.STRING },
                comment: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ["originalFragment", "editedFragment", "comment", "category"]
            }
          },
          expertVersion: { type: Type.STRING }
        },
        required: ["metrics", "overallEvaluation", "annotations", "expertVersion"]
      }
    }
  });

  const resultData = JSON.parse(response.text);
  
  return {
    drillId: drill.id,
    userText,
    timestamp: Date.now(),
    ...resultData
  };
}
