// Wandbox — free, no API key required
// Docs: https://wandbox.org/
// Completely free with no rate limits for reasonable usage

const WANDBOX_URL = "https://wandbox.org/api/compile.json";

// Map our language names to Wandbox compiler identifiers
const COMPILER_MAP = {
  javascript: "nodejs-20.17.0",
  python:     "cpython-3.12.7",
  java:       "openjdk-jdk-22+36",
  cpp:        "gcc-13.2.0",
  typescript: "typescript-5.6.2",
};

// ------------------------------------------------------------------
// @desc    Execute code via Wandbox (free, no API key)
// @route   POST /api/execute
// @access  Protected
// Body: { language, code, stdin? }
// ------------------------------------------------------------------
const executeCode = async (req, res) => {
  try {
    const { language, code, stdin = "" } = req.body;

    if (!language || !code) {
      return res.status(400).json({ success: false, message: "Language and code are required" });
    }

    const compiler = COMPILER_MAP[language];
    if (!compiler) {
      return res.status(400).json({ success: false, message: `Unsupported language: ${language}` });
    }

    const response = await fetch(WANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        compiler,
        code,
        stdin,
        "compiler-option-raw": language === "cpp" ? "-std=c++17" : "",
      }),
    });

    if (!response.ok) {
      throw new Error(`Wandbox error: ${response.status}`);
    }

    const data = await response.json();

    // Wandbox returns: program_output, program_error, compiler_error, status
    const stdout      = data.program_output   || "";
    const stderr      = data.program_error    || data.compiler_error || "";
    const exitCode    = parseInt(data.status) || 0;

    res.json({
      success:  true,
      output:   stdout,
      error:    stderr,
      exitCode,
    });
  } catch (err) {
    console.error("Execute error:", err.message);
    res.status(500).json({ success: false, message: "Code execution failed: " + err.message });
  }
};

module.exports = { executeCode };
