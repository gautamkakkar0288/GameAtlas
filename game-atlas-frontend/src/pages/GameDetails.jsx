import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Star, Plus, Heart, ShoppingCart, PlayCircle, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { gameDetailsService } from "../services/gameDetailsService";

const TRAILER_MAP = {
  "elden ring": "https://www.youtube.com/embed/E3Huy2cdih0?autoplay=1&mute=1&loop=1&playlist=E3Huy2cdih0&controls=1",
  "god of war": "https://www.youtube.com/embed/K0u_kAWLJOA?autoplay=1&mute=1&loop=1&playlist=K0u_kAWLJOA&controls=1",
  "gta v": "https://www.youtube.com/embed/QkkoHAzjnUs?autoplay=1&mute=1&loop=1&playlist=QkkoHAzjnUs&controls=1",
  valorant: "https://www.youtube.com/embed/e_E9W2vsRbQ?autoplay=1&mute=1&loop=1&playlist=e_E9W2vsRbQ&controls=1",
};

const GameDetails = () => {
  const { id } = useParams();
  const parsedId = Number(id);
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState({ averageRating: null, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [activeMedia, setActiveMedia] = useState("trailer");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 10, comment: "" });

  const overviewRef = useRef(null);
  const reviewsRef = useRef(null);
  const storeRef = useRef(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [gameRes, avgRes, reviewsRes] = await Promise.all([
        gameDetailsService.getGameById(parsedId),
        gameDetailsService.getAverageRating(parsedId),
        gameDetailsService.getReviews(parsedId),
      ]);
      setGame(gameRes.data);
      setAvg(avgRes.data || { averageRating: null, totalReviews: 0 });
      setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load game details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(parsedId)) {
      toast.error("Invalid game id");
      setLoading(false);
      return;
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedId]);

  const trailerUrl = useMemo(() => {
    const key = game?.title?.toLowerCase?.() || "";
    return TRAILER_MAP[key] || null;
  }, [game?.title]);

  const mediaItems = useMemo(() => {
    if (!game) return [];
    return [
      { key: "trailer", label: "Trailer", type: "trailer" },
      { key: "cover", label: "Cover", type: "image", src: game.coverImage },
    ].filter((item) => item.type === "trailer" || item.src);
  }, [game]);

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      setSubmittingReview(true);
      await gameDetailsService.addReview({
        gameId: parsedId,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      });
      toast.success("Review added successfully");
      setReviewForm({ rating: 10, comment: "" });
      loadAll();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to add review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddLibrary = async () => {
    try {
      await gameDetailsService.addToLibrary(parsedId);
      toast.success("Added to library");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to library");
    }
  };

  const handleAddWishlist = async () => {
    try {
      await gameDetailsService.addToWishlist(parsedId);
      toast.success("Added to wishlist");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to wishlist");
    }
  };

  const handleStoreRedirect = async () => {
    try {
      const { data } = await gameDetailsService.getStoreRedirect(parsedId);
      if (data?.storeUrl) {
        window.open(data.storeUrl, "_blank", "noopener,noreferrer");
      } else {
        toast.error("Store link unavailable");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to open store");
    }
  };

  const scrollToRef = (ref) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#04050F]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#04050F] text-white">
        <h2 className="mb-4 text-4xl font-black">Game not found</h2>
        <Link className="rounded-xl bg-purple-600 px-6 py-3 font-bold transition hover:bg-purple-500" to="/">
          Return to Home
        </Link>
      </div>
    );
  }

  const displayPrice = game.salePrice || game.price || 1999; // Fallback to 1999 if backend price is missing

  return (
    <main className="min-h-screen bg-[#04050F] text-slate-100 selection:bg-purple-500/30 selection:text-white">

      {/* 🎬 CINEMATIC HERO SECTION */}
      <section className="relative h-[65vh] min-h-[500px] w-full overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url(${game.coverImage || ""})`, filter: 'blur(8px)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04050F] via-[#04050F]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04050F] via-[#04050F]/80 to-transparent" />

        <div className="relative z-10 mx-auto flex h-full max-w-[90rem] flex-col justify-end px-6 pb-16 md:px-16 lg:px-24">
          <Link to="/" className="absolute top-10 left-6 md:left-16 lg:left-24 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={16} /> Back to Store
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="mb-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {game.platform || "PC"}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {game.genre || "Action"}
              </span>
              <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 backdrop-blur-md flex items-center gap-1.5">
                <Star size={14} fill="currentColor" /> {avg.averageRating ? Number(avg.averageRating).toFixed(1) : "N/A"}
              </span>
            </div>

            <h1 className="mb-6 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl drop-shadow-2xl">
              {game.title}
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-slate-300 drop-shadow-md">
              {game.description || "Dive into a cinematic gameplay journey. Experience unparalleled worlds and master your skills."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 🎮 MAIN CONTENT GRID */}
      <section className="mx-auto max-w-[90rem] px-6 py-12 md:px-16 lg:px-24">

        {/* Navigation Tabs */}
        <div className="mb-12 flex border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-widest text-slate-500">
          <button onClick={() => scrollToRef(overviewRef)} className="mr-10 text-white transition-colors hover:text-cyan-400">Overview</button>
          <button onClick={() => scrollToRef(reviewsRef)} className="mr-10 transition-colors hover:text-cyan-400">Reviews</button>
          <button onClick={() => scrollToRef(storeRef)} className="mr-10 transition-colors hover:text-cyan-400 lg:hidden">Store</button>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">

          {/* LEFT COLUMN: Media & Description */}
          <div ref={overviewRef}>

            {/* Media Player */}
            <div className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-video relative">
              <AnimatePresence mode="wait">
                {activeMedia === "trailer" && trailerUrl ? (
                  <motion.iframe
                    key="trailer"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 h-full w-full"
                    src={trailerUrl}
                    title={`${game.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <motion.img
                    key="image"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    src={game.coverImage || "https://placehold.co/1280x720/10122B/6D28D9?text=Cover+Image"}
                    alt={game.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Media Toggles */}
            <div className="mb-16 flex gap-4">
              {trailerUrl && (
                <button
                  onClick={() => setActiveMedia("trailer")}
                  className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${activeMedia === "trailer" ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "bg-transparent text-slate-400 border border-transparent hover:bg-white/5"}`}
                >
                  <PlayCircle size={18} /> Official Trailer
                </button>
              )}
              <button
                onClick={() => setActiveMedia("image")}
                className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${activeMedia === "image" ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" : "bg-transparent text-slate-400 border border-transparent hover:bg-white/5"}`}
              >
                <ImageIcon size={18} /> Screenshots
              </button>
            </div>

            {/* Developer Insights / About */}
            <h2 className="mb-6 text-3xl font-black text-white flex items-center gap-3">
              <span className="w-8 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></span>
              About This Game
            </h2>
            <div className="text-lg leading-relaxed text-slate-300 space-y-6">
              <p>{game.description || "No detailed description available for this title yet."}</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Store Checkout Card */}
          <div className="relative" ref={storeRef}>
            <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)]">

              <div className="mb-8">
                {game.discount > 0 && (
                  <div className="mb-3 flex items-center gap-3">
                    <span className="rounded-lg bg-pink-600 px-3 py-1.5 text-sm font-black text-white shadow-[0_0_15px_rgba(219,39,119,0.5)]">-{game.discount}%</span>
                    <span className="text-lg font-medium text-slate-500 line-through">₹{game.price}</span>
                  </div>
                )}
                <h3 className="text-5xl font-black text-emerald-400 tracking-tight">
                  ₹{displayPrice}
                </h3>
              </div>

              <div className="mb-8 flex flex-col gap-4">
                <button
                  onClick={handleStoreRedirect}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-black text-white transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                >
                  <ShoppingCart size={22} /> Buy on {game.platform || "Store"}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddLibrary}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-[#04050F] py-3.5 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Plus size={18} /> Library
                  </button>
                  <button
                    onClick={handleAddWishlist}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-[#04050F] py-3.5 text-sm font-bold text-slate-200 transition-colors hover:bg-white/10 hover:text-pink-400"
                  >
                    <Heart size={18} /> Wishlist
                  </button>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-6 text-sm font-medium text-slate-400">
                <div className="flex justify-between items-center"><span className="text-slate-500">Release Date</span> <span className="text-slate-200 font-bold">{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "TBA"}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Developer</span> <span className="text-slate-200 font-bold text-right">{game.developer || "Unknown"}</span></div>
                <div className="flex justify-between items-center"><span className="text-slate-500">Publisher</span> <span className="text-slate-200 font-bold text-right">{game.publisher || "Unknown"}</span></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ⭐ REVIEWS SECTION */}
      <section className="border-t border-white/10 bg-[#020205] py-24" ref={reviewsRef}>
        <div className="mx-auto max-w-[90rem] px-6 md:px-16 lg:px-24">

          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">Player Reviews</h2>
              <p className="text-slate-400 font-medium">Based on {avg.totalReviews || 0} reviews from the community</p>
            </div>
            {avg.averageRating && (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-6 py-4">
                <span className="text-4xl font-black text-amber-400">{Number(avg.averageRating).toFixed(1)}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-200 uppercase tracking-widest">Out of 10</span>
                  <div className="flex text-amber-400"><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} fill="currentColor" /><Star size={12} /></div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

            {/* Add Review Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-xl">
                <h3 className="mb-6 text-xl font-bold text-white">Write a Review</h3>
                <form onSubmit={handleAddReview} className="flex flex-col gap-5">
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-400">Rating (1-10)</label>
                    <input
                      type="number"
                      min="1" max="10"
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-black/50 p-3.5 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-400">Your Thoughts</label>
                    <textarea
                      rows="5"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      placeholder="What did you think of the gameplay, story, or graphics?"
                      className="w-full rounded-xl border border-white/10 bg-black/50 p-3.5 text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 py-4 font-black text-white transition-transform hover:scale-[1.02] shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {submittingReview ? "Posting..." : "Post Review"}
                  </button>
                </form>
              </div>
            </div>

            {/* Review List */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {reviews.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-slate-400">
                  <Star size={32} className="mb-4 opacity-50" />
                  <p className="font-bold">No reviews yet.</p>
                  <p className="text-sm">Be the first to share your thoughts!</p>
                </div>
              ) : (
                reviews.map((review, idx) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    key={review.id || idx}
                    className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-all hover:bg-white/10"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-black text-white text-lg shadow-lg">
                          {(review.user?.name || review.user?.email || "P").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block font-bold text-white text-lg">{review.user?.name || review.user?.email || "Player"}</span>
                          <span className="text-xs font-medium text-slate-500">{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-xl bg-amber-500/10 px-4 py-2 text-sm font-black text-amber-400 border border-amber-500/20">
                        <Star size={16} fill="currentColor" /> {review.rating}/10
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-lg">"{review.comment}"</p>
                  </motion.div>
                ))
              )}
            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default GameDetails;