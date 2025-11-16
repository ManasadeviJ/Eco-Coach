"use client";
import { useState } from "react";
import styles from "./chat.module.css";

export default function ChatPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! 🌱 How can I help you live greener today?" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", text: input }]);
    setInput("");

    // Fake AI reply placeholder
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "assistant", text: "Here’s an eco tip: Carry a reusable bottle!" }
      ]);
    }, 600);
  };

  return (
    <div className={styles.wrapper}>

      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <h2 className={styles.logo}>EcoCoach</h2>
        <a href="/home" className={styles.sidebarItem}>Home</a>
        <a href="/chat" className={styles.sidebarItemActive}>Chat</a>
        <a href="/challenges" className={styles.sidebarItem}>Challenges</a>
        <a href="/world" className={styles.sidebarItem}>World</a>
        <a href="/rewards" className={styles.sidebarItem}>Rewards</a>
      </aside>

      {/* Main Chat Area */}
      <main className={styles.container}>

        {/* Mobile Top Bar */}
        <div className={styles.mobileTopBar}>
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
          <h2 className={styles.header}>Ask Eco Coach</h2>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <a href="/home">Home</a>
            <a href="/chat">Chat</a>
            <a href="/challenges">Challenges</a>
            <a href="/world">World</a>
            <a href="/rewards">Rewards</a>
          </div>
        )}

        {/* Desktop Header */}
        <h2 className={styles.desktopHeader}>Ask Eco Coach</h2>

        {/* Quick Prompt Chips */}
        <div className={styles.chipsRow}>
          <button className={styles.chip}>How to reduce plastic?</button>
          <button className={styles.chip}>Eco alternatives?</button>
          <button className={styles.chip}>Today’s challenge?</button>
        </div>

        {/* Chat Messages */}
        <div className={styles.chatArea}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user" ? styles.userBubble : styles.aiBubble
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className={styles.inputBar}>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Ask something eco-friendly..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className={styles.sendButton} onClick={sendMessage}>
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}
