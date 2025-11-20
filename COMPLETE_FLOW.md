# Complete Challenge Flow Implementation

## Summary of Files Needed

This guide provides all complete files for the challenge flow:
**Accept Challenge → Home Circle → Complete → Reward Popup → Update Sidebar & World**

---

## 1. CompletionReward.jsx (Popup Component)

File: `components/CompletionReward/CompletionReward.jsx`

```jsx
"use client";
import React from "react";
import styles from "./CompletionReward.module.css";

const ecoMessages = [
  "🌍 Great job, eco-warrior!",
  "♻️ Every action counts!",
  "🌱 You're growing the planet!",
  "💚 Mother Earth thanks you!",
  "🌿 Keep up the green work!",
  "🌳 Planting hope today!",
];

export default function CompletionReward({ open, onClose, coinsEarned = 5, treeGrown = true }) {
  if (!open) return null;

  const message = ecoMessages[Math.floor(Math.random() * ecoMessages.length)];

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.celebration}>
          <div className={styles.icon}>🎉</div>
        </div>

        <h2 className={styles.title}>Challenge Complete!</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.rewards}>
          {coinsEarned > 0 && (
            <div className={styles.reward}>
              <img src="/icons/coin.png" alt="coins" className={styles.rewardIcon} />
              <span className={styles.rewardText}>+{coinsEarned} Coins</span>
            </div>
          )}

          {treeGrown && (
            <div className={styles.reward}>
              <img src="/icons/growntree.png" alt="tree" className={styles.rewardIcon} />
              <span className={styles.rewardText}>Tree Growing!</span>
            </div>
          )}
        </div>

        <button className={styles.closeBtn} onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
}
```

---

## 2. CompletionReward.module.css

File: `components/CompletionReward/CompletionReward.module.css`

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes slideUp {
  from {
    transform: translateY(40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.celebration { margin-bottom: 1.5rem; }

.icon {
  font-size: 4rem;
  animation: bounce 0.6s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #15803d;
  margin-bottom: 0.75rem;
}

.message {
  font-size: 1.1rem;
  color: #166534;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.rewards {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
}

.reward {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.rewardIcon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.rewardText {
  font-size: 0.95rem;
  font-weight: 600;
  color: #15803d;
}

.closeBtn {
  background: #78C841;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.closeBtn:hover { background: #65a832; }
.closeBtn:active { transform: scale(0.98); }
```

---

## 3. home/page.jsx (Complete File)

File: `app/(main)/home/page.jsx`

Already provided above - uses CompletionReward component and dispatches coinsUpdated event.

---

## 4. Sidebar.jsx (Update to Listen for Coin Events)

File: `components/Sidebar/Sidebar.jsx`

```jsx
"use client";

import { useState, useEffect } from "react";
import styles from "./sidebar.module.css";
import { useAuth } from "@/context/AuthContext";
import usePoints from "@/hooks/usePoints";
import Link from "next/link";

export default function Sidebar() {
  const auth = useAuth();
  const user = auth?.user;
  const userId = user?.id;
  const { points: coins, loading } = usePoints(userId);
  const [localCoins, setLocalCoins] = useState(coins);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalCoins(coins);
  }, [coins]);

  // Listen for coin updates from challenge completion
  useEffect(() => {
    const handleCoinsUpdate = (event) => {
      const newCoins = event.detail?.coins || 0;
      setLocalCoins((prev) => (prev || 0) + newCoins);
    };

    window.addEventListener("coinsUpdated", handleCoinsUpdate);
    return () => window.removeEventListener("coinsUpdated", handleCoinsUpdate);
  }, []);

  return (
    <>
      {/* Mobile Hamburger */}
      <button className={styles.menuButton} onClick={() => setOpen(true)} aria-label="open menu">
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </button>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}

      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <button className={styles.closeButton} onClick={() => setOpen(false)} aria-label="close menu">✕</button>

        <h2 className={styles.logo}>EcoCoach</h2>

        <nav className={styles.nav}>
          <Link href="/home" className={styles.item}>Home</Link>
          <Link href="/chat" className={styles.item}>Chat</Link>
          <Link href="/challenges" className={styles.item}>Challenges</Link>
          <Link href="/world" className={styles.item}>World</Link>
          <Link href="/rewards" className={styles.item}>Rewards</Link>
        </nav>

        <div className={styles.bottomSection}>
          <Link href="/profile" className={styles.profileBtn}>
            <img src="/icons/user.png" alt="Profile" />
            My Profile
          </Link>
        </div>
      </aside>

      <div className={styles.topStats}>
        <div className={styles.coins} title="Your coins">
          <img src="/icons/coin.png" alt="coins" />
          <span>{loading ? "…" : (localCoins ?? 0)}</span>
          <button className={styles.plus} aria-label="Add coins">+</button>
        </div>

        <div className={styles.trees}>
          🌳 <span>3</span>
        </div>
      </div>
    </>
  );
}
```

---

## 5. API Endpoints Needed

### /api/active (GET)
Returns current active challenge for user

### /api/complete (POST)
Completes a challenge and returns coins earned:
```json
{
  "success": true,
  "coins_earned": 5,
  "points": 5
}
```

---

## Complete Flow Summary

1. **User selects challenge** → Calls `/api/active` (POST)
2. **Home page loads** → Displays challenge in circle with timer
3. **User clicks Done** → Calls `/api/complete` (POST)
4. **Popup shows** → CompletionReward with eco message + coins + tree
5. **Sidebar updates** → Listens to `coinsUpdated` event
6. **World updates** → New tree created via `/api/complete` response

---
