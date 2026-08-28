import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";

const DIFF_COLORS = {
  easy:   "bg-green-500/10  text-green-400  border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard:   "bg-red-500/10    text-red-400    border-red-500/20",
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.get("/api/problems")
      .then((res) => setProblems(res.data.problems))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await api.delete(`/api/problems/${id}`);
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete problem");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold">Interview<span className="text-blue-500">Hub</span></h1>
          <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">Admin</span>
        </div>
        <button
          onClick={async () => { await logout(); navigate("/login"); }}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          Logout
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Problem Bank</h2>
            <p className="text-gray-400 text-sm mt-1">{problems.length} problems in database</p>
          </div>
          <button
            id="add-problem-btn"
            onClick={() => navigate("/admin/problems/new")}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition flex items-center gap-2"
          >
            ➕ Add Problem
          </button>
        </div>

        {/* Problems Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-4xl mb-3">📝</p>
            <p>No problems yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs text-gray-500 uppercase tracking-wider">
              <span className="col-span-6">Title</span>
              <span className="col-span-2">Difficulty</span>
              <span className="col-span-2">Tags</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>

            {problems.map((p, i) => (
              <div
                key={p._id}
                className="grid grid-cols-12 gap-4 items-center bg-gray-900 border border-gray-800 rounded-xl px-4 py-3.5 hover:border-gray-700 transition"
              >
                {/* # + Title */}
                <div className="col-span-6 flex items-center gap-3">
                  <span className="text-gray-600 text-sm w-6">{i + 1}</span>
                  <span className="font-medium text-sm">{p.title}</span>
                </div>

                {/* Difficulty */}
                <div className="col-span-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${DIFF_COLORS[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </div>

                {/* Tags */}
                <div className="col-span-2 flex gap-1 flex-wrap">
                  {p.tags?.slice(0, 2).map((t) => (
                    <span key={t} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/admin/problems/${p._id}/edit`)}
                    className="text-xs px-3 py-1.5 border border-gray-700 hover:border-blue-500 hover:text-blue-400 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    disabled={deleting === p._id}
                    className="text-xs px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg transition disabled:opacity-50"
                  >
                    {deleting === p._id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
