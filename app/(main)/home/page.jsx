import styles from './home.module.css';

export default function HomePage() {
return (
<div className={styles.container}>
<div>
<h1 className={styles.headerTitle}>Hi, User</h1>
<p className={styles.headerSubtitle}>Your daily progress</p>
</div>


<div className={styles.statsRow}>
<div className={styles.statCard}>12 Coins</div>
<div className={styles.statCard}>5 Trees</div>
</div>


<div className={styles.suggestionCard}>
<h2 className={styles.suggestionTitle}>Today's Eco Action</h2>
<p className={styles.suggestionText}>Carry your own cloth bag today.</p>
<button className={styles.primaryButton}>Set as Challenge</button>
</div>


<div className={styles.navGrid}>
<a href="/chat" className={styles.navItem}>Chat</a>
<a href="/challenges" className={styles.navItem}>Challenges</a>
<a href="/world" className={styles.navItem}>World</a>
<a href="/rewards" className={styles.navItem}>Rewards</a>
</div>
</div>
);
}