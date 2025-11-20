// app/api/forest/get/route.js
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { user_id } = await req.json();
    if (!user_id) {
      return Response.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("user_world_objects")
      .select("*")
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return Response.json({ world: data });
  } catch (err) {
    console.error("FOREST LOAD ERROR:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
