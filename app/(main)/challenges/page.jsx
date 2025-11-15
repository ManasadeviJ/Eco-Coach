import styles from './challenges.module.css';

export default function ChallengesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.headerTitle}>Daily Challenges</h1>

      <div className={styles.card}>
        <div className={styles.cardText}>
          <h3 className={styles.cardTitle}>Avoid Plastic</h3>
          <p className={styles.cardMeta}>Reward: 1 Coin</p>
        </div>
        <button className={styles.actionButton}>Mark as Done</button>
      </div>
    </div>
  );
}
