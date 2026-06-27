Here's the **complete project description** written as if you built it end-to-end:

---

## Resume Project Entry

**Talent IQ — Real-Time Technical Interview Platform**
`React • Node.js • Express • MongoDB • Socket.io • WebRTC • Docker • Vercel • Render`
🔗 [Live Demo](https://interview-platform-nine-pi.vercel.app) | [GitHub](https://github.com/Gara-Sriram/interview_platform)

---

## Full Description (For Portfolio / LinkedIn / README)

> Talent IQ is a production-deployed, full-stack technical interview platform that replicates the experience of platforms like CoderPad and HackerRank Interview. It enables interviewers and candidates to conduct complete coding interviews in a single, unified interface — with real-time collaborative code editing, live video/audio, in-session chat, and instant multi-language code execution.

---

## Bullet Points for Resume (Pick 4–5)

- Architected and deployed a **full-stack real-time interview platform** (MERN stack) enabling live coding sessions with video, chat, and collaborative editing used end-to-end from authentication to deployment
- Built **real-time collaborative code editing** using Socket.io with a custom `suppressNextEmit` ref pattern to prevent infinite broadcast loops; both participants see live keystroke-by-keystroke updates with typing indicators and connection status
- Integrated **WebRTC video/audio calling and real-time chat** via Stream SDK with session-scoped rooms; implemented multi-language code execution (JavaScript, Python, Java, C++) using Piston API with live output rendering
- Implemented **self-hosted authentication** from scratch using JWT (httpOnly cookies) + bcrypt — eliminating third-party auth dependency — with secure redirect-after-login preserving deep-linked session invite URLs through the auth flow
- Designed **invite-only private sessions** using 40-character cryptographic tokens embedded in shareable URLs; server validates token on every join attempt, blocking unauthorized access with zero public session exposure
- Solved **cross-domain cookie problem** in split deployment (Vercel frontend + Render backend) by configuring Vercel reverse proxy rewrites on `/api/*` — making cookies appear same-domain to the browser without changing any client code
- Containerized full application with **Docker Compose** (separate containers for frontend, backend); configured WebSocket-only Socket.io transport for Render compatibility and wrote startup migration to auto-drop legacy database indexes

---

## Complete Feature List (For GitHub README or Portfolio Site)

### 🔐 Authentication
- Custom registration and login with JWT stored in httpOnly cookies (not localStorage — XSS safe)
- Passwords hashed with bcrypt (12 salt rounds)
- Persistent sessions via 7-day JWT expiry
- Automatic redirect-after-login — if a user visits a session invite link while logged out, they land exactly on that session after login with the invite token preserved in the URL

### 🎥 Video & Chat
- Real-time WebRTC video and audio calls using Stream Video SDK
- In-session text chat using Stream Chat SDK
- Session-scoped rooms — each interview session gets isolated audio/video/chat channels

### 💻 Collaborative Code Editor
- Monaco Editor (same engine as VS Code) with syntax highlighting
- Real-time bidirectional code sync via Socket.io — both users see every keystroke live
- Typing indicator ("Collaborator is typing...") with 1-second debounce
- Live peer connection status (waiting / connected / typing)
- Language switching (JavaScript, Python, Java, C++) synced across both users
- Language change resets starter code for both participants simultaneously

### ⚡ Code Execution
- Multi-language code execution via Piston API (self-hosted execution engine)
- Supports JavaScript, Python, Java, C++ with language-specific runtime configs
- Live output panel with stdout/stderr display and execution status

### 📋 Session Management
- Curated problem set with difficulty labels (Easy / Medium / Hard) and starter code per language
- Host creates a session, selects a problem, and gets a unique invite link instantly
- Invite-only access — sessions are private by default; only users with the cryptographic token can join
- Session lifecycle: Active → Completed (host ends session)
- "My Sessions" dashboard showing only sessions the logged-in user hosts or participates in
- Recent sessions history

### 🔒 Security
- 40-character hex invite tokens (`crypto.randomBytes(20)`) embedded in shareable URLs
- Server validates invite token on every join attempt — wrong/missing token returns 403
- JWT stored in httpOnly, Secure, SameSite cookies — never accessible to JavaScript
- CORS whitelist with dynamic origin validation + localhost passthrough for development
- Legacy MongoDB index cleanup on startup (prevents E11000 errors from schema migrations)

### 🚀 Deployment
- Frontend: Vercel (Vite/React) with `/api/*` reverse proxy rewrites
- Backend: Render (Node.js/Express + Socket.io) with WebSocket-only transport
- Docker Compose for local development (frontend + backend + environment isolation)
- GitHub-based CI — every push to `main` auto-deploys to both Vercel and Render

---

## One-Liner for Skills Section
> **Talent IQ** — Production-deployed interview platform with WebRTC video, Socket.io collaborative editing, JWT auth, and invite-only sessions | *React, Node.js, MongoDB, Socket.io, Stream SDK, Docker, Vercel, Render*

---

## What to Highlight Based on the Role

| Role | What to Emphasize |
|---|---|
| **Backend SDE** | JWT auth from scratch, Socket.io sync architecture, MongoDB schema design, Vercel proxy solution, Docker |
| **Frontend SDE** | Monaco editor integration, Socket.io hooks, AuthContext, React Router deep-link preservation, real-time UI |
| **Full-Stack SDE** | End-to-end ownership — auth, real-time, deployment, debugging, production fixes |
| **System Design** | WebSocket room architecture, invite token security model, cross-domain cookie strategy |
