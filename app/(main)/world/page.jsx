
import world from './world.module.css';
export default function WorldPage() {
return (
<div className={world.container}>
<div>
<h1 className={world.headerTitle}>Your World</h1>
<p className={world.headerSubtitle}>Every action adds life to the planet.</p>
</div>


<div className={world.statsRow}>
<div className={world.statCard}>12 Coins</div>
<div className={world.statCard}>5 Trees</div>
<div className={world.statCard}>2 Birds</div>
</div>


<div className={world.globeWrapper}>
<div className={world.globe}>Globe Placeholder</div>
</div>


<div className={world.actions}>
<a href="/challenges" className={world.actionItem}>Challenges</a>
<a href="/shop" className={world.actionItem}>Shop</a>
<button className={world.actionItem}>Share</button>
</div>
</div>
);
}