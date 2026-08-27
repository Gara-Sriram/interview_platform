import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomInput, setRoomInput] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  // Load past sessions student participated in
  useEffect(() => {
    api.get("/api/sessions")
      .then((res) => setSessions(res.data.sessions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    setJoinError("");

    // Extract roomId from a full URL or plain roomId
    const input = roomInput.trim();
    const roomId = input.includes("/session/")
      ? input.split("/session/")[1].split("?")[0]
      : input;

    if (!roomId) return setJoinError("Please enter a room ID or session link");

    setJoining(true);
    try {
      // Verify the session exists before navigating
      await api.get(`/api/sessions/${roomId}`);
      navigate(`/session/${roomId}`);
    } catch (err) {
      setJoinError(err.response?.data?.message || "Session not found");
      setJoining(false);
    }
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
          <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">

        {/* Join Session */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Join a Session</h2>
          <p className="text-sm text-gray-400 mb-4">Paste the session link or enter the room ID</p>
          <form onSubmit={handleJoin} className="flex gap-3">
            <input
              id="room-input"
              value={roomInput}
              onChange={(e) => setRoomInput(e.target.value)}
              placeholder="e.g. a3f9b2c1  or  http://localhost:5173/session/a3f9b2c1"
              className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
            <button
              id="join-btn"
              type="submit"
              disabled={joining}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition whitespace-nowrap"
            >
              {joining ? "Joining..." : "Join Session"}
            </button>
          </form>
          {joinError && <p className="text-red-400 text-sm mt-2">{joinError}</p>}
        </div>

        {/* Practice Sheet */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Practice Problems</h2>
              <p className="text-sm text-gray-400 mt-1">10 curated DSA problems — Easy, Medium, Hard</p>
              <div className="flex gap-2 mt-3">
                <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">3 Easy</span>
                <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">4 Medium</span>
                <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">3 Hard</span>
              </div>
            </div>
            <button
              id="practice-btn"
              onClick={() => navigate("/practice")}
              className="border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium px-5 py-2.5 rounded-lg text-sm transition"
            >
              Start Practicing →
            </button>
          </div>
        </div>

        {/* Past Sessions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Past Sessions</h2>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-3xl mb-2">📋</p>
              <p>No sessions yet. Join one above!</p>
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
                      <span className="text-xs text-gray-500">
                        by {session.interviewer?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.status === "active" && (
                      <button
                        onClick={() => navigate(`/session/${session.roomId}`)}
                        className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition"
                      >
                        Rejoin
                      </button>
                    )}
                    {session.status === "ended" && (
                      <button
                        onClick={() => navigate(`/review/${session.roomId}`)}
                        className="text-xs px-3 py-1.5 border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 rounded-lg transition flex items-center gap-1.5"
                      >
                        ✨ AI Review
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
