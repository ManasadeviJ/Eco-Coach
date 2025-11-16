import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./challengeDetail.module.css";

export default function ChallengeDetailPage() {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h1 className={styles.title}>Avoid Disposable Plastic</h1>

        <div className={styles.card}>
          <p className={styles.description}>
            Carry your own container instead of taking disposable plastic items.
          </p>

          <div className={styles.saplingNote}>
            A sapling will be planted in your world.
          </div>

          <button className={styles.doneButton}>
            Mark as Done
          </button>
        </div>
      </main>
    </div>
  );
}
