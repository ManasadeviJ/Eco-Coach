"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./welcome.module.css";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <h1 className={`${styles.title} ${styles.fade1}`}>
          Welcome to <br />
          <span className={styles.gradient}>Gamified AI EcoCoach</span>
        </h1>

        <p className={`${styles.subtitle} ${styles.fade2}`}>
          Your small steps make a <br />
          <span className={styles.bold}>big green impact</span>
        </p>

        <div className={`${styles.imgWrap} ${styles.fade3}`}>
          <div className={styles.glow}></div>
          <Image
            src="/icons/plant1.png"
            width={220}
            height={220}
            alt="Eco Plant"
            className={styles.plant}
          />
        </div>

        <button
          onClick={() => router.push("/signup")}
          className={`${styles.startBtn} ${styles.fade4}`}
        >
          Start your eco journey
        </button>

        <p className={`${styles.footer} ${styles.fade5}`}>
          Join thousands making a difference.
        </p>
      </div>
    </div>
  );
}
