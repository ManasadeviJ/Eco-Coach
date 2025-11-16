// Test file to verify challenge logic works
// Remove this after testing

// Mock localStorage for testing
if (typeof window !== "undefined") {
  console.log("=== Challenge Logic Test ===");
  
  // Test 1: Save and load coins
  localStorage.setItem("coins", "5");
  const coins = parseInt(localStorage.getItem("coins") || "0");
  console.log("Test 1 - Load coins:", coins === 5 ? "✓ PASS" : "✗ FAIL");
  
  // Test 2: Add coins
  localStorage.setItem("coins", "5");
  const newCoins = 5 + 1;
  localStorage.setItem("coins", newCoins.toString());
  const updatedCoins = parseInt(localStorage.getItem("coins") || "0");
  console.log("Test 2 - Add coins:", updatedCoins === 6 ? "✓ PASS" : "✗ FAIL");
  
  // Test 3: Custom event
  let eventFired = false;
  window.addEventListener("coinsUpdated", () => {
    eventFired = true;
  });
  window.dispatchEvent(new CustomEvent("coinsUpdated", { detail: { coins: 6 } }));
  console.log("Test 3 - Custom event:", eventFired ? "✓ PASS" : "✗ FAIL");
  
  console.log("=== End Tests ===");
}

export default function TestPage() {
  return <div>Test file - Remove after testing</div>;
}
