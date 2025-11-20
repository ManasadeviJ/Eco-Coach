// lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fail loudly in development so you notice envs missing.
  console.warn("Missing Supabase envs NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anonKey, {
  auth: {
    // persistSession is default true in browser — fine for most apps
    persistSession: true,
  },
});
