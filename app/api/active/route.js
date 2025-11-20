// app/api/active/route.js
import { supabaseServer } from "@/lib/supabaseServer";

/**
 * GET /api/active
 * Get the currently active challenge for a user
 */
export async function GET(req) {
  try {
    // Get user_id from query params or auth
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return Response.json({ error: "Missing user_id" }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("user_active_challenges")
      .select("*, challenges(title, description, points)")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows found, which is OK
      throw error;
    }

    return Response.json({ active: data || null });
  } catch (err) {
    console.error("GET /api/active ERROR:", err);
    return Response.json({ error: String(err), active: null }, { status: 500 });
  }
}

/**
 * POST /api/active
 * Accept a new challenge (create user_active_challenges entry)
 */
export async function POST(req) {
  try {
    const { user_id, challenge_id, duration_hours = 12 } = await req.json();

    if (!user_id || !challenge_id) {
      return Response.json(
        { error: "Missing user_id or challenge_id" },
        { status: 400 }
      );
    }

    const acceptedAt = new Date();
    const deadlineAt = new Date(
      acceptedAt.getTime() + duration_hours * 60 * 60 * 1000
    );

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
      .select("*, challenges(title, description, points)")
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

    console.log(`Challenge ${challenge_id} accepted by user ${user_id}`);
    return Response.json({ active, world });
  } catch (err) {
    console.error("POST /api/active ERROR:", err);
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
