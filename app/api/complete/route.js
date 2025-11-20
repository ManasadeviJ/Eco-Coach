// app/api/complete/route.js
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { user_id, active_id } = await req.json();
    if (!user_id || !active_id) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabaseServer.rpc("rpc_complete_challenge", {
      in_active_id: active_id,
      in_user: user_id,
    });

    if (error) throw error;

    return Response.json({ success: true, data });
  } catch (err) {
    console.error("COMPLETE ERROR:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
