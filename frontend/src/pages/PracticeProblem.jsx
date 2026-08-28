import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import api from "../lib/api";

const LANGUAGES = ["javascript", "python", "java", "cpp", "typescript"];

const DIFF_STYLE = {
  easy:   "bg-green-500/10  text-green-400  border border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  hard:   "bg-red-500/10    text-red-400    border border-red-500/20",
};

export default function PracticeProblem() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [problem,     setProblem]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [language,    setLanguage]    = useState("javascript");
  const [code,        setCode]        = useState("");
  const [output,      setOutput]      = useState("");
  const [outputError, setOutputError] = useState(false);
  const [running,     setRunning]     = useState(false);

  // Fetch problem from API
  useEffect(() => {
    api.get(`/api/problems/${id}`)
      .then((res) => {
        const p = res.data.problem;
        setProblem(p);
        setCode(p.starterCode?.javascript || "// Write your solution here\n");
      })
      .catch(() => {
        alert("Problem not found.");
        navigate("/practice");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(problem?.starterCode?.[lang] || "// Write your solution here\n");
    setOutput("");
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    setOutputError(false);
    try {
      const res = await api.post("/api/execute", { language, code });
      setOutputError(res.data.exitCode !== 0 || !!res.data.error);
      setOutput(res.data.error || res.data.output || "(no output)");
    } catch (err) {
      setOutputError(true);
      setOutput(err.response?.data?.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!problem) return null;

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <button
          onClick={() => navigate("/practice")}
          className="text-gray-400 hover:text-white text-sm transition"
        >
          ← Problems
        </button>
        <span className="text-gray-700">|</span>
        <span className="text-sm font-medium">{problem.title}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${DIFF_STYLE[problem.difficulty]}`}>
          {problem.difficulty}
        </span>

        <div className="ml-auto flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-sm text-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500 transition"
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          <button
            id="run-btn"
            onClick={handleRun}
            disabled={running}
            className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition flex items-center gap-2"
          >
            {running ? (
              <><span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" /> Running...</>
            ) : "▶ Run"}
          </button>
        </div>
      </nav>

      {/* Main split */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: Problem Description */}
        <div className="w-96 flex-shrink-0 border-r border-gray-800 overflow-y-auto p-5 space-y-5">

          <div>
            <h2 className="text-lg font-semibold">{problem.title}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {(problem.tags || []).map((t) => (
                <span key={t} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{t}</span>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
            {problem.description}
          </p>

          {/* Examples */}
          {(problem.examples || []).length > 0 && (
            <div className="space-y-3">
              {problem.examples.map((ex, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg p-3 text-sm">
                  <p className="text-gray-500 text-xs mb-1">Example {i + 1}</p>
                  <p><span className="text-gray-400">Input:</span> <code className="text-gray-200">{ex.input}</code></p>
                  <p><span className="text-gray-400">Output:</span> <code className="text-green-400">{ex.output}</code></p>
                  {ex.explanation && (
                    <p className="text-gray-500 text-xs mt-1">
                      <span className="text-gray-500">Explanation:</span> {ex.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Constraints */}
          {(problem.constraints || []).length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Constraints</p>
              <ul className="space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="text-xs text-gray-400 flex gap-2">
                    <span className="text-gray-600">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right: Editor + Output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={(val) => setCode(val)}
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

          <div className="h-44 flex-shrink-0 border-t border-gray-800 bg-gray-900">
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
            <pre className="px-4 py-3 text-sm font-mono overflow-auto h-[calc(100%-33px)] text-gray-300 whitespace-pre-wrap">
              {running
                ? <span className="text-gray-500 animate-pulse">Running...</span>
                : output || <span className="text-gray-600">Click ▶ Run to test your code</span>
              }
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
