import api from "./api";

export const reviewService = {
  getReviewsForGame: (gameId)          => api.get(`/reviews/game/${gameId}`),
  getUserReviews: ()                   => api.get("/reviews/me"),
  createReview: (gameId, data)         => api.post(`/reviews/game/${gameId}`, data),
  updateReview: (reviewId, data)       => api.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId)             => api.delete(`/reviews/${reviewId}`),
  likeReview: (reviewId)              => api.post(`/reviews/${reviewId}/like`),
};
