"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (!email || !password) {
      alert("Email and password are required");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("login DATA:", data);
    console.log("login ERROR:", error);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/home");
  }

  return (
    <div className={styles.wrapper}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>

      <p>
        Don’t have an account? <a href="/signup">Create one</a>
      </p>
    </div>
  );
}
