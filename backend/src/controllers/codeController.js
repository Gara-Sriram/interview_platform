import { ENV } from "../lib/env.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString } from "../utils/validation.js";

const LANGUAGE_CONFIG = {
  javascript: {
    preferredVersion: "18.15.0",
    aliases: ["javascript", "node", "nodejs"],
    extension: "js",
  },
  python: {
    preferredVersion: "3.10.0",
    aliases: ["python", "python3"],
    extension: "py",
  },
  java: {
    preferredVersion: "15.0.2",
    aliases: ["java"],
    extension: "java",
  },
};

const MAX_CODE_LENGTH = 50_000;
const RUNTIMES_CACHE_TTL_MS = 30_000;
let runtimesCache = { data: null, expiresAt: 0 };

const formatEngineError = (data) => {
  if (typeof data === "string") return data;
  if (!data || typeof data !== "object") return "Unknown execution engine error";

  return data.message || data.error || data.detail || JSON.stringify(data);
};

const fetchInstalledRuntimes = async () => {
  if (runtimesCache.data && runtimesCache.expiresAt > Date.now()) {
    return runtimesCache.data;
  }

  const response = await fetch(`${ENV.PISTON_API_URL}/runtimes`, {
    signal: AbortSignal.timeout(10_000),
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : [];
  } catch {
    throw new ApiError(502, "Execution engine returned an invalid runtimes response");
  }

  if (!response.ok) {
    throw new ApiError(502, "Execution engine runtimes request failed", {
      status: response.status,
      error: formatEngineError(data),
    });
  }

  runtimesCache = {
    data,
    expiresAt: data.length > 0 ? Date.now() + RUNTIMES_CACHE_TTL_MS : 0,
  };
  return data;
};

const runtimeMatchesLanguage = (runtime, aliases) => {
  const names = [runtime.language, ...(runtime.aliases || [])]
    .filter(Boolean)
    .map((value) => value.toLowerCase());

  return aliases.some((alias) => names.includes(alias));
};

const resolveRuntime = async (requestedLanguage, config) => {
  const runtimes = await fetchInstalledRuntimes();
  const candidates = runtimes.filter((runtime) => runtimeMatchesLanguage(runtime, config.aliases));

  if (candidates.length === 0) {
    throw new ApiError(503, `${requestedLanguage} runtime is not installed in the execution engine`, {
      installed: runtimes.map((runtime) => `${runtime.language}-${runtime.version}`),
    });
  }

  return candidates.find((runtime) => runtime.version === config.preferredVersion) || candidates[0];
};

export const executeCode = asyncHandler(async (req, res) => {
  const requestedLanguage = cleanString(req.body?.language, 30).toLowerCase();
  const code = typeof req.body?.code === "string" ? req.body.code : "";
  const config = LANGUAGE_CONFIG[requestedLanguage];

  if (!config) {
    throw new ApiError(400, `Unsupported language: ${requestedLanguage || "unknown"}`);
  }

  if (!code.trim()) {
    throw new ApiError(400, "Code is required");
  }

  if (code.length > MAX_CODE_LENGTH) {
    throw new ApiError(413, `Code exceeds ${MAX_CODE_LENGTH} characters`);
  }

  const runtime = await resolveRuntime(requestedLanguage, config);

  const response = await fetch(`${ENV.PISTON_API_URL}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15_000),
    body: JSON.stringify({
      language: runtime.language,
      version: runtime.version,
      files: [
        {
          name: `main.${config.extension}`,
          content: code,
        },
      ],
    }),
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError(502, "Execution engine returned an invalid response");
  }

  if (!response.ok) {
    throw new ApiError(502, "Execution engine request failed", {
      status: response.status,
      error: formatEngineError(data),
    });
  }

  const output = data.run?.output || "";
  const stderr = data.run?.stderr || "";
  const signal = data.run?.signal || "";

  if (stderr || signal) {
    return res.status(200).json({
      success: false,
      output,
      error: stderr || `Execution stopped with signal ${signal}`,
    });
  }

  res.status(200).json({
    success: true,
    output: output || "No output",
  });
});

export const getCodeRuntimes = asyncHandler(async (_req, res) => {
  res.status(200).json({ runtimes: await fetchInstalledRuntimes() });
});
