import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  try {
    const { message, weather, location } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"  // This works in public API
    });

    const prompt = `
You are EcoCoach.
Reply in JSON ONLY:
{
 "eco_response": "",
 "eco_challenge": ""
}

User message: ${message}

Weather: ${weather?.summary || "unknown"}
Temperature: ${weather?.temperature || "unknown"}°C
Location: ${location?.city || "unknown"}

Give:
1. 2-3 short energetic lines
2. 1 simple eco-challenge
`;

    const result = await model.generateContent(prompt);

    const raw = result.response.text() || "";

    // Extract JSON object from text
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return Response.json({
        eco_response: "Unexpected response format.",
        eco_challenge: ""
      });
    }

    const data = JSON.parse(match[0]);

    return Response.json(data);

  } catch (err) {
    console.error("🔥 API ERROR:", err);
    return Response.json(
      { eco_response: "EcoCoach is facing an issue!", error: String(err) },
      { status: 500 }
    );
  }
}
