// app/api/weather/route.js

export async function POST(req) {
  try {
    const body = await req.json();
    const lat = Number(body.lat);
    const lon = Number(body.lon);

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "Invalid coordinates" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Open-Meteo: current weather + weathercode
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      current_weather: "true",
      timezone: "auto"
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const r = await fetch(url, { method: "GET" });
    if (!r.ok) {
      const txt = await r.text();
      console.error("Open-Meteo error:", txt);
      throw new Error("Weather provider error");
    }
    const data = await r.json();
    const cw = data.current_weather || {};

    // Map weathercode -> simple text (you can expand)
    const codeMap = {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Drizzle: Light",
      53: "Drizzle: Moderate",
      55: "Drizzle: Dense",
      61: "Rain: Slight",
      63: "Rain: Moderate",
      65: "Rain: Heavy",
      71: "Snow fall light",
      95: "Thunderstorm",
      // add as needed
    };

    const summary = codeMap[cw.weathercode] || "Unknown";

    const out = {
      temperature: cw.temperature ?? null,
      windspeed: cw.windspeed ?? null,
      weathercode: cw.weathercode ?? null,
      summary
    };

    return new Response(JSON.stringify(out), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Weather route error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
