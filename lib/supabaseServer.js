import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.warn("Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for server client");
}

export const supabaseServer = createClient(url, serviceRole, {
  auth: { persistSession: false },
});

// Backwards-compatible alias: some server routes import { supabase } from this module.
// Provide `supabase` as an alias to the server client so older imports keep working.
export const supabase = supabaseServer;
