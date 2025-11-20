// app/api/challenge/route.js
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req) {
  try {
    const { user_id, challenge_id, duration_hours = 12 } = await req.json();

    if (!user_id || !challenge_id) {
      return Response.json({ error: "Missing fields" }, { status: 400 });
    }

    const acceptedAt = new Date();
    const deadlineAt = new Date(acceptedAt.getTime() + duration_hours * 60 * 60 * 1000);

    // Create active challenge
    const { data: active, error: activeErr } = await supabaseServer
      .from("user_active_challenges")
      .insert({
        user_id,
        challenge_id,
        status: "active",
        accepted_at: acceptedAt.toISOString(),
        deadline_at: deadlineAt.toISOString(),
      })
      .select()
      .single();

    if (activeErr) throw activeErr;

    // Create world object (sapling)
    const { data: world, error: worldErr } = await supabaseServer
      .from("user_world_objects")
      .insert({
        user_id,
        source_challenge_id: active.id,
        type: "sapling",
        level: 1,
        pos_x: Math.random() * 100,
        pos_y: Math.random() * 100,
      })
      .select()
      .single();

    if (worldErr) throw worldErr;

    return Response.json({ active, world });
  } catch (err) {
    console.error("ACCEPT CHALLENGE ERROR:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
