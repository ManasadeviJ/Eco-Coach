// Challenge Logic Functions

/**
 * Load accepted challenge from localStorage
 */
export const loadAcceptedChallenge = () => {
  try {
    const storedChallenge = localStorage.getItem("acceptedChallenge");
    if (storedChallenge) {
      return JSON.parse(storedChallenge);
    }
    return null;
  } catch (error) {
    console.error("Error loading accepted challenge:", error);
    return null;
  }
};

/**
 * Save accepted challenge to localStorage
 */
export const saveAcceptedChallenge = (challenge) => {
  try {
    localStorage.setItem("acceptedChallenge", JSON.stringify(challenge));
  } catch (error) {
    console.error("Error saving accepted challenge:", error);
  }
};

/**
 * Remove accepted challenge from localStorage
 */
export const removeAcceptedChallenge = () => {
  try {
    localStorage.removeItem("acceptedChallenge");
  } catch (error) {
    console.error("Error removing accepted challenge:", error);
  }
};

/**
 * Load coins from localStorage
 */
export const loadCoins = () => {
  try {
    return parseInt(localStorage.getItem("coins") || "0");
  } catch (error) {
    console.error("Error loading coins:", error);
    return 0;
  }
};

/**
 * Save coins to localStorage
 */
export const saveCoins = (coins) => {
  try {
    localStorage.setItem("coins", coins.toString());
    // Trigger custom event for components listening to coin updates
    window.dispatchEvent(new CustomEvent("coinsUpdated", { detail: { coins } }));
  } catch (error) {
    console.error("Error saving coins:", error);
  }
};

/**
 * Add coins and return new total
 */
export const addCoins = (amount = 1) => {
  const currentCoins = loadCoins();
  const newCoins = currentCoins + amount;
  saveCoins(newCoins);
  return newCoins;
};

/**
 * Calculate tree stage based on timer percentage
 */
export const getTreeStage = (percentage) => {
  if (percentage < 33) return "sapling";
  if (percentage < 66) return "half";
  if (percentage < 100) return "full";
  return "full";
};

/**
 * Calculate timer percentage for 12-hour challenge
 */
export const getTimerPercentage = (startTime) => {
  const totalTime = 12 * 60 * 60 * 1000; // 12 hours
  const elapsed = Date.now() - startTime;
  return Math.min((elapsed / totalTime) * 100, 100);
};

/**
 * Complete challenge and award coins
 */
export const completeChallenge = () => {
  try {
    const newCoins = addCoins(1);
    removeAcceptedChallenge();
    return { success: true, coins: newCoins };
  } catch (error) {
    console.error("Error completing challenge:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Accept challenge
 */
export const acceptChallenge = (challenge) => {
  try {
    saveAcceptedChallenge(challenge);
    return { success: true };
  } catch (error) {
    console.error("Error accepting challenge:", error);
    return { success: false, error: error.message };
  }
};
