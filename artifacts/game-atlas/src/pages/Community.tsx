import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PageTransition } from '@/components/shared/PageTransition';
import { communityApi, gamesApi, type CommunityPost } from '@/lib/api';
import { rankTierConfig } from '@/lib/communityData';
import { auth } from '@/lib/auth';
import {
  MessageCircle, Share2, TrendingUp, Flame, Trophy, Gamepad2,
  Image, Film, Star, Heart, ChevronRight, Crown, Zap, Plus, Send, X
} from 'lucide-react';

const postTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  text: { icon: MessageCircle, color: '#9ca3af', label: 'Discussion' },
  screenshot: { icon: Image, color: '#3b82f6', label: 'Screenshot' },
  clip: { icon: Film, color: '#a855f7', label: 'Clip' },
  achievement: { icon: Trophy, color: '#eab308', label: 'Achievement' },
  recommendation: { icon: Star, color: '#ef4444', label: 'Recommendation' },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function PostCard({ post, index }: { post: CommunityPost; index: number }) {
  const [liked, setLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.likes);
  const queryClient = useQueryClient();
  const typeConf = postTypeConfig[post.type] ?? postTypeConfig.text;
  const authorColor = post.author?.avatarColor ?? '#8B0000';
  const authorInitials = (post.author?.displayName ?? post.author?.username ?? '??').slice(0, 2).toUpperCase();
  const rankTier = (post.author?.rankTier ?? 'Bronze') as keyof typeof rankTierConfig;
  const rankConf = rankTierConfig[rankTier] ?? rankTierConfig['Bronze'];

  const likeMutation = useMutation({
    mutationFn: () => communityApi.likePost(post.id),
    onSuccess: (data) => {
      setLocalLikes(data.likes);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      likeMutation.mutate();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -2 }}
      className="group glass-panel rounded-2xl border border-white/5 hover:border-white/15 hover:shadow-[0_4px_40px_rgba(139,0,0,0.15)] transition-all duration-300 overflow-hidden"
    >
      {post.imageUrl && (
        <div className="relative h-52 overflow-hidden">
          <img src={post.imageUrl} alt="post media" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
          {post.type === 'clip' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Film size={24} className="text-white" />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-orbitron font-bold text-sm text-white"
                style={{ backgroundColor: authorColor, boxShadow: `0 0 12px ${authorColor}60` }}>
                {authorInitials}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-rajdhani font-bold text-white text-sm">{post.author?.displayName ?? post.author?.username}</span>
                <span className="font-orbitron text-[9px] font-bold px-1.5 py-0.5 rounded"
                  style={{ color: rankConf.color, backgroundColor: `${rankConf.color}20` }}>
                  LVL {post.author?.level}
                </span>
              </div>
              <span className="font-rajdhani text-xs text-gray-500">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/5"
            style={{ color: typeConf.color, backgroundColor: `${typeConf.color}10` }}>
            <typeConf.icon size={12} />
            <span className="font-rajdhani text-[10px] uppercase tracking-wider font-bold">{typeConf.label}</span>
          </div>
        </div>

        <p className="font-inter text-gray-300 text-sm leading-relaxed mb-3">{post.content}</p>

        {post.gameTag && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/30 border border-red-500/20 rounded-lg mb-4">
            <Gamepad2 size={11} className="text-red-400" />
            <span className="font-rajdhani text-xs text-red-300 font-bold uppercase tracking-wider">{post.gameTag}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all text-xs font-rajdhani font-bold ${liked ? 'bg-red-950/40 text-red-400 border border-red-500/30' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
            >
              <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
              {localLikes}
            </button>
          </div>
          <div className="flex items-center gap-3 text-gray-500">
            <button className="flex items-center gap-1.5 hover:text-gray-300 transition-colors font-rajdhani text-xs">
              <MessageCircle size={13} />
              <span>{post.commentsCount}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-300 transition-colors font-rajdhani text-xs">
              <Share2 size={13} />
              <span>{post.shares}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [content, setContent] = useState('');
  const [type, setType] = useState('text');
  const [gameTag, setGameTag] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: () => communityApi.createPost({ type, content, gameTag: gameTag || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel rounded-2xl border border-white/10 p-6 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-orbitron text-lg font-bold text-white tracking-widest">CREATE POST</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.entries(postTypeConfig).map(([key, conf]) => (
            <button key={key} onClick={() => setType(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-rajdhani font-bold text-xs uppercase tracking-wider transition-all ${type === key ? 'border' : 'bg-white/5 text-gray-400 hover:text-white'}`}
              style={type === key ? { color: conf.color, backgroundColor: `${conf.color}20`, borderColor: `${conf.color}40` } : {}}>
              <conf.icon size={12} />{conf.label}
            </button>
          ))}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share something with the community..."
          rows={4}
          className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-inter text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600 resize-none mb-3"
        />

        <input
          value={gameTag}
          onChange={(e) => setGameTag(e.target.value)}
          placeholder="Game tag (optional)"
          className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm font-inter text-white focus:outline-none focus:border-red-500/50 transition-all placeholder:text-gray-600 mb-4"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2 font-rajdhani uppercase text-sm font-bold tracking-wider text-gray-400 hover:text-white transition-colors">Cancel</button>
          <button
            onClick={() => createMutation.mutate()}
            disabled={!content.trim() || createMutation.isPending}
            className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-rajdhani uppercase font-bold tracking-wider text-sm rounded-xl flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Send size={14} /> {createMutation.isPending ? 'Posting...' : 'Post'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Community() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showCreate, setShowCreate] = useState(false);
  const user = auth.getUser();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', activeFilter],
    queryFn: () => communityApi.listPosts({ type: activeFilter, limit: 20 }),
    staleTime: 30_000,
  });

  const { data: trendingData } = useQuery({
    queryKey: ['trending'],
    queryFn: () => gamesApi.trending(),
    staleTime: 60_000,
  });

  const posts = postsData?.posts ?? [];
  const trendingGames = trendingData?.games ?? [];

  const filters = [
    { key: 'all', label: 'All', icon: Flame },
    { key: 'screenshot', label: 'Screenshots', icon: Image },
    { key: 'clip', label: 'Clips', icon: Film },
    { key: 'achievement', label: 'Achievements', icon: Trophy },
    { key: 'recommendation', label: 'Picks', icon: Star },
  ];

  return (
    <AppLayout>
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} />}
      <PageTransition>
        <div className="space-y-6 pb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-black text-white tracking-widest border-l-4 border-red-600 pl-4 uppercase">Nexus Feed</h1>
              <p className="font-rajdhani text-gray-400 uppercase tracking-widest mt-1 pl-5">The pulse of the gaming community</p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreate(true)}
                className="self-start md:self-auto px-5 py-2.5 bg-red-900/30 hover:bg-red-900/50 border border-red-500/40 text-red-300 rounded-xl font-rajdhani font-bold uppercase tracking-widest text-sm transition-all hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] flex items-center gap-2"
              >
                <Plus size={15} /> Create Post
              </button>
            )}
          </div>

          {/* Featured Event Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-red-500/20 hover:border-red-500/40 transition-colors cursor-pointer group">
            <img src="https://picsum.photos/seed/event1/1200/300" alt="event" className="w-full h-36 md:h-48 object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 flex items-center p-6 md:p-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={14} className="text-yellow-400" />
                  <span className="font-rajdhani text-yellow-400 text-xs font-bold uppercase tracking-widest">Featured Event</span>
                </div>
                <h3 className="font-orbitron text-xl md:text-3xl font-black text-white tracking-wider mb-2">GAMEATLAS CHAMPIONSHIP</h3>
                <p className="font-rajdhani text-gray-300 text-sm mb-4">Global tournament · $50,000 prize pool · Starts soon</p>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-rajdhani font-bold uppercase tracking-wider text-sm rounded-lg transition-colors flex items-center gap-2">
                  <Zap size={14} /> Register Now
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Feed */}
            <div className="xl:col-span-2 space-y-5">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filters.map((f) => (
                  <button key={f.key} onClick={() => setActiveFilter(f.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-rajdhani font-bold uppercase tracking-wider text-xs whitespace-nowrap transition-all ${activeFilter === f.key ? 'bg-red-900/40 text-red-300 border border-red-500/50 shadow-[0_0_15px_rgba(139,0,0,0.2)]' : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-gray-200'}`}>
                    <f.icon size={13} />{f.label}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="animate-pulse bg-white/5 rounded-2xl h-40" />)}
                </div>
              ) : posts.length === 0 ? (
                <div className="glass-panel rounded-2xl p-12 text-center">
                  <MessageCircle size={40} className="text-gray-600 mx-auto mb-4" />
                  <p className="font-orbitron text-gray-400 text-lg">No posts yet.</p>
                  {user && <button onClick={() => setShowCreate(true)} className="mt-4 text-red-500 hover:text-red-400 font-rajdhani uppercase text-sm tracking-widest">Be the first to post →</button>}
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div key={activeFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                    {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="glass-panel rounded-2xl border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={16} className="text-red-500" />
                  <h3 className="font-orbitron text-sm font-black text-white tracking-widest uppercase">Trending Now</h3>
                </div>
                <div className="space-y-3">
                  {trendingGames.slice(0, 6).map((game, i) => (
                    <motion.div key={game.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ x: -4 }} className="flex items-center gap-3 group cursor-pointer">
                      <span className="font-orbitron text-xs font-bold text-gray-600 w-4 shrink-0">#{i + 1}</span>
                      <img src={game.coverImage} alt={game.title} className="w-10 h-10 rounded-lg object-cover border border-white/10 group-hover:border-red-500/40 transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="font-rajdhani font-bold text-white text-sm truncate group-hover:text-red-300 transition-colors">{game.title}</p>
                        <p className="font-rajdhani text-xs text-gray-500">{game.genre}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-2xl border border-white/5 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Crown size={16} className="text-yellow-500" />
                  <h3 className="font-orbitron text-sm font-black text-white tracking-widest uppercase">Community Stats</h3>
                </div>
                {[
                  { label: 'Total Posts', value: posts.length },
                  { label: 'Active Today', value: Math.max(1, Math.floor(posts.length * 0.4)) },
                  { label: 'Total Likes', value: posts.reduce((a, p) => a + p.likes, 0) },
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
