# 📌 **README.md — Eco Coach (AI Powered Eco Habit App)**

```markdown
# 🌿 Eco Coach — AI Powered Eco Habit Builder

Eco Coach is an AI-based eco-habit app that helps users adopt sustainable daily actions.  
It gives personalized eco-friendly challenges using **AI + Weather + Location**, and rewards users by growing a virtual ecological world.

---

## 🚀 Features

### 🧠 AI Assistant  
Ask the Eco Coach anything and get eco-friendly action ideas powered by OpenAI.

### 🌦 Weather-Based Suggestions  
Get challenges based on your live weather (rainy, sunny, cloudy, hot days).

### 📍 Location-Based Suggestions  
Eco tips based on your surrounding environment (home, street, college, travel).

### 🪴 Virtual Eco World  
Completing challenges grows your trees.  
Missing challenges dries your saplings.

### 🏆 Gamification  
- Earn coins  
- Maintain streaks  
- Grow plants → healthy trees  
- Unlock birds & greenery  

---

## 🛠 Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- React
- Tailwind CSS
- CSS Modules

### **Backend**
- Next.js API Routes
- Supabase Auth + Database
- OpenAI API (GPT-4o / GPT-4o-mini)

### **APIs**
- OpenMeteo (Weather)
- HTML5 Geolocation API

---

## 📁 Folder Structure

```

eco-coach/
│
├── app/
│   ├── (auth)/login/
│   │      └── page.jsx
│   │      └── login.module.css
│   ├── (main)/
│   │      ├── home/
│   │      ├── chat/
│   │      ├── challenges/
│   │      ├── challenge/[id]/
│   │      ├── world/
│   │      ├── rewards/
│   │      ├── profile/
│   │      └── settings/
│   ├── api/
│   │      ├── chat/
│   │      ├── challenge/
│   │      ├── active/
│   │      ├── complete/
│   │      ├── forest/
│   │      ├── weather/
│   │      ├── location/
│   │      └── suggest/
│   └── layout.jsx
│
├── components/
│   ├── ui/
│   ├── ChallengeCard.jsx
│   ├── ForestGrid.jsx
│   ├── Plant.jsx
│   ├── RewardAnimation.jsx
│   ├── Popup.jsx
│   └── BottomNav.jsx
│
├── lib/
│   ├── supabaseClient.js
│   ├── openai.js
│   ├── forestLogic.js
│   ├── challengeLogic.js
│   ├── weatherLogic.js
│   ├── locationLogic.js
│   └── auth.js
│
├── utils/
│   ├── constants.js
│   ├── formatDate.js
│   ├── calculatePoints.js
│   ├── mapWeatherToChallenges.js
│   ├── mapLocationToChallenges.js
│   └── validators.js
│
├── public/
│   ├── icons/
│   ├── avatars/
│   └── plants/
│
├── styles/
├── .env.local
└── README.md

```

---

## 🔧 Environment Variables (`.env.local`)

```

NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
OPENAI_API_KEY=""

```

Optional:

```

NEXT_PUBLIC_WEATHER_API=""

````

---

## 📥 Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/eco-coach.git
cd eco-coach
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Add environment variables

Create `.env.local` and paste required keys.

### 4️⃣ Start development server

```bash
npm run dev
```

App starts at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🌐 API Routes Summary

| Route            | Method | Description                 |
| ---------------- | ------ | --------------------------- |
| `/api/chat`      | POST   | AI chat suggestions         |
| `/api/challenge` | POST   | Convert AI idea → challenge |
| `/api/active`    | GET    | Get user active challenges  |
| `/api/complete`  | POST   | Mark challenge as completed |
| `/api/forest`    | GET    | Get world trees             |
| `/api/weather`   | POST   | Weather-based suggestions   |
| `/api/location`  | POST   | Location-based suggestions  |
| `/api/suggest`   | GET    | Combined smart eco ideas    |

---

## 🎨 UI Screens (Add Your Images)

```
/public/screenshots/home.png
/public/screenshots/world.png
/public/screenshots/chat.png
```

Replace the placeholders when you have screenshots.

---

## 🧩 Future Enhancements

* Avatar customization
* Leaderboard
* Badges & achievements
* AR-based eco world
* Festival-based eco tips
* Eco score system

---

## 👨‍💻 Contributors

* Developer
* Designer
* Backend Lead
* AI Integrations
* Hackathon Team

(Replace with your team names)

---

## 📜 License

MIT License © 2025 Eco Coach Project

---


