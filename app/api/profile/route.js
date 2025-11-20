import { supabaseAdmin } from "@/lib/supabaseServer";

export async function POST(req) {
  const { user } = await req.json();

  const { data, error } = await supabaseAdmin
    .from("users")
    .upsert({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name ?? null,
      avatar_type: "default",
    });

  if (error) return Response.json({ error }, { status: 500 });

  return Response.json({ success: true });
}
