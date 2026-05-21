const API_BASE = "/api";

function getToken(): string | null {
  return localStorage.getItem("gameatlas_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorData: { message?: string; error?: string } = {};
    try { errorData = await res.json(); } catch {}
    throw new ApiError(
      errorData.message ?? errorData.error ?? `HTTP ${res.status}`,
      res.status,
      errorData,
    );
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  level: number;
  xp: number;
  avatarColor: string | null;
  rankTier: string;
  favoriteGenre: string | null;
  favoriteGame: string | null;
  createdAt: string;
}

export interface UserProfile extends AuthUser {
  xpToNextLevel: number;
  gamesOwned: number;
  achievementsUnlocked: number;
  totalPlaytime: number;
  reviewsWritten: number;
  joinDate: string;
  lastSeen: string | null;
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authApi = {
  register: (body: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => request<{ user: AuthUser }>("/auth/me"),

  logout: () => request<{ message: string }>("/auth/logout", { method: "POST" }),
};

// ── Games ────────────────────────────────────────────────────────────────────

export interface Game {
  id: number;
  slug: string;
  title: string;
  description: string;
  coverImage: string;
  bannerImage: string | null;
  genre: string;
  platform: string;
  developer: string;
  publisher: string | null;
  releaseYear: number;
  rating: number;
  size: number | null;
  createdAt: string;
}

export const gamesApi = {
  list: (params?: { genre?: string; platform?: string; search?: string; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.genre && params.genre !== "All") q.set("genre", params.genre);
    if (params?.platform && params.platform !== "All") q.set("platform", params.platform);
    if (params?.search) q.set("search", params.search);
    if (params?.limit) q.set("limit", String(params.limit));
    return request<{ games: Game[]; total: number }>(`/games?${q}`);
  },

  get: (slug: string) =>
    request<{ game: Game; achievements: Achievement[]; reviews: Review[] }>(`/games/${slug}`),

  search: (query: string) => {
    const q = new URLSearchParams();
    if (query) q.set("search", query);
    q.set("limit", "50");
    return request<{ games: Game[]; total: number }>(`/games?${q}`);
  },

  trending: () => request<{ games: Game[] }>("/games/trending"),
};

// ── Library ──────────────────────────────────────────────────────────────────

export interface LibraryEntry {
  id: number;
  playtime: number;
  status: string;
  favorite: boolean;
  lastPlayed: string | null;
  addedAt: string;
  game: {
    id: number;
    slug: string;
    title: string;
    genre: string;
    platform: string;
    coverImage: string;
    rating: number;
    releaseYear: number;
    description: string;
  } | null;
}

export const libraryApi = {
  get: () => request<{ library: LibraryEntry[] }>("/library"),

  add: (body: { gameId: number; status?: string }) =>
    request<{ entry: LibraryEntry }>("/library", { method: "POST", body: JSON.stringify(body) }),

  update: (gameId: number, body: { status?: string; playtime?: number; favorite?: boolean }) =>
    request<{ entry: LibraryEntry }>(`/library/${gameId}`, { method: "PATCH", body: JSON.stringify(body) }),

  remove: (gameId: number) =>
    request<{ message: string }>(`/library/${gameId}`, { method: "DELETE" }),
};

// ── Users ────────────────────────────────────────────────────────────────────

export interface ProfileStats {
  totalPlaytime: number;
  gamesCompleted: number;
  achievementsUnlocked: number;
  gamesInLibrary: number;
}

export const usersApi = {
  getProfile: () =>
    request<{ user: AuthUser; stats: ProfileStats }>("/users/me").then(({ user, stats }) => ({
      user: {
        ...user,
        xpToNextLevel: Math.max(0, (user.level * 1000) - user.xp),
        gamesOwned: stats.gamesInLibrary,
        achievementsUnlocked: stats.achievementsUnlocked,
        totalPlaytime: stats.totalPlaytime,
        reviewsWritten: stats.gamesCompleted,
        joinDate: user.createdAt,
        lastSeen: null,
      } as UserProfile,
    })),

  updateProfile: (body: {
    displayName?: string;
    bio?: string;
    favoriteGenre?: string;
    favoriteGame?: string;
    avatarColor?: string;
  }) => request<{ user: AuthUser }>("/users/me", { method: "PATCH", body: JSON.stringify(body) }),

  getAchievements: () => request<{ achievements: Achievement[] }>("/users/me/achievements"),
};

// ── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  rating: number;
  title: string;
  reviewText: string;
  pros: string[] | null;
  cons: string[] | null;
  recommended: boolean;
  playtimeBefore: number | null;
  likes: number;
  helpful: number;
  featured: boolean;
  createdAt: string;
  game: {
    id: number;
    slug: string;
    title: string;
    coverImage: string;
    platform: string;
  } | null;
  author: {
    id: number;
    username: string;
    displayName: string | null;
    level: number;
    avatarColor: string | null;
  } | null;
}

export const reviewsApi = {
  list: (params?: { gameId?: number; sort?: string; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.gameId) q.set("gameId", String(params.gameId));
    if (params?.sort) q.set("sort", params.sort);
    if (params?.limit) q.set("limit", String(params.limit));
    return request<{ reviews: Review[] }>(`/reviews?${q}`);
  },

  featured: () => request<{ review: Review | null }>("/reviews/featured"),

  create: (body: {
    gameId: number;
    rating: number;
    title: string;
    reviewText: string;
    pros?: string[];
    cons?: string[];
    recommended?: boolean;
    playtimeBefore?: number;
  }) => request<{ review: Review }>("/reviews", { method: "POST", body: JSON.stringify(body) }),

  like: (id: number) =>
    request<{ likes: number }>(`/reviews/${id}/like`, { method: "POST" }),
};

// ── Achievements ─────────────────────────────────────────────────────────────

export interface Achievement {
  id: number;
  title: string;
  description: string;
  rarity: string;
  iconUrl: string | null;
  xpReward: number;
  rarityPercent: string | null;
  gameId: number;
  gameTitle?: string | null;
  unlockedAt: string | null;
}

// ── Notifications ─────────────────────────────────────────────────────────────

export interface AppNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  avatarInitials: string | null;
  avatarColor: string | null;
  createdAt: string;
}

export const notificationsApi = {
  list: () => request<{ notifications: AppNotification[]; unreadCount: number }>("/notifications"),
  markRead: (id: number) => request<{ message: string }>(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllRead: () => request<{ message: string }>("/notifications/read-all", { method: "PATCH" }),
};

// ── Community ─────────────────────────────────────────────────────────────────

export interface CommunityPost {
  id: number;
  type: string;
  content: string;
  imageUrl: string | null;
  gameTag: string | null;
  likes: number;
  commentsCount: number;
  shares: number;
  createdAt: string;
  author: {
    id: number;
    username: string;
    displayName: string | null;
    avatarColor: string | null;
    level: number;
    rankTier: string | null;
  } | null;
}

export interface CommunityComment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: number;
    username: string;
    displayName: string | null;
    avatarColor: string | null;
    level: number;
  } | null;
}

