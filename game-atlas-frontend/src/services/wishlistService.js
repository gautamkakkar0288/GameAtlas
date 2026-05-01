import api from "./api";

export const wishlistService = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (gameId) => api.post("/wishlist/add", { gameId }),
  removeFromWishlist: (gameId) =>
    api.delete("/wishlist/remove", { data: { gameId } }),
};
