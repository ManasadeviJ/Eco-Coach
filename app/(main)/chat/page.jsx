"use client";

import { useState } from "react";
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

  // -------------------------
  // SEND MESSAGE TO SERVER API
  // -------------------------
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    // Add user message to UI
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");

    // Temporary “thinking…”
    setMessages(prev => [
      ...prev,
      { role: "assistant", text: "Thinking…" }
    ]);

    try {
      // Call server API
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      const aiReply = data.reply || "⚠️ No response from AI.";

      // Replace the "Thinking…" message
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: aiReply
        };
        return updated;
      });
    } catch (err) {
      console.error("Chat Error:", err);

      // Replace with error message
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          text: "⚠️ AI is unavailable. Try again soon."
        };
        return updated;
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <main className={styles.main}>
        <h2 className={styles.title}>Ask Eco Coach</h2>

        {/* CHAT AREA */}
        <div className={styles.chatArea}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.msgRow} ${
                msg.role === "user" ? styles.right : styles.left
              }`}
            >
              {/* AI icon */}
              {msg.role === "assistant" && (
                <div className={styles.aiIcon}>
                  <img src="/icons/leaf.png" alt="icon" />
                </div>
              )}

              {/* BUBBLE */}
              <div className={styles.bubbleWrapper}>
                <div
                  className={
                    msg.role === "assistant"
                      ? styles.aiBubble
                      : styles.userBubble
                  }
                >
                  {msg.text}
                </div>

                {/* POPUP MENU */}
                {msg.role === "assistant" && (
                  <button
                    className={styles.dots}
                    onClick={() =>
                      setOpenMenu(openMenu === index ? null : index)
                    }
                  >
                    ⋮
                  </button>
                )}

                {openMenu === index && (
                  <div className={styles.popupMenu}>
                    <button>Add as Challenge</button>
                  </div>
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
