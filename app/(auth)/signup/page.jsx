"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import styles from "../login/login.module.css"; // reusing same theme
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

      console.log("signup DATA:", data);
      console.log("signup ERROR:", error);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push("/login");
    } catch (err) {
      setErrorMessage(err?.message || "Something went wrong");
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.authBox}>
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

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
  