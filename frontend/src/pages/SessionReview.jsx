import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const ScoreBadge = ({ score }) => {
  const color =
    score >= 8 ? "text-green-400 border-green-500/30 bg-green-500/10" :
    score >= 5 ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" :
                 "text-red-400 border-red-500/30 bg-red-500/10";
  return (
    <div className={`text-5xl font-bold border-2 rounded-2xl w-24 h-24 flex flex-col items-center justify-center ${color}`}>
      {score}
      <span className="text-xs font-normal opacity-60 mt-1">/ 10</span>
    </div>
  );
};

const Section = ({ label, children, icon }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">{icon} {label}</p>
    {children}
  </div>
);

export default function SessionReview() {
  const { roomId } = useParams();
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [review,   setReview]   = useState(null);
  const [session,  setSession]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [fetched,  setFetched]  = useState(false); // did we already try loading?

  // Load session info
  useEffect(() => {
    api.get(`/api/sessions/${roomId}`)
      .then((res) => {
        const s = res.data.session;
        setSession(s);
        // If review already exists in DB, show it immediately
        if (s.aiReview) {
          setReview(s.aiReview);
          setFetched(true);
        }
      })
      .catch(() => navigate("/dashboard/student"));
  }, [roomId]);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post(`/api/sessions/${roomId}/review`);
      setReview(res.data.review);
      setFetched(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate review");
    } finally {
      setLoading(false);
    }
  };

  const dashboardPath = user?.role === "interviewer" ? "/dashboard/interviewer" : "/dashboard/student";

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(dashboardPath)} className="text-gray-400 hover:text-white text-sm transition">
          ← Dashboard
        </button>
        <span className="text-gray-700">|</span>
        <h1 className="text-lg font-bold">Interview<span className="text-blue-500">Hub</span></h1>
        <span className="text-sm text-gray-500">· AI Review</span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Session info */}
        {session && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{session.title}</h2>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
              <span className="font-mono text-gray-600">#{roomId}</span>
              {session.problem && (
                <>
                  <span>·</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    session.problem.difficulty === "easy"   ? "bg-green-500/10  text-green-400" :
                    session.problem.difficulty === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-red-500/10 text-red-400"
                  }`}>{session.problem.difficulty}</span>
                  <span>{session.problem.title}</span>
                </>
              )}
              <span>·</span>
              <span>{session.language}</span>
            </div>
          </div>
        )}

        {/* Not yet generated */}
        {!review && !fetched && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🤖</p>
            <p className="text-lg font-semibold mb-2">Get your AI Performance Review</p>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
              Gemini AI will analyze your code and give detailed feedback on correctness,
              complexity, quality, and what to improve.
            </p>
            <button
              id="generate-review-btn"
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition flex items-center gap-3 mx-auto"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Analyzing...</>
              ) : "✨ Generate AI Review"}
            </button>
            {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          </div>
        )}

        {/* Review loaded */}
        {review && (
          <div className="space-y-5">

            {/* Score header */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-6">
              <ScoreBadge score={review.score} />
              <div>
                <p className="text-lg font-semibold mb-1">Overall Score</p>
                <p className="text-gray-400 text-sm leading-relaxed max-w-lg">{review.summary}</p>
                {review.generatedAt && (
                  <p className="text-xs text-gray-600 mt-2">
                    Generated {new Date(review.generatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Correctness */}
            <Section label="Correctness" icon="✅">
              <p className="text-sm text-gray-300">{review.correctness}</p>
            </Section>

            {/* Complexity row */}
            <div className="grid grid-cols-2 gap-4">
              <Section label="Time Complexity" icon="⏱️">
                <p className="text-sm text-gray-300">{review.timeComplexity}</p>
              </Section>
              <Section label="Space Complexity" icon="💾">
                <p className="text-sm text-gray-300">{review.spaceComplexity}</p>
              </Section>
            </div>

            {/* Approach */}
            <Section label="Algorithmic Approach" icon="🧠">
              <p className="text-sm text-gray-300 leading-relaxed">{review.approach}</p>
            </Section>

            {/* Code Quality */}
            <Section label="Code Quality" icon="📝">
              <p className="text-sm text-gray-300 leading-relaxed">{review.codeQuality}</p>
            </Section>

            {/* Strengths + Improvements side by side */}
            <div className="grid grid-cols-2 gap-4">
              <Section label="Strengths" icon="💪">
                <ul className="space-y-2">
                  {review.strengths?.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-green-400 flex-shrink-0">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </Section>
              <Section label="Areas to Improve" icon="🎯">
                <ul className="space-y-2">
                  {review.improvements?.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-yellow-400 flex-shrink-0">→</span>{s}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>

            {/* Re-generate button */}
            <div className="flex justify-center pt-2">
              <button
                onClick={() => { setReview(null); setFetched(false); }}
                className="text-sm text-gray-500 hover:text-gray-300 transition"
              >
                ↺ Re-generate review
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
