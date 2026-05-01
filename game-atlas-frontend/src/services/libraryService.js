import api from "./api";

export const libraryService = {
  getLibrary: ()                  => api.get("/library"),
  addGame: (gameId)               => api.post("/library", { gameId }),
  removeGame: (gameId)            => api.delete(`/library/${gameId}`),
  updateStatus: (gameId, status)  => api.patch(`/library/${gameId}/status`, { status }),
  // status can be: "playing" | "completed" | "dropped" | "plan_to_play"
};
