import api from "./api";

export const gameDetailsService = {
  getGameById: (id) => api.get(`/games/${id}`),
  getAverageRating: (id) => api.get(`/reviews/average/${id}`),
  getReviews: (id) => api.get(`/reviews/game/${id}`),
  addReview: (payload) => api.post("/reviews/add", payload),
  addToLibrary: (gameId) => api.post("/library/add", { gameId }),
  addToWishlist: (gameId) => api.post("/wishlist/add", { gameId }),
  getStoreRedirect: (id) => api.get(`/store/redirect/${id}`),
};

