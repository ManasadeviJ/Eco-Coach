"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>My Profile</h2>
      <p><b>Email:</b> {user.email}</p>
      <p><b>User ID:</b> {user.id}</p>
    </div>
  );
}
