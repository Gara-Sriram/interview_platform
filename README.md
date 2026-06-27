

> Talent IQ is a production-deployed, full-stack technical interview platform that replicates the experience of platforms like CoderPad and HackerRank Interview. It enables interviewers and candidates to conduct complete coding interviews in a single, unified interface — with real-time collaborative code editing, live video/audio, in-session chat, and instant multi-language code execution.



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
