
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIVictoryMessage = async (moves: number, time: number, difficulty: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The player just won a memory game! 
      Difficulty: ${difficulty}
      Moves: ${moves}
      Time: ${time} seconds.
      Generate a short (2-sentence) fun, enthusiastic, and encouraging victory message or a "Memory Master Title" based on these stats. Keep it friendly for kids and casual players.`,
    });
    return response.text || "You're a Memory Legend!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Amazing performance! You have the memory of an elephant!";
  }
};
