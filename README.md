# InterviewHub — AI-Powered Technical Interview Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://interview-platform-nine-pi.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render)](https://interview-platform-api.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A full-stack MERN interview platform with **real-time collaborative code editing**, **P2P WebRTC video calls**, **AI-powered performance reviews**, and a complete **DSA practice system** — built for technical interviews at scale.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend | [interview-platform-nine-pi.vercel.app](https://interview-platform-nine-pi.vercel.app) |
| Backend API | Hosted on Render |

**Demo Credentials:**
- **Interviewer:** Register with role `Interviewer`
- **Student:** Register with role `Student`
- **Admin:** `admin@interviewhub.com` / `Admin@123456`

---

## ✨ Features

### 🎙️ Live Interview Sessions
- Unique room links for each session
- Real-time collaborative **Monaco Editor** (code syncs keystroke-by-keystroke)
- **P2P WebRTC** video/audio calls with STUN/TURN relay servers
- Live in-session **chat** with message history
- Interviewer can attach a **DSA problem** to a session
- Real-time **join/leave presence** indicators
- Interviewer can **end session** — student is instantly redirected

### 🤖 AI Performance Review
- Post-session **Gemini AI** review of student's code
- Scores on: Correctness, Time Complexity, Space Complexity, Code Quality
- Highlights **strengths** and **areas for improvement**
- Results cached in MongoDB — no redundant API calls

### 💻 Code Execution Engine
- Supports **5 languages**: JavaScript, Python, Java, C++, TypeScript
- Powered by **Wandbox API** (free, no key required)
- Available in both live sessions and practice mode

### 📚 DSA Practice Sheet
- **10 curated problems** (Two Sum, 3Sum, Binary Search, etc.)
- Full problem details: description, examples, constraints, test cases
- Per-language starter code for all 5 languages
- Fetched from MongoDB — fully managed by admin

### 🔐 Authentication & Roles
| Role | Access |
|---|---|
| **Admin** | Manage problems (add/edit/delete), full system access |
| **Interviewer** | Create sessions, attach problems, video call, end session |
| **Student** | Join sessions, practice DSA, view AI review |

- **httpOnly JWT cookies** — no localStorage token exposure
- Cookie-based auth survives page refresh

