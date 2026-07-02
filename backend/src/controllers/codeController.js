import { exec } from "child_process";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanString } from "../utils/validation.js";

const LANGUAGE_CONFIG = {
  javascript: {
    image: "node:22-alpine",
    execCmd: 'sh -c "echo \'$CODE_BASE64\' | base64 -d | node"',
    memory: "128m",
    timeout: 5,
  },
  python: {
    image: "python:3.10-alpine",
    execCmd: 'sh -c "echo \'$CODE_BASE64\' | base64 -d | python3"',
    memory: "128m",
    timeout: 5,
  },
  java: {
    image: "eclipse-temurin:17-alpine",
    execCmd: 'sh -c "cd /tmp && echo \'$CODE_BASE64\' | base64 -d > Main.java && javac Main.java && java Main"',
    memory: "256m",
    timeout: 5,
  },
  cpp: {
    image: "frolvlad/alpine-gxx:latest",
    execCmd: 'sh -c "cd /tmp && echo \'$CODE_BASE64\' | base64 -d > main.cpp && g++ -O2 -o main main.cpp && ./main"',
    memory: "128m",
    timeout: 5,
  },
};

const MAX_CODE_LENGTH = 50_000;

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

  // Base64 encode code for command injection security
  const codeBase64 = Buffer.from(code).toString("base64");

  // Safely interpolate base64 code string
  const commandToRun = config.execCmd.replace("$CODE_BASE64", codeBase64);

  // Construct docker run command with resource constraints
  // - --rm: automatically remove container on exit
  // - --network none: disable internet access inside sandbox
  // - --memory: limit memory footprint (e.g. 128MB)
  // - --cpus 0.5: cap CPU time to 50% of single core
  // - --user 1000:1000: execute as unprivileged non-root user
  const dockerCmd = `timeout ${config.timeout}s docker run --rm --network none --memory ${config.memory} --cpus 0.5 --user 1000:1000 -i ${config.image} ${commandToRun}`;

  exec(dockerCmd, { timeout: (config.timeout + 2) * 1000 }, (error, stdout, stderr) => {
    // Check if timeout was triggered (exit code 124 from timeout command)
    if (error && (error.code === 124 || error.signal === "SIGTERM" || error.killed)) {
      return res.status(200).json({
        success: false,
        output: stdout || "",
        error: `Execution timed out (limit: ${config.timeout}s)`,
      });
    }

    // Log unexpected errors (e.g. Docker daemon connection errors)
    if (error && error.code !== 0 && error.code !== 124) {
      console.error(`[Execution Engine Error] Exit Code: ${error.code}. Msg: ${error.message}`);
    }

    const output = stdout || "";
    const errorOutput = stderr || "";

    if (errorOutput) {
      return res.status(200).json({
        success: false,
        output,
        error: errorOutput,
      });
    }

    res.status(200).json({
      success: true,
      output: output || "No output",
    });
  });
});

export const getCodeRuntimes = asyncHandler(async (_req, res) => {
  res.status(200).json({
    runtimes: Object.keys(LANGUAGE_CONFIG).map((lang) => ({
      language: lang,
      version: LANGUAGE_CONFIG[lang].image,
    })),
  });
});
