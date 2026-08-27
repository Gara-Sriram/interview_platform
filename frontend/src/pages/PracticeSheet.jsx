import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PROBLEMS } from "../data/problems";

const DIFF_STYLE = {
  easy:   "bg-green-500/10  text-green-400  border border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  hard:   "bg-red-500/10    text-red-400    border border-red-500/20",
};

export default function PracticeSheet() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // all | easy | medium | hard

  const filtered = filter === "all"
    ? PROBLEMS
    : PROBLEMS.filter((p) => p.difficulty === filter);

  const counts = {
    easy:   PROBLEMS.filter((p) => p.difficulty === "easy").length,
    medium: PROBLEMS.filter((p) => p.difficulty === "medium").length,
    hard:   PROBLEMS.filter((p) => p.difficulty === "hard").length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold cursor-pointer" onClick={() => navigate("/dashboard/student")}>
            Interview<span className="text-blue-500">Hub</span>
          </h1>
          <span className="text-gray-700">|</span>
          <span className="text-sm text-gray-400">Practice Problems</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">👋 {user?.name}</span>
          <button
            onClick={async () => { await logout(); navigate("/login"); }}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Header + Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">DSA Practice Sheet</h2>
          <p className="text-gray-400 text-sm">10 curated problems to sharpen your interview skills</p>

          <div className="flex gap-3 mt-4">
            {["all", "easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${
                  filter === d
                    ? d === "all"    ? "bg-gray-700 border-gray-600 text-white"
                    : d === "easy"   ? "bg-green-500/20  border-green-500/40  text-green-400"
                    : d === "medium" ? "bg-yellow-500/20 border-yellow-500/40 text-yellow-400"
                    :                  "bg-red-500/20    border-red-500/40    text-red-400"
                    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500"
                }`}
              >
                {d === "all"
                  ? `All (${PROBLEMS.length})`
                  : `${d.charAt(0).toUpperCase() + d.slice(1)} (${counts[d]})`}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        <div className="space-y-2">
          {filtered.map((problem) => (
            <div
              key={problem.id}
              onClick={() => navigate(`/practice/${problem.id}`)}
              className="bg-gray-900 border border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-gray-600 hover:bg-gray-900/80 transition group"
            >
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm font-mono w-6">{problem.id}.</span>
                <div>
                  <p className="font-medium group-hover:text-blue-400 transition">{problem.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {problem.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full capitalize font-medium ${DIFF_STYLE[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
