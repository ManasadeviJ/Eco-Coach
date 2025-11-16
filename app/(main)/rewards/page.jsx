import Sidebar from "@/components/Sidebar/Sidebar";
import reward from "./rewards.module.css";

export default function RewardsPage() {
  return (
    <div className={reward.wrapper}>
      <Sidebar />

      <main className={reward.main}>
        <h1 className={reward.headerTitle}>Today's Rewards</h1>

        <div className={reward.box}>
          <div className={reward.rewardText}>+1 Coin</div>
          <p className={reward.subtext}>
            Great job completing your challenge.
          </p>
          <button className={reward.collectButton}>Collect Coin</button>
        </div>
      </main>
    </div>
  );
}
