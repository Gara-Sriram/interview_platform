import axiosInstance from "../lib/axios";

export const sessionApi = {
  createSession: async (data) => {
    const response = await axiosInstance.post("/sessions", data);
    return response.data;
  },

  getActiveSessions: async () => {
    const response = await axiosInstance.get("/sessions/active");
    return response.data;
  },

  getMyRecentSessions: async () => {
    const response = await axiosInstance.get("/sessions/my-recent");
    return response.data;
  },

  // Pass token as query param so the backend can verify access
  getSessionById: async (id, token) => {
    const params = token ? { token } : {};
    const response = await axiosInstance.get(`/sessions/${id}`, { params });
    return response.data;
  },

  // Pass invite token so the backend can validate the joiner
  joinSession: async ({ id, token }) => {
    const params = token ? { token } : {};
    const response = await axiosInstance.post(`/sessions/${id}/join`, {}, { params });
    return response.data;
  },

  endSession: async (id) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`);
    return response.data;
  },

  getStreamToken: async () => {
    const response = await axiosInstance.get(`/chat/token`);
    return response.data;
  },
};
