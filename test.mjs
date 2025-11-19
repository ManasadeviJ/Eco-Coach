// test.mjs
// Run this file with: node test.mjs

import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config({ path: './.env.local' });

async function runTest() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Error: NEXT_PUBLIC_GEMINI_API_KEY is not set in .env.local");
    return;
  }

  console.log("API Key loaded (test script):", apiKey ? "YES" : "NO");
  console.log("API Key first 5 chars (test script):", apiKey ? apiKey.substring(0, 5) : "N/A");

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // --- Attempt to Generate Content Directly ---
    console.log("\n--- Attempting to Generate Content with gemini-pro ---");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = "Write a short poem about a friendly robot.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini-pro Response:", text);

  } catch (error) {
    console.error("\n--- ERROR DURING TEST SCRIPT ---");
    console.error("An error occurred during API interaction:", error);
    console.error("This is likely due to the API key being invalid, lacking permissions, regional restrictions, or a network issue.");
    console.error("Please re-verify your API key from Google AI Studio. If the key is new, it may take a few minutes to propagate.");
  }
}

runTest();