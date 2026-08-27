import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import socket from "../lib/socket";
import VideoCall from "../components/VideoCall";
import Chat from "../components/Chat";

const LANGUAGES = ["javascript", "python", "java", "cpp", "typescript"];

const STARTER_CODE = {
  javascript: "// Write your solution here\nfunction solution() {\n  \n}\n",
  python:     "# Write your solution here\ndef solution():\n    pass\n",
  java:       "// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}\n",
  cpp:        "// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n",
  typescript: "// Write your solution here\nfunction solution(): void {\n  \n}\n",
};

export default function SessionPage() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [outputError, setOutputError] = useState(false);
  const [running, setRunning] = useState(false);
  const [peers, setPeers] = useState([]);
  const [activeTab, setActiveTab] = useState("video"); // "video" | "chat"

  const isInterviewer = user?.role === "interviewer";

  // Debounce timer ref — so we don't emit on every keystroke
  const debounceRef = useRef(null);

  // ------------------------------------------------------------------
  // Load session data from API
  // ------------------------------------------------------------------
  useEffect(() => {
    api.get(`/api/sessions/${roomId}`)
      .then((res) => {
        const s = res.data.session;
        setSession(s);
        setLanguage(s.language || "javascript");
      })
      .catch(() => navigate("/dashboard/" + (user?.role === "interviewer" ? "interviewer" : "student")))
      .finally(() => setLoading(false));
  }, [roomId]);

  // ------------------------------------------------------------------
  // Socket.IO — connect and join room
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!user) return;

    socket.connect();
    socket.emit("join-room", { roomId, userName: user.name });

    // Server sends current code+language to the newly joined user
    socket.on("session-state", ({ code: c, language: l }) => {
      setCode(c);
      setLanguage(l);
    });

    // Someone else changed the code
    socket.on("code-update", ({ code: c }) => setCode(c));

    // Someone changed the language
    socket.on("language-update", ({ language: l }) => {
      setLanguage(l);
      setCode(STARTER_CODE[l]);
    });

    // Presence events
    socket.on("user-joined", ({ userName }) => {
      setPeers((prev) => [...prev.filter((p) => p !== userName), userName]);
    });
    socket.on("user-left", ({ userName }) => {
      setPeers((prev) => prev.filter((p) => p !== userName));
    });

    return () => {
      socket.off("session-state");
      socket.off("code-update");
      socket.off("language-update");
      socket.off("user-joined");
      socket.off("user-left");
      socket.disconnect();
    };
  }, [user, roomId]);

  // ------------------------------------------------------------------
  // Handle editor changes — debounce 400ms before emitting
  // ------------------------------------------------------------------
  const handleCodeChange = useCallback((value) => {
    setCode(value);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      socket.emit("code-change", { roomId, code: value });
    }, 400);
  }, [roomId]);

  // ------------------------------------------------------------------
  // Handle language change
  // ------------------------------------------------------------------
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(STARTER_CODE[lang]);
    socket.emit("language-change", { roomId, language: lang });
  };

  // ------------------------------------------------------------------
  // Run code via Piston API (through our backend proxy)
  // ------------------------------------------------------------------
  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    setOutputError(false);
    try {
      const res = await api.post("/api/execute", { language, code });
      const { output: out, error: err, exitCode } = res.data;
      setOutputError(exitCode !== 0 || !!err);
      setOutput(err || out || "(no output)");
    } catch (err) {
      setOutputError(true);
      setOutput(err.response?.data?.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  // ------------------------------------------------------------------
  // End session (interviewer only)
  // ------------------------------------------------------------------
  const handleEndSession = async () => {
    if (!confirm("End this session?")) return;
    await api.patch(`/api/sessions/${roomId}/end`);
    navigate("/dashboard/interviewer");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* ── Navbar ── */}
      <nav className="border-b border-gray-800 px-4 py-3 flex items-center gap-4 flex-shrink-0">
        <h1 className="text-lg font-bold">Interview<span className="text-blue-500">Hub</span></h1>
        <span className="text-gray-500">|</span>
        <span className="text-sm text-gray-300 font-medium">{session?.title}</span>
        <span className="text-xs font-mono text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
          #{roomId}
        </span>

        {/* Presence indicators */}
        <div className="flex items-center gap-1 ml-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">{user?.name} (you)</span>
        </div>
        {peers.map((p) => (
          <div key={p} className="flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-xs text-gray-400">{p}</span>
          </div>
        ))}

        <div className="ml-auto flex items-center gap-3">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-sm text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 transition"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Run button */}
          <button
            id="run-btn"
            onClick={handleRun}
            disabled={running}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition flex items-center gap-2"
          >
            {running ? (
              <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Running...</>
            ) : (
              "▶ Run"
            )}
          </button>

          {/* End session — interviewer only */}
          {isInterviewer && (
            <button
              id="end-session-btn"
              onClick={handleEndSession}
              className="text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-lg transition"
            >
              End Session
            </button>
          )}

          {!isInterviewer && (
            <button
              onClick={() => navigate("/dashboard/student")}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Leave
            </button>
          )}
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left: Problem Panel ── */}
        <div className="w-72 flex-shrink-0 border-r border-gray-800 overflow-y-auto p-4">
          {session?.problem ? (
            <div className="space-y-4">
              <div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  session.problem.difficulty === "easy"   ? "bg-green-500/10 text-green-400" :
                  session.problem.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                  "bg-red-500/10 text-red-400"
                }`}>
                  {session.problem.difficulty}
                </span>
                <h2 className="text-base font-semibold mt-2">{session.problem.title}</h2>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                {session.problem.description}
              </p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-600 gap-3">
              <span className="text-4xl">💻</span>
              <p className="text-sm">No problem attached.</p>
              <p className="text-xs">Use the editor to collaborate freely.</p>
            </div>
          )}
        </div>

        {/* ── Center: Editor + Output ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                wordWrap: "on",
                padding: { top: 12 },
                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                fontLigatures: true,
              }}
            />
          </div>

          {/* Output Panel */}
          <div className="h-40 flex-shrink-0 border-t border-gray-800 bg-gray-900">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Output</span>
              {output && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  outputError ? "bg-red-500/10 text-red-400" : "bg-green-500/10 text-green-400"
                }`}>
                  {outputError ? "Error" : "Success"}
                </span>
              )}
            </div>
            <pre className="px-4 py-2 text-sm font-mono overflow-auto h-[calc(100%-33px)] text-gray-300 whitespace-pre-wrap">
              {running
                ? <span className="text-gray-500 animate-pulse">Running...</span>
                : output || <span className="text-gray-600">Click ▶ Run to execute your code</span>
              }
            </pre>
          </div>
        </div>

        {/* ── Right: Video + Chat Panel ── */}
        <div className="w-60 flex-shrink-0 border-l border-gray-800 flex flex-col">

          {/* Tab switcher */}
          <div className="flex border-b border-gray-800 flex-shrink-0">
            {["video", "chat"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 text-xs font-medium capitalize transition ${
                  activeTab === tab
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "video" ? "📹 Video" : "💬 Chat"}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden p-3">
            {activeTab === "video" ? (
              <VideoCall roomId={roomId} />
            ) : (
              <Chat roomId={roomId} currentUser={user?.name} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
