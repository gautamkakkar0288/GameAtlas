const BASE = "/api/igdb";

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? "IGDB request failed");
  }
  return res.json() as Promise<T>;
}

export interface IGDBVideo {
  id: number;
  videoId: string;
  name: string;
  thumbnailUrl: string;
}

export interface IGDBScreenshot {
  id: number;
  url: string | null;
  fullUrl: string | null;
}

export interface IGDBSimilarGame {
  id: number;
  name: string;
  slug: string;
  cover: string | null;
  rating: number | null;
}

export interface IGDBGame {
  id: number;
  name: string;
  slug: string;
  summary: string | null;
  rating: number | null;
  ratingCount: number | null;
  hypes: number | null;
  follows: number | null;
  firstReleaseDate: string | null;
  cover: string | null;
  coverThumb: string | null;
  artwork: string | null;
  screenshots: IGDBScreenshot[];
  videos: IGDBVideo[];
  genres: string[];
  platforms: string[];
  developer: string | null;
  publisher: string | null;
  similarGames: IGDBSimilarGame[];
}

export interface IGDBGenre {
  id: number;
  name: string;
  slug: string;
}

export const igdbApi = {
  trending: (limit?: number) =>
    request<{ games: IGDBGame[] }>(`/trending${limit ? `?limit=${limit}` : ""}`),

  upcoming: (limit?: number) =>
    request<{ games: IGDBGame[] }>(`/upcoming${limit ? `?limit=${limit}` : ""}`),

  topRated: (limit?: number) =>
    request<{ games: IGDBGame[] }>(`/top-rated${limit ? `?limit=${limit}` : ""}`),

  byGenre: (genreId: number, limit?: number) =>
    request<{ games: IGDBGame[] }>(
      `/genre/${genreId}${limit ? `?limit=${limit}` : ""}`,
    ),

  search: (q: string, limit?: number) =>
    request<{ games: IGDBGame[] }>(
      `/search?q=${encodeURIComponent(q)}${limit ? `&limit=${limit}` : ""}`,
    ),

  genres: () => request<{ genres: IGDBGenre[] }>("/genres"),

  gameBySlug: (slug: string) =>
    request<{ game: IGDBGame }>(`/game/${slug}`),
};
