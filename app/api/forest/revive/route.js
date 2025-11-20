// app/api/forest/revive/route.js
import { supabaseServer } from "@/lib/supabaseServer";

const REVIVE_COST = 1;

export async function POST(req) {
  try {
    const { user_id, world_id } = await req.json();

    if (!user_id || !world_id) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Get user points
    const { data: pointsRow, error: pointsErr } = await supabaseServer
      .from("user_points")
      .select("points")
      .eq("user_id", user_id)
      .single();

    if (pointsErr) throw pointsErr;

    if ((pointsRow?.points ?? 0) < REVIVE_COST) {
      return Response.json({ error: "Not enough coins" }, { status: 400 });
    }

    // 2. Deduct coins
    await supabaseServer
      .from("user_points")
      .update({ points: pointsRow.points - REVIVE_COST })
      .eq("user_id", user_id);

    // 3. Change world object to sapling
    const { data: updated, error: updErr } = await supabaseServer
      .from("user_world_objects")
      .update({ type: "sapling", level: 1 })
      .eq("id", world_id)
      .select()
      .single();

    if (updErr) throw updErr;

    // 4. Log transaction
    await supabaseServer.from("transactions").insert({
      user_id,
      t_type: "revive",
      amount: -REVIVE_COST,
      meta: { world_id },
    });

    return Response.json({ success: true, updated });
  } catch (err) {
    console.error("REVIVE ERROR:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
