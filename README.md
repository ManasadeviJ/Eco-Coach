# **Gamified AI Eco Coach**

A gamified, AI-driven habit-building app that transforms eco-friendly actions into an engaging game.
Users accept challenges, earn coins, grow trees in a virtual world, and receive AI-personalized eco suggestions based on **weather** and **location**.

Built with **Next.js**, **Supabase**, and **AI models** (OpenAI/Gemini).
Fully responsive, modern UI, optimized for demo/hackathon presentations.

---

## **Features**

### 🌱 **Gamified Eco Challenges**

* Daily challenges with reward points
* Saplings evolve → half-grown plants → fully grown trees
* Fail a challenge → sapling turns into a dry tree
* Revive trees using coins

### 🧠 **AI-Powered Suggestions**

* AI generates new eco tasks
* Weather + location + user context fed into the model
* Personalized, actionable eco habits

### ☀️ **Weather & Location Integration**

* Location permission → fetch coordinates
* Weather API (Open-Meteo or OpenWeather)
* AI suggestions adjust to conditions

  * Hot day → “Reduce AC usage”
  * Rainy → “Avoid plastic umbrellas”

### 🌍 **Virtual World**

* Every completed challenge plants a new sapling in your world
* Visual world of trees, birds, and eco-elements
* Bird count increases every 3 grown trees
* Interactive world with revive actions

### 🪙 **Reward System**

* Coins earned for every completion
* Coins saved globally using Supabase
* Coins displayed in the sidebar across all screens

### 🔐 **Supabase Authentication**

* Email/password signup & login
* Session persistence
* Global AuthContext

### 💬 **Chat Page (AI Coach)**

* Eco-focused AI chat
* Keeps conversation history
* Generates actionable eco ideas

---

## **Tech Stack**

### **Frontend**

* Next.js (App Router)
* React + Context API
* CSS Modules
* Responsive design for all devices

### **Backend**

* Supabase Auth
* Supabase Database (PostgreSQL)
* Supabase RLS (Row Level Security)
* Edge Functions ready (optional)
* Weather API (Open-Meteo)

### **AI**

* Supports OpenAI or Google Gemini API
* Server-side API routes for prompt handling

---

## **Folder Structure**

```
/app
 ├── (auth)/login
 ├── (auth)/signup
 ├── welcome
 ├── home
 ├── chat
 ├── challenges
 ├── world
 └── api/
      ├── ask
      ├── challenge
      ├── weather
      ├── world
/components
/context
/lib
/styles
```

---

## **Supabase Schema (Simplified)**

### **Challenges**

```sql
id bigint PK
title text
description text
points int
duration_hours int
```

### **User Active Challenges**

```sql
id bigint PK
user_id uuid FK
challenge_id bigint FK
status text
accepted_at timestamptz
deadline_at timestamptz
completed_at timestamptz
```

### **World Objects**

```sql
id bigint PK
user_id uuid FK
type text  -- sapling | half | tree | dry | bird
level int
pos_x float
pos_y float
```

### **User Points**

```sql
user_id uuid PK
coins int
streak_days int
last_completed_date date
```

---

## **How the Game Loop Works**

### 1️⃣ Accept Challenge

→ Creates a row in `user_active_challenges`
→ Adds a sapling into `user_world_objects`

### 2️⃣ Timer

→ Deadline stored in DB
→ Client shows a circular progress ring

### 3️⃣ Complete

→ Validate deadline
→ Award coins
→ Promote plant to next stage

### 4️⃣ Fail Challenge

→ Worker or client detects expiry
→ Plant becomes dry

### 5️⃣ Revive

→ Spend 1 coin
→ Dry plant becomes sapling

---

## **AI Flow**

1. Get user location
2. Fetch weather data
3. Send `weather + location + user message` to AI
4. Parse structured eco suggestions
5. Display challenge + store in DB (optional)

---

## **Local Development**

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Environment variables (`.env.local`):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
GEMINI_API_KEY=

```

---

## **Screens**

### ✔ Welcome Page

Beautiful plant illustration + CTA button.

### ✔ Signup/Login

Full Supabase auth integration.

### ✔ Home Dashboard

Circular timer + challenge card.

### ✔ AI Coach

Chat interface with weather-aware suggestions.

### ✔ Challenge List

Accept and complete eco challenges.

### ✔ World View

Interactive planet with trees, birds, and revives.
Demo mode for now.

---

## **Future Improvements**

* Leaderboard
* Multiplayer forests
* Badges & achievements
* Push notifications
* Carbon footprint tracking

---

## 📜 License

MIT License © 2025 Eco Coach Project

---
