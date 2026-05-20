import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { reviewsApi, gamesApi, type Review } from '@/lib/api';
import { auth } from '@/lib/auth';
import { Star, ThumbsUp, Clock, CheckCircle, XCircle, Crown, Filter, Plus, X, Send } from 'lucide-react';

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} className={i <= Math.floor(rating) ? 'text-yellow-400' : i <= rating ? 'text-yellow-400/50' : 'text-gray-600'} fill={i <= rating ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

function ScoreBadge({ rating }: { rating: number }) {
  const color = rating >= 4.5 ? '#22c55e' : rating >= 3.5 ? '#eab308' : rating >= 2.5 ? '#f97316' : '#ef4444';
  return (
    <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 shrink-0 relative overflow-hidden"
      style={{ borderColor: color, backgroundColor: `${color}15`, boxShadow: `0 0 20px ${color}40` }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${color}20, transparent 70%)` }} />
      <span className="font-orbitron font-black text-xl text-white z-10">{rating.toFixed(1)}</span>
      <StarRating rating={rating} size={8} />
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const authorInitials = (review.author?.displayName ?? review.author?.username ?? '??').slice(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} whileHover={{ y: -3 }}
      className="group glass-panel rounded-2xl border border-white/5 hover:border-white/15 hover:shadow-[0_4px_40px_rgba(139,0,0,0.12)] transition-all duration-300 overflow-hidden">
      <div className="flex gap-0">
        {review.game?.coverImage && (
          <div className="w-24 shrink-0 relative overflow-hidden">
            <img src={review.game.coverImage} alt={review.game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0d0d0d]/90" />
          </div>
        )}

        <div className="flex-1 p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <ScoreBadge rating={review.rating} />
              <div className="min-w-0">
                <h3 className="font-rajdhani font-black text-white text-base leading-tight mb-1 group-hover:text-red-100 transition-colors">{review.title}</h3>
                <p className="font-rajdhani text-xs text-red-400 font-bold uppercase tracking-wider mb-2">{review.game?.title}</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center font-orbitron font-bold text-[9px] text-white shrink-0"
                    style={{ backgroundColor: review.author?.avatarColor ?? '#8B0000' }}>
                    {authorInitials}
                  </div>
                  <span className="font-rajdhani font-bold text-gray-300 text-xs">{review.author?.displayName ?? review.author?.username}</span>
                  <span className="font-orbitron text-[9px] text-gray-600">LVL {review.author?.level}</span>
                  <span className="text-gray-600">·</span>
                  <span className="font-rajdhani text-xs text-gray-500">{timeAgo(review.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {review.recommended ? (
                <span className="flex items-center gap-1 font-rajdhani text-[10px] font-bold text-green-400 uppercase tracking-wider"><CheckCircle size={11} /> Recommended</span>
              ) : (
                <span className="flex items-center gap-1 font-rajdhani text-[10px] font-bold text-red-400 uppercase tracking-wider"><XCircle size={11} /> Not Recommended</span>
              )}
              <span className="flex items-center gap-1 font-rajdhani text-[10px] text-gray-500"><Clock size={10} />{review.playtimeBefore ?? 0}h before review</span>
            </div>
          </div>

          <p className={`font-inter text-sm text-gray-400 leading-relaxed mb-3 ${!expanded ? 'line-clamp-3' : ''}`}>{review.reviewText}</p>
          {review.reviewText.length > 200 && (
            <button onClick={() => setExpanded(!expanded)} className="font-rajdhani text-xs text-red-500 hover:text-red-400 uppercase tracking-wider font-bold mb-3">
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}

          {expanded && review.pros && review.pros.length > 0 && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-green-950/20 border border-green-500/20 rounded-xl">
                <p className="font-rajdhani font-bold text-green-400 text-xs uppercase tracking-wider mb-2">Pros</p>
                {review.pros.map((pro) => <div key={pro} className="flex items-start gap-1.5 mb-1"><CheckCircle size={11} className="text-green-500 mt-0.5 shrink-0" /><span className="font-inter text-xs text-gray-300">{pro}</span></div>)}
              </div>
              {review.cons && review.cons.length > 0 && (
                <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl">
                  <p className="font-rajdhani font-bold text-red-400 text-xs uppercase tracking-wider mb-2">Cons</p>
                  {review.cons.map((con) => <div key={con} className="flex items-start gap-1.5 mb-1"><XCircle size={11} className="text-red-500 mt-0.5 shrink-0" /><span className="font-inter text-xs text-gray-300">{con}</span></div>)}
                </div>
              )}
            </motion.div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <button onClick={() => setLiked(!liked)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all font-rajdhani text-xs font-bold ${liked ? 'bg-green-950/30 text-green-400 border border-green-500/20' : 'bg-white/5 text-gray-400 hover:text-white'}`}>
              <ThumbsUp size={11} />{review.likes + (liked ? 1 : 0)}
            </button>
            <span className="font-rajdhani text-xs text-gray-600">{review.game?.platform}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RatingBar({ star, count, percent }: { star: number; count: number; percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-orbitron text-xs text-gray-400 w-3 shrink-0">{star}</span>
      <Star size={11} className="text-yellow-400 shrink-0" fill="currentColor" />
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600" initial={{ width: 0 }} whileInView={{ width: `${percent}%` }} viewport={{ once: true }} transition={{ duration: 0.8, ease: 'easeOut' }} />
      </div>
      <span className="font-rajdhani text-xs text-gray-500 w-6 text-right shrink-0">{count}</span>
    </div>
  );
}

function CreateReviewModal({ onClose }: { onClose: () => void }) {
  const [gameId, setGameId] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [recommended, setRecommended] = useState(true);
  const queryClient = useQueryClient();

  const { data: gamesData } = useQuery({ queryKey: ['games-all'], queryFn: () => gamesApi.list({ limit: 50 }), staleTime: 60_000 });

  const createMutation = useMutation({
    mutationFn: () => reviewsApi.create({ gameId: Number(gameId), rating, title, reviewText, recommended }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['reviews'] }); onClose(); },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel rounded-2xl border border-white/10 p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-orbitron text-lg font-bold text-white tracking-widest">WRITE REVIEW</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <select value={gameId} onChange={(e) => setGameId(e.target.value)}
          className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-inter text-white mb-3 focus:outline-none focus:border-red-500/50">
          <option value="">Select game...</option>
          {gamesData?.games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
        </select>

        <div className="flex items-center gap-3 mb-3">
          <span className="font-rajdhani text-sm text-gray-400 uppercase tracking-wider">Rating:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => setRating(i)}>
                <Star size={22} className={i <= rating ? 'text-yellow-400' : 'text-gray-600'} fill={i <= rating ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title (min 5 chars)"
          className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-inter text-white mb-3 focus:outline-none focus:border-red-500/50 placeholder:text-gray-600" />

        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} placeholder="Your review (min 20 chars)..." rows={4}
          className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-inter text-white mb-3 focus:outline-none focus:border-red-500/50 placeholder:text-gray-600 resize-none" />

        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setRecommended(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all ${recommended ? 'bg-green-950/40 text-green-400 border border-green-500/30' : 'bg-white/5 text-gray-400'}`}>
            <CheckCircle size={12} /> Recommend
          </button>
          <button onClick={() => setRecommended(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all ${!recommended ? 'bg-red-950/40 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400'}`}>
            <XCircle size={12} /> Not Recommend
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 font-rajdhani uppercase text-sm font-bold tracking-wider text-gray-400 hover:text-white">Cancel</button>
          <button onClick={() => createMutation.mutate()}
            disabled={!gameId || !title || reviewText.length < 20 || createMutation.isPending}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase font-bold tracking-wider text-sm rounded-xl flex items-center gap-2 disabled:opacity-50">
            <Send size={14} /> {createMutation.isPending ? 'Posting...' : 'Submit Review'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Reviews() {
  const [sortBy, setSortBy] = useState<string>('helpful');
  const [showCreate, setShowCreate] = useState(false);
  const user = auth.getUser();

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews', sortBy],
    queryFn: () => reviewsApi.list({ sort: sortBy, limit: 30 }),
    staleTime: 30_000,
  });

  const { data: featuredData } = useQuery({
    queryKey: ['review-featured'],
    queryFn: () => reviewsApi.featured(),
    staleTime: 60_000,
  });

  const reviews = reviewsData?.reviews ?? [];
  const featured = featuredData?.review;
  const avgRating = reviews.length > 0 ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;
  const recommendedPct = reviews.length > 0 ? Math.round((reviews.filter((r) => r.recommended).length / reviews.length) * 100) : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === star).length;
    return { star, count, percent: reviews.length > 0 ? (count / reviews.length) * 100 : 0 };
  });

  const sortOptions = [
    { key: 'helpful', label: 'Most Helpful' },
    { key: 'newest', label: 'Newest' },
    { key: 'rating', label: 'Highest Rated' },
    { key: 'controversial', label: 'Controversial' },
  ];

  return (
    <AppLayout>
      {showCreate && <CreateReviewModal onClose={() => setShowCreate(false)} />}
      <PageTransition>
        <div className="space-y-8 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-black text-white tracking-widest border-l-4 border-red-600 pl-4 uppercase">Review Nexus</h1>
              <p className="font-rajdhani text-gray-400 uppercase tracking-widest mt-1 pl-5">The community's verdict on every game</p>
            </div>
            {user && (
              <button onClick={() => setShowCreate(true)}
                className="self-start md:self-auto px-5 py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/40 text-red-300 rounded-xl font-rajdhani font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2">
                <Plus size={15} /> Write Review
              </button>
            )}
          </div>

          {/* Featured Review */}
          {featured && (
            <section className="relative rounded-2xl overflow-hidden border border-yellow-500/20 group cursor-pointer">
              <div className="absolute inset-0 z-0">
                <img src={featured.game?.coverImage} alt={featured.game?.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
              </div>
              <div className="relative z-10 p-6 md:p-10">
                <div className="flex items-center gap-2 mb-3">
                  <Crown size={14} className="text-yellow-400" />
                  <span className="font-rajdhani text-yellow-400 text-xs font-bold uppercase tracking-widest">Editor's Featured Review</span>
                </div>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <ScoreBadge rating={featured.rating} />
                  <div className="flex-1">
                    <h2 className="font-orbitron text-xl md:text-2xl font-black text-white tracking-wider mb-2">{featured.title}</h2>
                    <p className="font-rajdhani text-red-400 font-bold uppercase tracking-widest text-sm mb-3">{featured.game?.title}</p>
                    <p className="font-inter text-gray-300 text-sm line-clamp-3 mb-4 max-w-2xl">{featured.reviewText}</p>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center font-orbitron font-bold text-xs text-white"
                          style={{ backgroundColor: featured.author?.avatarColor ?? '#8B0000' }}>
                          {(featured.author?.displayName ?? featured.author?.username ?? '?').slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-rajdhani font-bold text-white text-sm">{featured.author?.displayName ?? featured.author?.username}</span>
                      </div>
                      <span className="flex items-center gap-1 font-rajdhani text-xs text-green-400 font-bold"><ThumbsUp size={12} />{featured.likes.toLocaleString()} helpful</span>
                      <span className="flex items-center gap-1 font-rajdhani text-xs text-gray-400"><Clock size={12} />{featured.playtimeBefore ?? 0}h played</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-5">
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-1.5 text-gray-500"><Filter size={13} /><span className="font-rajdhani text-xs uppercase tracking-wider">Sort:</span></div>
                {sortOptions.map((opt) => (
                  <button key={opt.key} onClick={() => setSortBy(opt.key)}
                    className={`px-3 py-1.5 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all ${sortBy === opt.key ? 'bg-red-900/40 text-red-300 border border-red-500/40' : 'text-gray-500 border border-transparent hover:text-gray-300 hover:bg-white/5'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="space-y-4">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="animate-pulse bg-white/5 rounded-2xl h-40" />)}</div>
              ) : reviews.length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center">
                  <Star size={40} className="text-gray-600 mx-auto mb-4" fill="none" />
                  <p className="font-orbitron text-gray-400 text-lg">No reviews yet.</p>
                  {user && <button onClick={() => setShowCreate(true)} className="mt-4 text-red-500 hover:text-red-400 font-rajdhani uppercase text-sm tracking-widest">Write the first review →</button>}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={sortBy} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                    {reviews.map((review, i) => <ReviewCard key={review.id} review={review} index={i} />)}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <div className="space-y-5">
              <div className="glass-panel rounded-2xl border border-white/5 p-6">
                <h3 className="font-orbitron text-sm font-black text-white tracking-widest uppercase mb-6">Community Rating</h3>
                <div className="text-center mb-6">
                  <div className="font-orbitron text-6xl font-black mb-2" style={{ background: 'linear-gradient(135deg, #eab308, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {reviews.length > 0 ? avgRating.toFixed(1) : '--'}
                  </div>
                  {reviews.length > 0 && <StarRating rating={avgRating} size={18} />}
                  <p className="font-rajdhani text-gray-500 text-xs mt-2 uppercase tracking-wider">{reviews.length} reviews</p>
                </div>
                <div className="space-y-3 mb-6">{distribution.map((d) => <RatingBar key={d.star} star={d.star} count={d.count} percent={d.percent} />)}</div>
                {reviews.length > 0 && (
                  <div className="p-4 bg-green-950/20 border border-green-500/20 rounded-xl text-center">
                    <div className="font-orbitron text-3xl font-black text-green-400 mb-1">{recommendedPct}%</div>
                    <p className="font-rajdhani text-xs text-gray-400 uppercase tracking-wider">of players recommend</p>
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-2xl border border-white/5 p-5">
                <h3 className="font-orbitron text-sm font-black text-white tracking-widest uppercase mb-4">Review Stats</h3>
                {[
                  { label: 'Total Reviews', value: reviews.length },
                  { label: 'Avg Playtime', value: reviews.length > 0 ? `${Math.round(reviews.reduce((a, r) => a + (r.playtimeBefore ?? 0), 0) / reviews.length)}h` : '--' },
                  { label: 'Total Likes', value: reviews.reduce((a, r) => a + r.likes, 0).toLocaleString() },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="font-rajdhani text-xs text-gray-500 uppercase tracking-wider">{stat.label}</span>
                    <span className="font-orbitron text-sm font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
