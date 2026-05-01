import api from "./api";

export const friendsService = {
  getFriends: () => api.get("/friends"),
  sendRequest: (friendId) => api.post("/friends/add", { friendId }),
  acceptRequest: (requestId) => api.post("/friends/accept", { requestId }),
};
