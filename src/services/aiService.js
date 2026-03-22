
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
// Note: VITE_GEMINI_API_KEY must be defined in your .env file
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "YOUR_API_KEY_HERE");

/**
 * Common AI service for Sweet Macarons
 */
export const aiService = {
  /**
   * General prompt execution
   * @param {string} prompt 
   * @returns {Promise<string>}
   */
  async generateText(prompt) {
    try {
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        console.warn("Gemini API key is missing. AI features will not work.");
        return "AI features are currently unavailable. Please check configuration.";
      }
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  },

  /**
   * Feature 2: Generate Product Description
   */
  async generateProductDescription(name, ingredients) {
    const prompt = `You are a poetic copywriter for "Sweet Macarons", a premium artisanal macaron shop. 
    Write a 1-2 sentence enticing, mouth-watering description for a macaron called "${name}" made with these ingredients: ${ingredients}.
    Keep it elegant, vibrant, and focused on taste and texture. Do not use hashtags or emojis.`;
    return this.generateText(prompt);
  },

  /**
   * Feature 4: Scan order notes for alerts
   */
  async scanOrderNotes(note) {
    const prompt = `Analyze the following customer order note for a bakery: "${note}".
    Identify any critical information such as:
    1. Food allergies (nuts, dairy, gluten, etc. - note: macarons usually contain nuts, but check if they mention new ones).
    2. Urgent delivery deadlines or special dates.
    3. Specific requests that require immediate attention.
    
    Respond in JSON format:
    {
      "hasAlert": boolean,
      "alerts": string[], // list of short, clear tags like "Nut Allergy", "Urgent", "Birthday"
      "summary": string // a 1-sentence summary of the alert
    }
    If no alerts, set hasAlert to false.`;
    
    const response = await this.generateText(prompt);
    try {
      // Clean up the response if it contains markdown code blocks
      const cleaned = response.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error("Failed to parse AI alert JSON", e);
      return { hasAlert: false, alerts: [], summary: "" };
    }
  },

  /**
   * Feature 3: Summarize reviews
   */
  async summarizeReviews(reviews) {
    if (!reviews || reviews.length === 0) return "No reviews yet.";
    const reviewTexts = reviews.map(r => r.text).join("\n---\n");
    const prompt = `Based on these customer reviews for a macaron flavor, provide a 1-2 sentence "Customer Consensus" summary. 
    Focus on what people like most or any common feedback. 
    Reviews:
    ${reviewTexts}`;
    return this.generateText(prompt);
  },

  /**
   * Feature 1: Flavor Recommendation
   */
  async recommendFlavors(query, availableFlavors) {
    const flavorsList = availableFlavors.map(f => `${f.name}: ${f.description}`).join("\n");
    const prompt = `A customer says: "${query}".
    Based on their request, recommend the top 2-3 flavors from our menu below.
    Explain briefly why each fits their mood/preference.
    Menu:
    ${flavorsList}
    
    Format the response as a friendly conversation from a "Macaron Sommelier".`;
    return this.generateText(prompt);
  }
};
