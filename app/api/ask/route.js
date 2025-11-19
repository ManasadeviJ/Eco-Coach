import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",   // 👈 NEW WORKING MODEL
      contents: message,
    });

    const reply =
      result?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response";

    return Response.json({ reply });

  } catch (err) {
    console.error("🔥 API ROUTE CRASHED:", err);

    return new Response(
      JSON.stringify({
        reply: "SERVER CRASH",
        error: String(err),
      }),
      { status: 500 }
    );
  }
}
