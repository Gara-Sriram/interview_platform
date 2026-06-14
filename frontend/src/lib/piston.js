import axiosInstance from "./axios";

/**
 * @param {string} language - programming language
 * @param {string} code - source code to executed
 * @returns {Promise<{success:boolean, output?:string, error?: string}>}
 */
export async function executeCode(language, code) {
  try {
    const response = await axiosInstance.post("/code/execute", { language, code });
    return response.data;
  } catch (error) {
    const details = error.response?.data?.details;
    const detailMessage = details?.error || (details ? JSON.stringify(details) : "");

    return {
      success: false,
      error: [error.response?.data?.message || error.message || "Failed to execute code", detailMessage]
        .filter(Boolean)
        .join(": "),
    };
  }
}
