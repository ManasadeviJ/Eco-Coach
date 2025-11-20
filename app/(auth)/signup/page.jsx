"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
// reuse login styles from the sibling login folder
import styles from "../login/login.module.css";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function signup() {
    setErrorMessage("");
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      console.log("signup response data:", data);
      console.log("signup response error:", error);

      if (error) {
        // show more debug info in UI
        const msg = error.message || JSON.stringify(error);
        setErrorMessage(msg);
        console.error("Supabase signup error:", error);
        return;
      }

      router.push("/login");
    } catch (err) {
      // network / unexpected errors
      console.error("Signup exception:", err);
      setErrorMessage(err?.message || String(err));
    }
  }

  return (
    <div className={styles.wrapper}>
      <h2>Create Account</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={signup}>Sign Up</button>

      {errorMessage && (
        <p style={{ color: "#a00", marginTop: "0.6rem" }}>Error: {errorMessage}</p>
      )}

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
