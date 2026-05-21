import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Plus, Trophy, Clock, Calendar, HardDrive, Star, Share2, CheckCircle, XCircle, Heart, BookOpen, Camera, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/AppLayout";
import { gamesApi, libraryApi, reviewsApi, type Review, type Achievement } from "@/lib/api";
import { igdbApi, type IGDBGame } from "@/lib/igdb";
import { auth } from "@/lib/auth";

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded ${className}`} />;
}

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.floor(rating) ? "text-yellow-400" : i <= rating ? "text-yellow-400/50" : "text-gray-600"} fill={i <= rating ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

function AchievementItem({ ach, unlocked }: { ach: Achievement; unlocked: boolean }) {
  const rarityColors: Record<string, string> = { Common: "#9ca3af", Uncommon: "#22c55e", Rare: "#3b82f6", Epic: "#a855f7", Legendary: "#eab308" };
  const color = rarityColors[ach.rarity] ?? "#9ca3af";
  return (
    <div className={`flex items-center gap-3 p-2 rounded ${unlocked ? "opacity-100" : "opacity-40 grayscale"}`}>
      <div className={`w-10 h-10 rounded overflow-hidden border shrink-0 flex items-center justify-center`} style={{ borderColor: `${color}60` }}>
        {ach.iconUrl ? <img src={ach.iconUrl} alt={ach.title} className="w-full h-full object-cover" /> : <Trophy size={16} style={{ color }} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-rajdhani font-bold text-white text-sm truncate">{ach.title}</div>
        <div className="font-inter text-xs text-gray-400 truncate">{ach.description}</div>
      </div>
      <span className="font-orbitron text-xs font-bold shrink-0" style={{ color }}>+{ach.xpReward}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const initials = review.author?.displayName?.[0] ?? review.author?.username?.[0] ?? "?";

  return (
    <div className="glass-panel rounded-xl border border-white/5 hover:border-white/15 p-5 transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs text-white shrink-0"
          style={{ backgroundColor: review.author?.avatarColor ?? "#8B0000" }}>
          {initials.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-rajdhani font-bold text-white text-sm">{review.author?.displayName ?? review.author?.username}</span>
            <span className="font-orbitron text-[9px] text-gray-600">LVL {review.author?.level}</span>
          </div>
          <StarRating rating={review.rating} size={11} />
        </div>
        <div className="text-right shrink-0">
          {review.recommended ? (
            <span className="flex items-center gap-1 font-rajdhani text-[10px] font-bold text-green-400"><CheckCircle size={10} /> Recommended</span>
          ) : (
            <span className="flex items-center gap-1 font-rajdhani text-[10px] font-bold text-red-400"><XCircle size={10} /> Not Recommended</span>
          )}
        </div>
      </div>
      <h4 className="font-rajdhani font-bold text-white text-sm mb-2">{review.title}</h4>
      <p className={`font-inter text-sm text-gray-400 leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}>{review.reviewText}</p>
      {review.reviewText.length > 150 && (
        <button onClick={() => setExpanded(!expanded)} className="font-rajdhani text-xs text-red-500 hover:text-red-400 uppercase tracking-wider font-bold mt-1">
          {expanded ? "Less" : "Read more"}
        </button>
      )}
      {expanded && review.pros && review.pros.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="p-2 bg-green-950/20 border border-green-500/20 rounded-xl">
            <p className="font-rajdhani font-bold text-green-400 text-xs uppercase tracking-wider mb-1">Pros</p>
            {review.pros.map((p) => <div key={p} className="flex items-start gap-1 mb-0.5"><CheckCircle size={10} className="text-green-500 mt-0.5 shrink-0" /><span className="font-inter text-xs text-gray-300">{p}</span></div>)}
          </div>
          {review.cons && review.cons.length > 0 && (
            <div className="p-2 bg-red-950/20 border border-red-500/20 rounded-xl">
              <p className="font-rajdhani font-bold text-red-400 text-xs uppercase tracking-wider mb-1">Cons</p>
              {review.cons.map((c) => <div key={c} className="flex items-start gap-1 mb-0.5"><XCircle size={10} className="text-red-500 mt-0.5 shrink-0" /><span className="font-inter text-xs text-gray-300">{c}</span></div>)}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-rajdhani text-xs font-bold ${liked ? "bg-red-950/40 text-red-400 border border-red-500/30" : "bg-white/5 text-gray-400 hover:text-white"}`}
        >
          <Star size={11} fill={liked ? "currentColor" : "none"} /> {review.helpful} helpful
        </button>
        <span className="font-rajdhani text-xs text-gray-600">{review.playtimeBefore ?? 0}h before review</span>
      </div>
    </div>
  );
}

function ScreenshotGallery({ igdbGame }: { igdbGame: IGDBGame }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const screenshots = igdbGame.screenshots ?? [];
  const videos = igdbGame.videos ?? [];

  if (screenshots.length === 0 && videos.length === 0) return null;

  const allMedia = [
    ...videos.map((v) => ({ type: "video" as const, url: v.thumbnailUrl, fullUrl: `https://www.youtube.com/watch?v=${v.videoId}`, videoId: v.videoId, name: v.name })),
    ...screenshots.map((s) => ({ type: "screenshot" as const, url: s.url ?? "", fullUrl: s.fullUrl ?? s.url ?? "", name: "Screenshot" })),
  ];

  const closeLightbox = () => setLightboxIndex(null);
  const prevMedia = () => setLightboxIndex((i) => i !== null ? (i - 1 + allMedia.length) % allMedia.length : null);
  const nextMedia = () => setLightboxIndex((i) => i !== null ? (i + 1) % allMedia.length : null);
  const current = lightboxIndex !== null ? allMedia[lightboxIndex] : null;

  return (
    <>
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Camera size={18} className="text-red-500" />
          <h3 className="font-orbitron text-2xl font-bold text-white tracking-widest border-l-4 border-red-600 pl-4">SCREENSHOTS & TRAILERS</h3>
          <span className="px-2 py-0.5 bg-red-600/20 border border-red-500/30 rounded text-red-400 font-rajdhani font-bold text-[10px] uppercase tracking-wider">IGDB</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {allMedia.slice(0, 6).map((media, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (media.type === "video") {
                  window.open(media.fullUrl, "_blank");
                } else {
                  setLightboxIndex(idx);
                }
              }}
              className="relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-red-500/40 cursor-pointer group transition-all"
            >
              <img
                src={media.url}
                alt={media.name}
                loading="lazy"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-300"
              />
              {media.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform">
                    <Play size={16} fill="white" className="text-white ml-0.5" />
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && current && current.type === "screenshot" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-4 right-4 text-white hover:text-red-400 transition-colors z-10">
              <X size={24} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prevMedia(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-red-400 transition-colors z-10 p-2 bg-black/40 rounded-full">
              <ChevronLeft size={28} />
            </button>
            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={current.fullUrl}
              alt="Screenshot"
              className="max-w-full max-h-full rounded-xl border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button onClick={(e) => { e.stopPropagation(); nextMedia(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-red-400 transition-colors z-10 p-2 bg-black/40 rounded-full">
              <ChevronRight size={28} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-rajdhani text-xs text-gray-400 uppercase tracking-wider">
              {lightboxIndex + 1} / {allMedia.filter(m => m.type === "screenshot").length + allMedia.filter(m => m.type === "video").length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IGDBInfoPanel({ igdbGame }: { igdbGame: IGDBGame }) {
  const releaseDate = igdbGame.firstReleaseDate
    ? new Date(igdbGame.firstReleaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <section className="glass-panel p-6 rounded-xl border border-red-900/20">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-orbitron text-sm font-bold text-white tracking-widest">IGDB DATA</h3>
        <span className="px-1.5 py-0.5 bg-red-600/20 border border-red-500/30 rounded text-red-400 font-rajdhani font-bold text-[9px] uppercase tracking-wider">Live</span>
      </div>
      <div className="space-y-3 font-inter text-sm">
        {igdbGame.rating && (
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-500">IGDB Rating</span>
            <span className="text-yellow-400 font-bold flex items-center gap-1">
              <Star size={12} fill="currentColor" /> {(igdbGame.rating / 20).toFixed(1)}/5
              <span className="text-gray-600 font-normal text-xs">({igdbGame.ratingCount?.toLocaleString()})</span>
            </span>
          </div>
        )}
        {igdbGame.developer && (
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-500">Developer</span>
            <span className="text-white font-medium text-right">{igdbGame.developer}</span>
          </div>
        )}
        {igdbGame.publisher && igdbGame.publisher !== igdbGame.developer && (
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-500">Publisher</span>
            <span className="text-white font-medium text-right">{igdbGame.publisher}</span>
          </div>
        )}
        {releaseDate && (
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-500">Released</span>
            <span className="text-white font-medium text-right">{releaseDate}</span>
          </div>
        )}
        {igdbGame.platforms && igdbGame.platforms.length > 0 && (
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-500">Platforms</span>
            <span className="text-white font-medium text-right text-xs">{igdbGame.platforms.slice(0, 3).join(", ")}</span>
          </div>
        )}
        {igdbGame.genres && igdbGame.genres.length > 0 && (
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-gray-500">Genres</span>
            <span className="text-white font-medium text-right text-xs">{igdbGame.genres.join(", ")}</span>
          </div>
        )}
        <a
          href={`https://www.igdb.com/games/${igdbGame.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-red-500/30 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider text-gray-400 hover:text-white transition-all mt-2"
        >
          <ExternalLink size={11} /> View on IGDB
        </a>
      </div>
    </section>
  );
}

export default function GameDetail() {
  const { id: slug } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const user = auth.getUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["game", slug],
    queryFn: () => gamesApi.get(slug),
    staleTime: 60_000,
  });

  const { data: libraryData } = useQuery({
    queryKey: ["library"],
    queryFn: () => libraryApi.get(),
    staleTime: 30_000,
    enabled: !!user,
  });

  const { data: allGamesData } = useQuery({
    queryKey: ["games-all"],
    queryFn: () => gamesApi.list({ limit: 50 }),
    staleTime: 60_000,
  });

  const { data: igdbData } = useQuery({
    queryKey: ["igdb-game", slug],
    queryFn: () => igdbApi.gameBySlug(slug),
    staleTime: 60 * 60_000,
    retry: false,
  });

  const { data: igdbSearchData } = useQuery({
    queryKey: ["igdb-search-game", data?.game?.title],
    queryFn: () => igdbApi.search(data!.game!.title, 1),
    enabled: !igdbData?.game && !!data?.game?.title,
    staleTime: 60 * 60_000,
    retry: false,
  });

  const addMutation = useMutation({
    mutationFn: (gameId: number) => libraryApi.add({ gameId, status: "wishlist" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ gameId, updates }: { gameId: number; updates: { status?: string; favorite?: boolean } }) =>
      libraryApi.update(gameId, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["library"] }),
  });

  const game = data?.game;
  const achievements = data?.achievements ?? [];
  const reviews = data?.reviews ?? [];
  const library = libraryData?.library ?? [];
  const libraryEntry = library.find((e) => e.game?.slug === slug);
  const inLibrary = !!libraryEntry;
  const isFavorite = libraryEntry?.favorite ?? false;

  const igdbGame: IGDBGame | undefined = igdbData?.game ?? igdbSearchData?.games?.[0];

  const similarGames = (allGamesData?.games ?? [])
    .filter((g) => g.genre === game?.genre && g.slug !== slug)
    .slice(0, 3);

  const avgRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : game?.rating ?? 0;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-16 h-16 border-4 border-red-900 border-t-red-500 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (isError || !game) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h2 className="font-orbitron text-2xl text-red-500 mb-4">GAME NOT FOUND</h2>
          <Link href="/library" className="px-6 py-2 glass-panel hover:glass-panel-red font-rajdhani uppercase tracking-widest text-white transition-all">
            Return to Library
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="animate-in fade-in duration-700 pb-20 -mt-4 md:-mt-8 -mx-4 md:-mx-8">
        {/* Hero Section */}
        <div className="relative h-[60vh] min-h-[400px] w-full flex items-end overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={igdbGame?.artwork ?? igdbGame?.screenshots?.[0]?.fullUrl ?? game.bannerImage ?? game.coverImage}
              alt="Background"
              className="w-full h-full object-cover opacity-30 scale-105 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
          </div>

          <div className="relative z-10 w-full p-6 md:p-12 lg:px-16 container mx-auto">
            <Link href="/library" className="inline-flex items-center gap-2 text-gray-400 hover:text-white font-rajdhani uppercase tracking-widest mb-6 transition-colors group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              <img
                src={igdbGame?.cover ?? game.coverImage}
                alt={game.title}
                className="w-48 md:w-64 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10"
              />

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-red-950/40 border border-red-500/30 rounded font-rajdhani text-xs font-bold text-red-400 uppercase tracking-widest">{game.genre}</span>
                  <span className="flex items-center gap-1 text-yellow-500 font-inter text-sm">
                    <Star size={14} fill="currentColor" /> {avgRating.toFixed(1)} ({reviews.length} reviews)
                  </span>
                  {igdbGame?.rating && (
                    <span className="flex items-center gap-1 text-blue-400 font-inter text-sm">
                      <Star size={14} fill="currentColor" /> {(igdbGame.rating / 20).toFixed(1)} IGDB
                    </span>
                  )}
                  {inLibrary && (
                    <span className="px-3 py-1 bg-green-950/40 border border-green-500/30 rounded font-rajdhani text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-1">
                      <BookOpen size={11} /> In Library
                    </span>
                  )}
                </div>

                <h1 className="font-orbitron text-4xl md:text-6xl font-black text-white tracking-wider drop-shadow-lg leading-none">
                  {game.title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 font-rajdhani text-gray-300 uppercase tracking-wider text-sm font-semibold">
                  <div>{game.platform}</div>
                  {libraryEntry && <div className="flex items-center gap-2 text-white"><Clock size={16} className="text-red-500" /> {libraryEntry.playtime.toFixed(0)} HRS PLAYED</div>}
                  <div className="flex items-center gap-2"><Calendar size={16} /> Released {game.releaseYear}</div>
                  {game.size && <div className="flex items-center gap-2"><HardDrive size={16} /> {game.size} GB</div>}
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  {!inLibrary ? (
                    <button
                      onClick={() => addMutation.mutate(game.id)}
                      disabled={addMutation.isPending}
                      className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold tracking-widest rounded shadow-[0_0_20px_rgba(139,0,0,0.4)] transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      <Plus size={18} /> {addMutation.isPending ? "Adding..." : "ADD TO LIBRARY"}
                    </button>
                  ) : (
                    <button
                      onClick={() => updateMutation.mutate({ gameId: game.id, updates: { status: "playing" } })}
                      className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-orbitron font-bold tracking-widest rounded shadow-[0_0_20px_rgba(139,0,0,0.4)] transition-all flex items-center gap-2"
                    >
                      <Play size={18} fill="currentColor" /> PLAY NOW
                    </button>
                  )}
                  {inLibrary && (
                    <button
                      onClick={() => updateMutation.mutate({ gameId: game.id, updates: { favorite: !isFavorite } })}
                      className={`px-6 py-3 glass-panel hover:bg-white/10 font-rajdhani uppercase font-bold tracking-widest rounded transition-all flex items-center gap-2 ${isFavorite ? "text-red-400" : "text-white"}`}
                    >
                      <Heart size={18} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? "FAVORITED" : "FAVORITE"}
                    </button>
                  )}
                  <button className="p-3 glass-panel hover:bg-white/10 text-gray-300 hover:text-white rounded transition-all"><Share2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="container mx-auto px-6 md:px-12 lg:px-16 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h3 className="font-orbitron text-2xl font-bold text-white tracking-widest mb-6 border-l-4 border-red-600 pl-4">ABOUT</h3>
              <p className="font-inter text-gray-300 leading-relaxed text-lg">{game.description}</p>
              {igdbGame?.summary && igdbGame.summary !== game.description && (
                <div className="mt-4 p-4 bg-white/3 border border-white/5 rounded-xl">
                  <p className="font-rajdhani font-bold text-xs text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <span className="px-1.5 py-0.5 bg-red-600/20 border border-red-500/30 rounded text-red-400">IGDB</span>
                    Summary
                  </p>
                  <p className="font-inter text-gray-400 leading-relaxed text-sm">{igdbGame.summary}</p>
                </div>
              )}
            </section>

            {/* Screenshots & Trailers */}
            {igdbGame && (
              <ScreenshotGallery igdbGame={igdbGame} />
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <section>
                <h3 className="font-orbitron text-2xl font-bold text-white tracking-widest mb-6 border-l-4 border-red-600 pl-4">COMMUNITY REVIEWS</h3>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map((r) => <ReviewCard key={r.id} review={r} />)}
                </div>
              </section>
            )}

            {similarGames.length > 0 && (
              <section>
                <h3 className="font-orbitron text-2xl font-bold text-white tracking-widest mb-6 border-l-4 border-red-600 pl-4">SIMILAR TITLES</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similarGames.map((sg) => (
                    <Link key={sg.id} href={`/library/${sg.slug}`}>
                      <div className="group relative h-32 rounded-lg overflow-hidden border border-white/10 cursor-pointer">
                        <img src={sg.coverImage} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" alt={sg.title} />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-red-900/40 transition-colors" />
                        <div className="absolute inset-0 p-3 flex flex-col justify-end">
                          <h4 className="font-orbitron font-bold text-white text-sm truncate">{sg.title}</h4>
                          <span className="font-rajdhani text-xs text-gray-300 uppercase">{sg.genre}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* IGDB Similar Games */}
            {igdbGame && igdbGame.similarGames && igdbGame.similarGames.length > 0 && (
              <section>
                <h3 className="font-orbitron text-2xl font-bold text-white tracking-widest mb-2 border-l-4 border-red-600 pl-4">PLAYERS ALSO ENJOYED</h3>
                <p className="font-rajdhani text-xs text-gray-500 uppercase tracking-widest mb-6 pl-5 flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-red-600/20 border border-red-500/30 rounded text-red-400">IGDB</span>
                  Based on real player data
                </p>
                <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                  {igdbGame.similarGames.map((sg) => (
                    <motion.a
                      key={sg.id}
                      href={`https://www.igdb.com/games/${sg.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="shrink-0 w-36 group"
                    >
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-500/40 transition-all">
                        {sg.cover ? (
                          <img src={sg.cover} alt={sg.name} loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-b from-red-950/20 to-black flex items-center justify-center p-2">
                            <span className="font-rajdhani text-xs text-gray-600 text-center">{sg.name}</span>
                          </div>
                        )}
                        {sg.rating && (
                          <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/70 rounded-full px-1.5 py-0.5">
                            <Star size={9} className="text-yellow-400" fill="currentColor" />
                            <span className="font-orbitron text-[8px] text-white">{(sg.rating / 20).toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 px-0.5 font-orbitron font-bold text-white text-[10px] truncate">{sg.name}</p>
                    </motion.a>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Achievements */}
            {achievements.length > 0 && (
              <section className="glass-panel p-6 rounded-xl border-t-2 border-t-red-600">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-orbitron text-lg font-bold text-white tracking-widest flex items-center gap-2"><Trophy size={18} className="text-red-500" /> ACHIEVEMENTS</h3>
                  <span className="font-rajdhani font-bold text-gray-400">{achievements.length} total</span>
                </div>
                <div className="space-y-2">
                  {achievements.slice(0, 5).map((ach) => <AchievementItem key={ach.id} ach={ach} unlocked={false} />)}
                </div>
                {achievements.length > 5 && (
                  <Link href="/achievements" className="block w-full mt-4 py-2 font-rajdhani uppercase text-sm font-bold tracking-widest text-red-400 hover:text-red-300 text-center transition-colors">
                    View All ({achievements.length}) →
                  </Link>
                )}
              </section>
            )}

            {/* IGDB Live Data */}
            {igdbGame && <IGDBInfoPanel igdbGame={igdbGame} />}

            {/* Game Info */}
            <section className="glass-panel p-6 rounded-xl">
              <h3 className="font-orbitron text-lg font-bold text-white tracking-widest mb-6">GAME INFO</h3>
              <div className="space-y-4 font-inter text-sm">
                {[
                  { label: "Developer", value: game.developer },
                  { label: "Publisher", value: game.publisher ?? game.developer },
                  { label: "Release Year", value: game.releaseYear },
                  { label: "Platform", value: game.platform },
                  { label: "Genre", value: game.genre },
                  ...(game.size ? [{ label: "Size", value: `${game.size} GB` }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="text-white font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Player stats if in library */}
            {libraryEntry && (
              <section className="glass-panel p-6 rounded-xl">
                <h3 className="font-orbitron text-lg font-bold text-white tracking-widest mb-6">YOUR STATS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                    <div className="font-rajdhani text-xs text-gray-500 uppercase tracking-widest mb-1">Time Played</div>
                    <div className="font-orbitron text-xl text-white font-bold">{libraryEntry.playtime.toFixed(0)}h</div>
                  </div>
                  <div className="bg-black/40 p-4 rounded-lg border border-white/5">
                    <div className="font-rajdhani text-xs text-gray-500 uppercase tracking-widest mb-1">Status</div>
                    <div className="font-rajdhani text-sm text-white font-bold capitalize">{libraryEntry.status.replace("_", " ")}</div>
                  </div>
                </div>
                <select
                  value={libraryEntry.status}
                  onChange={(e) => updateMutation.mutate({ gameId: game.id, updates: { status: e.target.value } })}
                  className="mt-4 w-full bg-black/50 border border-white/10 rounded-lg py-2 px-4 text-sm font-rajdhani text-white focus:outline-none focus:border-red-500/50 appearance-none cursor-pointer"
                >
                  {["playing", "completed", "wishlist", "not_started", "paused", "dropped"].map((s) => (
                    <option key={s} value={s}>{s.replace("_", " ")}</option>
                  ))}
                </select>
              </section>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
