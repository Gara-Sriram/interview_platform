const { GoogleGenerativeAI } = require("@google/generative-ai");
const Session = require("../models/Session");

// ------------------------------------------------------------------
// Build the AI prompt from session data
// ------------------------------------------------------------------
const buildPrompt = (session) => {
  const hasProblem = !!session.problem?.title;

  const problemSection = hasProblem
    ? `
PROBLEM GIVEN:
Title: ${session.problem.title}
Difficulty: ${session.problem.difficulty}
Description:
${session.problem.description}
`
    : `
PROBLEM GIVEN: None — this was a free coding / open session.
`;

  return `
You are an expert technical interviewer reviewing a candidate's coding session.
Analyze the code below and return ONLY a valid JSON object (no markdown, no code fences).

${problemSection}

CANDIDATE'S CODE (${session.language}):
\`\`\`
${session.code || "// No code written"}
\`\`\`

Return this exact JSON structure:
{
  "score": <number 1-10>,
  "correctness": "<one sentence: does the code solve the problem?>",
  "timeComplexity": "<e.g. O(n²) — brief explanation>",
  "spaceComplexity": "<e.g. O(n) — brief explanation>",
  "codeQuality": "<one paragraph on readability, naming, structure>",
  "approach": "<one paragraph on the algorithmic approach chosen>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "summary": "<2-3 sentence overall summary for the candidate>"
}

Be honest, constructive, and specific. If no code was written, give score 0 and explain.
`.trim();
};

// ------------------------------------------------------------------
// @desc    Generate AI review for a session
// @route   POST /api/sessions/:roomId/review
// @access  Protected (student or interviewer)
// ------------------------------------------------------------------
const generateReview = async (req, res) => {
  try {
    const GEMINI_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_KEY || GEMINI_KEY === "your_gemini_api_key_here") {
      return res.status(503).json({
        success: false,
        message: "AI review not configured. Add GEMINI_API_KEY to backend .env — get a free key at aistudio.google.com",
      });
    }

    const session = await Session.findOne({ roomId: req.params.roomId });
    if (!session) {
      return res.status(404).json({ success: false, message: "Session not found" });
    }

    // Return cached review if already generated — no need to re-call AI
    if (session.aiReview) {
      return res.json({ success: true, review: session.aiReview, cached: true });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = buildPrompt(session);
    const result = await model.generateContent(prompt);
    const text   = result.response.text().trim();

    // Parse the JSON response from Gemini
    let review;
    try {
      // Strip markdown code fences if Gemini returns them anyway
      const cleaned = text.replace(/```json|```/g, "").trim();
      review = JSON.parse(cleaned);
    } catch {
      console.error("Gemini non-JSON response:", text);
      return res.status(500).json({ success: false, message: "AI returned an invalid response. Try again." });
    }

    // Validate required fields
    const required = ["score", "correctness", "timeComplexity", "spaceComplexity", "codeQuality", "approach", "strengths", "improvements", "summary"];
    for (const field of required) {
      if (!(field in review)) {
        return res.status(500).json({ success: false, message: "Incomplete AI response. Try again." });
      }
    }

    // Save to DB so we don't call AI again for the same session
    review.generatedAt = new Date();
    session.aiReview   = review;
    await session.save();

    res.json({ success: true, review, cached: false });
  } catch (err) {
    console.error("Review error:", err.message);
    res.status(500).json({ success: false, message: "Failed to generate review: " + err.message });
  }
};

module.exports = { generateReview };
