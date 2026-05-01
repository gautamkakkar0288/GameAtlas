import api from "./api";

export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  signup: (data) => api.post("/auth/signup", data),
  googleLogin: (token) => api.post("/auth/google", { token }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (formData) =>
    api.put("/auth/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  logout: () => {
    localStorage.removeItem("token");
  },
};
