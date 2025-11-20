import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  return Response.json({ session });
}
