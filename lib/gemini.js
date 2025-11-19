// lib/gemini.js
// --- You should have already installed this library ---
// Run: npm install @google/generative-ai
// Or:  yarn add @google/generative-ai
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// IMPORTANT: The listAvailableModels function is removed from client-side.
// It's not typically available or recommended for browser environments.

export async function generateAIResponse(message) {
  // Use 'gemini-pro' as the primary model.
  // This is a stable, generally available text-to-text model.
  const modelName = "gemini-2.5-flash";
  const MAX_RETRIES = 1; // You can adjust this, but one try is usually enough if the key is good.

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Trying model: ${modelName}, attempt: ${attempt}`);

      // Get the model instance
      const model = genAI.getGenerativeModel({ model: modelName });

      // `generateContent` in the new library directly takes the content.
      // For a simple text input, it expects a string or an array of parts.
      const result = await model.generateContent(message); // Assuming 'message' is a string from your input

      const response = await result.response;
      const text = response.text();

      return text;
    } catch (err) {
      console.error(`Model ${modelName} attempt ${attempt} failed`, err);
      // If the error indicates a model not found or permissions issue,
      // it means the API key might still not have access to 'gemini-pro'
      // or there's a problem with the service itself.

      if (attempt === MAX_RETRIES) {
        // If it's the last attempt, return the error message.
        // You could also parse 'err' here to give a more specific message if desired.
        return "⚠️ AI response failed after retries. Check console for details. (Model: " + modelName + ")";
      }

      // Short delay before retry (only if MAX_RETRIES > 1)
      await new Promise((res) => setTimeout(res, 500));
    }
  }

  // This line should ideally not be reached if MAX_RETRIES is handled well,
  // but acts as a final fallback.
  return "⚠️ AI is overloaded right now. Please try again in 10–20 seconds!";
}