import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../lib/api";

const LANGS = ["javascript", "python", "java", "cpp", "typescript"];

const DEFAULT_STARTER = {
  javascript: "// Write your solution here\n",
  python:     "# Write your solution here\n",
  java:       "// Write your solution here\npublic class Solution {\n    \n}\n",
  cpp:        "#include <bits/stdc++.h>\nusing namespace std;\n\n// Write your solution here\n",
  typescript: "// Write your solution here\n",
};

const emptyForm = () => ({
  title:       "",
  difficulty:  "easy",
  tags:        "",
  description: "",
  examples:    [{ input: "", output: "", explanation: "" }],
  constraints: [""],
  testCases:   [{ input: "", expected: "" }],
  starterCode: { ...DEFAULT_STARTER },
});

export default function AdminProblemForm() {
  const { id }   = useParams();   // if id exists → edit mode
  const navigate = useNavigate();
  const isEdit   = !!id;

  const [form,    setForm]    = useState(emptyForm());
  const [lang,    setLang]    = useState("javascript");
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [error,   setError]   = useState("");

  // Load existing problem in edit mode
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/problems/${id}`)
      .then((res) => {
        const p = res.data.problem;
        setForm({
          title:       p.title,
          difficulty:  p.difficulty,
          tags:        p.tags?.join(", ") || "",
          description: p.description,
          examples:    p.examples?.length    ? p.examples    : [{ input: "", output: "", explanation: "" }],
          constraints: p.constraints?.length ? p.constraints : [""],
          testCases:   p.testCases?.length   ? p.testCases   : [{ input: "", expected: "" }],
          starterCode: { ...DEFAULT_STARTER, ...p.starterCode },
        });
      })
      .catch(() => navigate("/dashboard/admin"))
      .finally(() => setLoading(false));
  }, [id]);

  // Generic field setter
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  // Array helpers
  const addRow    = (field, empty) => setForm((f) => ({ ...f, [field]: [...f[field], empty] }));
  const removeRow = (field, i) => setForm((f) => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));
  const setRow    = (field, i, patch) => setForm((f) => ({
    ...f,
    [field]: f[field].map((row, idx) => idx === i ? { ...row, ...patch } : row),
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        ...form,
        tags:        form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        constraints: form.constraints.filter(Boolean),
        testCases:   form.testCases.filter((tc) => tc.input && tc.expected),
        examples:    form.examples.filter((ex) => ex.input && ex.output),
      };

      if (isEdit) {
        await api.put(`/api/problems/${id}`, payload);
      } else {
        await api.post("/api/problems", payload);
      }
      navigate("/dashboard/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save problem");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard/admin")} className="text-gray-400 hover:text-white text-sm transition">
          ← Admin Dashboard
        </button>
        <span className="text-gray-700">|</span>
        <h1 className="text-lg font-bold">Interview<span className="text-blue-500">Hub</span></h1>
        <span className="text-sm text-gray-500">· {isEdit ? "Edit Problem" : "New Problem"}</span>
      </nav>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* ── Basic Info ── */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2">Basic Info</h2>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Title *</label>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Two Sum"
              required
              className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Difficulty *</label>
              <select
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">Tags <span className="text-gray-600">(comma-separated)</span></label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="array, hash-map, two-pointer"
                className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>
        </section>

        {/* ── Description ── */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2">Description *</h2>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            rows={6}
            placeholder="Describe the problem clearly. Markdown supported."
            required
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition resize-y font-mono"
          />
        </section>

        {/* ── Examples ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h2 className="text-lg font-semibold">Examples</h2>
            <button type="button" onClick={() => addRow("examples", { input: "", output: "", explanation: "" })}
              className="text-xs text-blue-400 hover:text-blue-300 transition">+ Add Example</button>
          </div>
          {form.examples.map((ex, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 font-medium">Example {i + 1}</span>
                {form.examples.length > 1 && (
                  <button type="button" onClick={() => removeRow("examples", i)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Input</label>
                  <input value={ex.input} onChange={(e) => setRow("examples", i, { input: e.target.value })}
                    placeholder='nums = [2,7,11], target = 9'
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition font-mono" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Output</label>
                  <input value={ex.output} onChange={(e) => setRow("examples", i, { output: e.target.value })}
                    placeholder="[0,1]"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition font-mono" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Explanation <span className="text-gray-700">(optional)</span></label>
                <input value={ex.explanation} onChange={(e) => setRow("examples", i, { explanation: e.target.value })}
                  placeholder="Because nums[0] + nums[1] = 9"
                  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition" />
              </div>
            </div>
          ))}
        </section>

        {/* ── Constraints ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h2 className="text-lg font-semibold">Constraints</h2>
            <button type="button" onClick={() => addRow("constraints", "")}
              className="text-xs text-blue-400 hover:text-blue-300 transition">+ Add</button>
          </div>
          {form.constraints.map((c, i) => (
            <div key={i} className="flex gap-2">
              <input value={c} onChange={(e) => setForm((f) => ({ ...f, constraints: f.constraints.map((v, idx) => idx === i ? e.target.value : v) }))}
                placeholder="2 ≤ nums.length ≤ 10⁴"
                className="flex-1 bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition" />
              {form.constraints.length > 1 && (
                <button type="button" onClick={() => removeRow("constraints", i)} className="text-red-400 hover:text-red-300 text-sm px-2">✕</button>
              )}
            </div>
          ))}
        </section>

        {/* ── Test Cases ── */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <h2 className="text-lg font-semibold">Test Cases</h2>
            <button type="button" onClick={() => addRow("testCases", { input: "", expected: "" })}
              className="text-xs text-blue-400 hover:text-blue-300 transition">+ Add Test Case</button>
          </div>
          {form.testCases.map((tc, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="flex-1 grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Input</label>
                  <textarea value={tc.input} onChange={(e) => setRow("testCases", i, { input: e.target.value })}
                    rows={2} placeholder="[2,7,11,15]&#10;9"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition font-mono resize-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Expected Output</label>
                  <textarea value={tc.expected} onChange={(e) => setRow("testCases", i, { expected: e.target.value })}
                    rows={2} placeholder="[0,1]"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs placeholder-gray-600 focus:outline-none focus:border-blue-500 transition font-mono resize-none" />
                </div>
              </div>
              {form.testCases.length > 1 && (
                <button type="button" onClick={() => removeRow("testCases", i)} className="text-red-400 hover:text-red-300 text-sm mt-6 px-1">✕</button>
              )}
            </div>
          ))}
        </section>

        {/* ── Starter Code ── */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2">Starter Code</h2>
          <div className="flex gap-2 flex-wrap">
            {LANGS.map((l) => (
              <button key={l} type="button" onClick={() => setLang(l)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition capitalize ${lang === l ? "border-blue-500 text-blue-400 bg-blue-500/10" : "border-gray-700 text-gray-400 hover:border-gray-500"}`}>
                {l}
              </button>
            ))}
          </div>
          <textarea
            value={form.starterCode[lang]}
            onChange={(e) => setForm((f) => ({ ...f, starterCode: { ...f.starterCode, [lang]: e.target.value } }))}
            rows={8}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition resize-y"
          />
        </section>

        {/* ── Submit ── */}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex gap-3 pb-10">
          <button type="button" onClick={() => navigate("/dashboard/admin")}
            className="flex-1 border border-gray-700 text-gray-300 hover:border-gray-500 py-3 rounded-xl text-sm transition">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition">
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Problem"}
          </button>
        </div>
      </form>
    </div>
  );
}