export const communityApi = {
  listPosts: (params?: { type?: string; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.type && params.type !== "all") q.set("type", params.type);
    if (params?.limit) q.set("limit", String(params.limit));
    return request<{ posts: CommunityPost[] }>(`/community/posts?${q}`);
  },
  createPost: (body: { type: string; content: string; imageUrl?: string; gameTag?: string }) =>
    request<{ post: CommunityPost }>("/community/posts", { method: "POST", body: JSON.stringify(body) }),
  likePost: (id: number) =>
    request<{ likes: number }>(`/community/posts/${id}/like`, { method: "POST" }),
  getComments: (postId: number) =>
    request<{ comments: CommunityComment[] }>(`/community/posts/${postId}/comments`),
  addComment: (postId: number, content: string) =>
    request<{ comment: CommunityComment }>(`/community/posts/${postId}/comments`, {
      method: "POST", body: JSON.stringify({ content }),
    }),
};

// ── Leaderboard ───────────────────────────────────────────────────────────────

export interface LeaderboardPlayer {
  id: number;
  username: string;
  displayName: string | null;
  avatarColor: string | null;
  level: number;
  xp: number;
  rankTier: string;
  favoriteGame: string | null;
  achievementsUnlocked: number;
  totalPlaytime: number;
  gamesInLibrary: number;
  reviewsWritten: number;
  score: number;
  rank: number;
}

export const leaderboardApi = {
  get: () => request<{ leaderboard: LeaderboardPlayer[] }>("/leaderboards"),
};

// ── Recommendations ───────────────────────────────────────────────────────────

export const recommendationsApi = {
  forMe: () => request<{ recommendations: Game[] }>("/recommendations"),
  similar: (slug: string) => request<{ similar: Game[] }>(`/recommendations/similar/${slug}`),
  becausePlayed: () => request<{ game: Game | null; recommendations: Game[] }>("/recommendations/because-played"),
};

// ── Gamer DNA ─────────────────────────────────────────────────────────────────

export interface GamerDNA {
  archetype: string;
  topGenre: string;
  description: string;
  rarity: string;
  color: string;
  icon: string;
  genreAffinity: Record<string, number>;
  playstyleBreakdown: { label: string; value: number }[];
}

export const dnaApi = {
  get: () => request<{ dna: GamerDNA }>("/dna"),
};

// ── Onboarding ────────────────────────────────────────────────────────────────

export const onboardingApi = {
  save: (body: { favoriteGenres: string[]; playStyle: string }) =>
    request<{ message: string }>("/users/me/onboarding", { method: "POST", body: JSON.stringify(body) }),
  getStatus: () =>
    request<{ completed: boolean; preferences: { favoriteGenres: string[]; playStyle: string } | null }>(
      "/users/me/onboarding"
    ),
};
