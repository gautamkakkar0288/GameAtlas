import api from "./api";

export const achievementService = {
  getUserAchievements: ()              => api.get("/achievements"),
  getGameAchievements: (gameId)        => api.get(`/achievements/game/${gameId}`),
  unlockAchievement: (achievementId)   => api.post(`/achievements/${achievementId}/unlock`),
  getLeaderboard: ()                   => api.get("/achievements/leaderboard"),
};
