// "use client";

// import { useState } from "react";
// import Sidebar from "@/components/Sidebar/Sidebar";
// import styles from "./chat.module.css";

// export default function ChatPage() {
//   const [messages, setMessages] = useState([
//     { role: "assistant", text: "How can I reduce plastic waste?" },
//     { role: "user", text: "Tell me simple eco alternatives." },
//     { role: "assistant", text: "You can start carrying a reusable bag!" }
//   ]);

//   const [input, setInput] = useState("");
//   const [openMenu, setOpenMenu] = useState(null);

//   // -------------------------
//   // SEND MESSAGE TO SERVER API
//   // -------------------------
//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userMessage = input;

//     // Add user message to UI
//     setMessages(prev => [...prev, { role: "user", text: userMessage }]);
//     setInput("");

//     // Temporary “thinking…”
//     setMessages(prev => [
//       ...prev,
//       { role: "assistant", text: "Thinking…" }
//     ]);

//     try {
//       // Call server API
//       const response = await fetch("/api/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMessage })
//       });

//       const data = await response.json();
//       const aiReply = data.reply || "⚠️ No response from AI.";

//       // Replace the "Thinking…" message
//       setMessages(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1] = {
//           role: "assistant",
//           text: aiReply
//         };
//         return updated;
//       });
//     } catch (err) {
//       console.error("Chat Error:", err);

//       // Replace with error message
//       setMessages(prev => {
//         const updated = [...prev];
//         updated[updated.length - 1] = {
//           role: "assistant",
//           text: "⚠️ AI is unavailable. Try again soon."
//         };
//         return updated;
//       });
//     }
//   };

//   return (
//     <div className={styles.wrapper}>
//       <Sidebar />

//       <main className={styles.main}>
//         <h2 className={styles.title}>Ask Eco Coach</h2>

//         {/* CHAT AREA */}
//         <div className={styles.chatArea}>
//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`${styles.msgRow} ${
//                 msg.role === "user" ? styles.right : styles.left
//               }`}
//             >
//               {/* AI icon */}
//               {msg.role === "assistant" && (
//                 <div className={styles.aiIcon}>
//                   <img src="/icons/leaf.png" alt="icon" />
//                 </div>
//               )}

//               {/* BUBBLE */}
//               <div className={styles.bubbleWrapper}>
//                 <div
//                   className={
//                     msg.role === "assistant"
//                       ? styles.aiBubble
//                       : styles.userBubble
//                   }
//                 >
//                   {msg.text}
//                 </div>

//                 {/* POPUP MENU */}
//                 {msg.role === "assistant" && (
//                   <button
//                     className={styles.dots}
//                     onClick={() =>
//                       setOpenMenu(openMenu === index ? null : index)
//                     }
//                   >
//                     ⋮
//                   </button>
//                 )}