### 🛠️ Admin Panel
- Add / edit / delete problems with a rich form
- Dynamic examples, constraints, test cases (add/remove rows)
- Per-language starter code editor with language tabs
- Problem list with difficulty badges and quick actions

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Real-time** | Socket.IO (WebSocket + polling fallback) |
| **Video** | WebRTC with STUN/TURN (Open Relay Project) |
| **Auth** | JWT + httpOnly cookies |
| **AI Review** | Google Gemini API (`gemini-3.6-flash`) |
| **Code Execution** | Wandbox API |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
interview_platform/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js       # Register, Login, Logout, Me
│   │   │   ├── session.controller.js    # Session CRUD + review-info
│   │   │   ├── problem.controller.js    # Problem CRUD (admin)
│   │   │   ├── execute.controller.js    # Code execution via Wandbox
│   │   │   └── review.controller.js     # Gemini AI review
│   │   ├── models/
│   │   │   ├── User.js                  # User schema (roles: admin/interviewer/student)
│   │   │   ├── Session.js               # Session + aiReview subdoc
│   │   │   └── Problem.js               # Problem + examples + testCases
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── session.routes.js        # Includes AI review route
│   │   │   ├── problem.routes.js
│   │   │   └── execute.routes.js
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js       # protect + interviewerOnly
│   │   │   └── admin.middleware.js      # adminOnly
│   │   ├── socket/
│   │   │   └── index.js                 # All Socket.IO events
│   │   └── index.js                     # Express app + CORS + server
│   ├── seed-admin.js                    # One-time admin account creation
│   └── seed-problems.js                 # Seeds 10 DSA problems
│
└── frontend/
    └── src/
        ├── components/
        │   ├── VideoCall.jsx             # WebRTC P2P video
        │   ├── Chat.jsx                  # Socket.IO chat
        │   └── ProtectedRoute.jsx        # Auth guard (role-based)
        ├── pages/
        │   ├── auth/Login.jsx
        │   ├── auth/Register.jsx
        │   ├── InterviewerDashboard.jsx
        │   ├── StudentDashboard.jsx
        │   ├── AdminDashboard.jsx        # Problem management table
        │   ├── AdminProblemForm.jsx      # Add/edit problem form
        │   ├── SessionPage.jsx           # Main interview room
        │   ├── SessionReview.jsx         # AI review display
        │   ├── PracticeSheet.jsx         # DSA problem list
        │   └── PracticeProblem.jsx       # Individual problem + editor
        ├── context/AuthContext.jsx       # Global auth state
        └── lib/
            ├── api.js                    # Axios instance (withCredentials)
            └── socket.js                 # Socket.IO singleton
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)
- Gemini API key ([get free key](https://aistudio.google.com/app/apikey))

### 1. Clone the repository
```bash
git clone https://github.com/Gara-Sriram/interview_platform.git
cd interview_platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env`:
```env
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=AIza...your_key
PORT=5000
```

Create admin account (run once):
```bash
node seed-admin.js
```

Seed 10 DSA problems (run once):
```bash
node seed-problems.js
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

---

## 🌐 Deployment

### Backend → Render
| Variable | Value |
|---|---|
| `MONGO_URI` | Your MongoDB Atlas URI |
| `JWT_SECRET` | Any strong secret string |
| `CLIENT_URL` | Your Vercel URL |
| `GEMINI_API_KEY` | Your Gemini API key |
| `NODE_ENV` | `production` |

### Frontend → Vercel
| Variable | Value |
|---|---|
| `VITE_API_URL` | Your Render backend URL |
| `VITE_SOCKET_URL` | Your Render backend URL |

> Add `vercel.json` at frontend root (already included) for SPA routing support.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Public |
| GET | `/api/auth/me` | Protected |

### Sessions
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/sessions` | Interviewer |
| GET | `/api/sessions` | Protected |
| GET | `/api/sessions/:roomId` | Protected |
| GET | `/api/sessions/:roomId/review-info` | Protected |
| PATCH | `/api/sessions/:roomId/end` | Interviewer |
| POST | `/api/sessions/:roomId/review` | Protected |

### Problems
| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/problems` | Protected |
| GET | `/api/problems/:id` | Protected |
| POST | `/api/problems` | Admin |
| PUT | `/api/problems/:id` | Admin |
| DELETE | `/api/problems/:id` | Admin |

### Execution
| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/execute` | Protected |

---

## 🔄 Socket.IO Events

| Event | Direction | Description |
|---|---|---|
| `join-room` | Client → Server | Join a session room |
| `session-state` | Server → Client | Sync current code on join |
| `code-change` | Client → Server | Broadcast code changes |
| `code-update` | Server → Client | Receive code changes |
| `language-change` | Client → Server | Change editor language |
| `language-update` | Server → Client | Receive language change |
| `chat-message` | Client → Server | Send chat message |
| `chat-message` | Server → Client | Receive chat message |
| `chat-history` | Server → Client | Past messages on join |
| `user-joined` | Server → Client | Presence notification |
| `user-left` | Server → Client | Presence notification |
| `session-ended` | Client → Server | Interviewer ends session |
| `session-ended` | Server → Client | Kick participants out |
| `webrtc-offer` | Client → Server | WebRTC signaling |
| `webrtc-answer` | Client → Server | WebRTC signaling |
| `webrtc-ice-candidate` | Client → Server | WebRTC ICE candidate |

---

## 📸 Screenshots

> *Coming soon — add screenshots of the session room, practice sheet, and AI review page here.*

---

## 📄 License

MIT License — feel free to use this project for learning or as a portfolio piece.

---

## 👤 Author

**Gara Sri Ram**
- GitHub: [@Gara-Sriram](https://github.com/Gara-Sriram)
- LinkedIn: [Sriram Gara](https://www.linkedin.com/in/sriram-gara-952120293/)
- Email: garasriram@gmail.com
