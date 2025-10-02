
import { GoogleGenAI, Chat } from "@google/genai";
import type { VehicleType } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this demo, we'll throw an error if the key is missing.
  console.error("Gemini API key is missing. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
let supportChat: Chat | null = null;

export const calculateFare = async (pickup: string, destination: string, vehicleType: VehicleType): Promise<number | null> => {
  if (!API_KEY) return 15.50; // Return a mock value if API key is not set

  try {
    const prompt = `You are a taxi fare calculator for an app called "Movi".
      A user wants to go from "${pickup}" to "${destination}".
      The chosen vehicle type is "${vehicleType}".
      Assuming a distance of ~8 miles and moderate traffic in a major US city, estimate a fare in USD.
      Provide ONLY a single number representing the total fare. Do not include currency symbols, explanations, or ranges.
      For example: 24.50`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const fareString = response.text.trim();
    const fare = parseFloat(fareString);
    
    if (isNaN(fare)) {
      console.error("Failed to parse fare from Gemini response:", fareString);
      return Math.floor(Math.random() * (45 - 15 + 1)) + 15; // fallback random fare
    }

    return fare;
  } catch (error) {
    console.error("Error calculating fare with Gemini:", error);
    return null;
  }
};


export const getSupportResponse = async (message: string): Promise<string> => {
    if (!API_KEY) return "Our support agents are currently unavailable. Please try again later.";

    try {
        if (!supportChat) {
            supportChat = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: 'You are Movi Support, a friendly and helpful AI assistant for a taxi booking app. Your goal is to assist users with their questions and problems. Keep your answers concise, empathetic, and helpful. Do not mention that you are an AI model.'
                }
            });
        }
        
        const response = await supportChat.sendMessage({ message });
        return response.text;

    } catch (error) {
        console.error("Error getting support response from Gemini:", error);
        return "I'm sorry, I'm having trouble connecting to our systems right now. Please try again in a moment.";
    }
};
