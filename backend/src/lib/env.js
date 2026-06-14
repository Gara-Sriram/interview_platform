import dotenv from "dotenv";

dotenv.config({ quiet: true });

const optional = (key, fallback = undefined) => process.env[key] || fallback;

export const ENV = {
  PORT: optional("PORT", "3000"),
  DB_URL: process.env.DB_URL,
  NODE_ENV: optional("NODE_ENV", "development"),
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: optional("JWT_EXPIRES_IN", "7d"),
  INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
  INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET,
  PISTON_API_URL: optional("PISTON_API_URL", "http://localhost:2000/api/v2"),
};

const requiredKeys = ["DB_URL", "CLIENT_URL", "JWT_SECRET", "STREAM_API_KEY", "STREAM_API_SECRET"];

if (ENV.NODE_ENV === "production") {
  requiredKeys.push("INNGEST_SIGNING_KEY", "INNGEST_EVENT_KEY");
}

const missingKeys = requiredKeys.filter((key) => !ENV[key]);

if (missingKeys.length > 0) {
  throw new Error(`Missing required environment variables: ${missingKeys.join(", ")}`);
}

export const ALLOWED_ORIGINS = ENV.CLIENT_URL.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
