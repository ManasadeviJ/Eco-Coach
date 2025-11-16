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

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
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
              {/* AI icon on left only */}
              {msg.role === "assistant" && (
                <div className={styles.aiIcon}>
                  <img src="/icons/leaf.png" alt="icon" />
                </div>
              )}

              {/* Bubble */}
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

                {/* 3 Dots for AI messages */}
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
