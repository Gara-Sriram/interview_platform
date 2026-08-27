import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import { PROBLEMS } from "../data/problems";

export default function InterviewerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedProblem, setSelectedProblem] = useState(null); // problem id or null
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(null);

  // Load past sessions on mount
  useEffect(() => {
    api.get("/api/sessions")
      .then((res) => setSessions(res.data.sessions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const problem = selectedProblem
        ? { problemId: selectedProblem.id, title: selectedProblem.title, difficulty: selectedProblem.difficulty, description: selectedProblem.description }
        : null;

      const res = await api.post("/api/sessions", {
        title: title || "Interview Session",
        problem,
      });
      const newSession = res.data.session;
      setSessions((prev) => [newSession, ...prev]);
      setShowModal(false);
      setTitle("");
      setSelectedProblem(null);
      navigate(`/session/${newSession.roomId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  const copyLink = (roomId) => {
    navigator.clipboard.writeText(`${window.location.origin}/session/${roomId}`);
    setCopied(roomId);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Interview<span className="text-blue-500">Hub</span></h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">👋 {user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Your Sessions</h2>
            <p className="text-gray-400 text-sm mt-1">Create and manage interview sessions</p>
          </div>
          <button
            id="create-session-btn"
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition"
          >
            + New Session
          </button>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-3">🎙️</p>
            <p>No sessions yet. Create your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session._id}
                className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between hover:border-gray-700 transition"
              >
                <div>
                  <p className="font-medium">{session.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      session.status === "active"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {session.status}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-600 font-mono">#{session.roomId}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyLink(session.roomId)}
                    className="text-xs px-3 py-1.5 border border-gray-700 hover:border-gray-500 rounded-lg text-gray-300 transition"
                  >
                    {copied === session.roomId ? "✓ Copied!" : "Copy Link"}
                  </button>
                  {session.status === "active" && (
                    <button
                      onClick={() => navigate(`/session/${session.roomId}`)}
                      className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition"
                    >
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Create New Session</h3>
            <form onSubmit={handleCreate} className="space-y-4">

              {/* Title */}
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Session Title</label>
                <input
                  id="session-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Frontend Interview - Round 1"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                />
              </div>

              {/* Problem Picker */}
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Attach a Problem <span className="text-gray-600">(optional)</span></label>
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {/* No problem option */}
                  <div
                    onClick={() => setSelectedProblem(null)}
                    className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition border ${
                      !selectedProblem
                        ? "border-blue-500 bg-blue-500/10 text-blue-300"
                        : "border-gray-700 hover:border-gray-600 text-gray-400"
                    }`}
                  >
                    None — free coding session
                  </div>
                  {PROBLEMS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedProblem(p)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition border ${
                        selectedProblem?.id === p.id
                          ? "border-blue-500 bg-blue-500/10 text-white"
                          : "border-gray-700 hover:border-gray-600 text-gray-300"
                      }`}
                    >
                      <span>{p.id}. {p.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        p.difficulty === "easy"   ? "bg-green-500/10  text-green-400" :
                        p.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                        "bg-red-500/10 text-red-400"
                      }`}>
                        {p.difficulty}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setSelectedProblem(null); }}
                  className="flex-1 border border-gray-700 text-gray-300 hover:border-gray-500 py-2.5 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  id="confirm-create-btn"
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg text-sm transition"
                >
                  {creating ? "Creating..." : "Create & Join"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