//                 {openMenu === index && (
//                   <div className={styles.popupMenu}>
//                     <button>Add as Challenge</button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* INPUT BAR */}
//         <div className={styles.inputBar}>
//           <input
//             className={styles.input}
//             placeholder="Ask eco-friendly questions…"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           />
//           <button className={styles.sendBtn} onClick={sendMessage}>
//             ➤
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "How can I reduce plastic waste?" },
    { role: "user", text: "Tell me simple eco alternatives." },
    { role: "assistant", text: "You can start carrying a reusable bag!" }
  ]);

  const [input, setInput] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [userId, setUserId] = useState(null); // you can use auth to set this
  const [lastAssistIndex, setLastAssistIndex] = useState(null);
  const abortRef = useRef(null);

  // On mount: try to get location
  useEffect(() => {
    // optionally set userId from auth system here
    // setUserId("some-user-uuid");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setLocation({ lat, lon });
        },
        (err) => {
          console.warn("Location denied or unavailable:", err);
          setLocation(null);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setLocation(null);
    }
  }, []);

  // When location changes, fetch weather from server
  useEffect(() => {
    if (!location) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setLoadingWeather(true);

    (async () => {
      try {
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: location.lat, lon: location.lon }),
          signal: controller.signal
        });

        if (!res.ok) {
          console.error("Weather fetch failed", await res.text());
          setWeather(null);
          setLoadingWeather(false);
          return;
        }
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        if (e.name === "AbortError") return;
        console.error("Weather error", e);
        setWeather(null);
      } finally {
        setLoadingWeather(false);
      }
    })();

    return () => controller.abort();
  }, [location]);

  // send message to server
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    // add temporary thinking message
    setMessages(prev => {
      const next = [...prev, { role: "assistant", text: "Thinking…" }];
      setLastAssistIndex(next.length - 1);
      return next;
    });

    try {
      const payload = {
        message: userMessage,
        location,
        weather,
        userId
      };

      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      // expecting { eco_response, eco_challenge } or { reply }
      const aiReply = data.eco_response ?? data.reply ?? "⚠️ No response from AI.";

      setMessages(prev => {
        const updated = [...prev];
        // replace the last assistant "Thinking…"
        const idx = lastAssistIndex ?? (updated.length - 1);
        updated[idx] = { role: "assistant", text: aiReply, meta: data };
        return updated;
      });
    } catch (err) {
      console.error("Chat Error:", err);
      setMessages(prev => {
        const updated = [...prev];
        const idx = lastAssistIndex ?? (updated.length - 1);
        updated[idx] = { role: "assistant", text: "⚠️ AI is unavailable. Try again soon." };
        return updated;
      });
    }
  };

  // Save challenge to supabase via server route
  const addAsChallenge = async (challengeText, index) => {
    try {
      const body = {
        userId,
        challenge: challengeText,
        weather,
        location
      };
      const res = await fetch("/api/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }
      const data = await res.json();
      // UI feedback (simple):
      setMessages(prev => {
        const updated = [...prev];
        updated[index].savedChallengeId = data.id;
        return updated;
      });
      alert("Challenge saved!");
    } catch (e) {
      console.error("Failed to save challenge:", e);
      alert("Could not save challenge. Try again.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h2 className={styles.title}>Ask Eco Coach</h2>

        {/* show small weather badge */}
        <div style={{ marginBottom: 12 }}>
          {loadingWeather ? (
            <small>Loading local weather…</small>
          ) : weather ? (
            <small>
              {weather.summary} • {weather.temperature}°C
            </small>
          ) : (
            <small>No location/weather</small>
          )}
        </div>

        {/* CHAT AREA */}
        <div className={styles.chatArea}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.msgRow} ${msg.role === "user" ? styles.right : styles.left}`}
            >
              {msg.role === "assistant" && (
                <div className={styles.aiIcon}>
                  <img src="/icons/leaf.png" alt="icon" />
                </div>
              )}

              <div className={styles.bubbleWrapper}>
                <div className={msg.role === "assistant" ? styles.aiBubble : styles.userBubble}>
                  {msg.text}
                </div>

                {msg.role === "assistant" && (
                  <>
                    <button
                      className={styles.dots}
                      onClick={() => setOpenMenu(openMenu === index ? null : index)}
                    >
                      ⋮
                    </button>

                    {openMenu === index && (
                      <div className={styles.popupMenu}>
                        <button
                          onClick={() => {
                            // if AI returned a structured challenge in meta.eco_challenge prefer that
                            const candidate =
                              (msg.meta && (msg.meta.eco_challenge || msg.meta.challenge)) || msg.text;
                            addAsChallenge(candidate, index);
                            setOpenMenu(null);
                          }}
                        >
                          Add as Challenge
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* INPUT BAR */}
        <div className={styles.inputBar}>
          <input
            className={styles.input}
            placeholder="Ask eco-friendly questions…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className={styles.sendBtn} onClick={sendMessage}>
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}
