export function cleanString(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function isAllowedDifficulty(value) {
  return ["easy", "medium", "hard"].includes(value);
}
