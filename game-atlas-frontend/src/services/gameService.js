import api from "./api";

export const gameService = {
  getAllGames: (params) => api.get("/games", { params }),
  getGameById: (id) => api.get(`/games/${id}`),
  searchGames: (query) => api.get("/games/search", { params: { q: query } }),
  addToLibrary: (gameId) => api.post("/library", { gameId }),
  getLibrary: () => api.get("/library"),
  removeFromLibrary: (gameId) => api.delete(`/library/${gameId}`),
};
