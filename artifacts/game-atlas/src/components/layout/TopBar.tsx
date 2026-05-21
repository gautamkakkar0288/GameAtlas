import { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, X, Trophy, TrendingUp, Heart, Calendar, UserPlus } from "lucide-react";
import { useLocation, Link } from "wouter";
import { auth } from "@/lib/auth";
import { useGlobalSearch } from "@/components/shared/GlobalSearch";
import { notificationService } from "@/services/notification.service";
import { motion, AnimatePresence } from "framer-motion";
import type { Notification } from "@/lib/communityData";

const notifIcons: Record<Notification['type'], React.ElementType> = {
  achievement: Trophy,
  friend_activity: Bell,
  review_like: Heart,
  event: Calendar,
  rank_change: TrendingUp,
  friend_request: UserPlus,
};

const notifColors: Record<Notification['type'], string> = {
  achievement: '#eab308',
  friend_activity: '#3b82f6',
  review_like: '#ef4444',
  event: '#8B0000',
  rank_change: '#22c55e',
  friend_request: '#a855f7',
};

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(notificationService.getAll());

  const markAllRead = () => {
    notificationService.markAllRead();
    setNotifs(notificationService.getAll());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-full mt-2 w-80 glass-panel border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-50"
      style={{ backgroundColor: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-orbitron text-sm font-black text-white tracking-widest uppercase">Notifications</span>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className="font-rajdhani text-[10px] text-red-500 hover:text-red-400 uppercase tracking-wider font-bold transition-colors"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto">
        {notifs.map((notif, i) => {
          const Icon = notifIcons[notif.type];
          const color = notifColors[notif.type];
          return (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 last:border-0 transition-colors hover:bg-white/5 cursor-pointer ${!notif.read ? 'bg-red-950/10' : ''}`}
              onClick={() => {
                notificationService.markAsRead(notif.id);
                setNotifs(notificationService.getAll());
              }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
              >
                {notif.avatarInitials && notif.avatarInitials.length <= 2 && /[A-Z]/.test(notif.avatarInitials) ? (
                  <span className="font-orbitron font-bold text-[9px]" style={{ color }}>{notif.avatarInitials}</span>
                ) : (
                  <span className="text-sm">{notif.avatarInitials}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-rajdhani font-bold text-xs ${notif.read ? 'text-gray-400' : 'text-white'}`}>
                    {notif.title}
                  </p>
                  {!notif.read && (
                    <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1 shadow-[0_0_6px_rgba(239,68,68,0.8)]" />
                  )}
                </div>
                <p className="font-inter text-[11px] text-gray-500 mt-0.5 leading-snug">{notif.message}</p>
                <p className="font-rajdhani text-[10px] text-red-600 uppercase tracking-wider mt-1 font-bold">{notif.timestamp}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10 text-center">
        <button className="font-rajdhani text-xs text-gray-500 hover:text-gray-300 uppercase tracking-wider transition-colors">
          View All Notifications
        </button>
      </div>
    </motion.div>
  );
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [location] = useLocation();
  const user = auth.getUser();
  const { setOpen } = useGlobalSearch();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notificationService.getUnreadCount();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  let title = "Dashboard";
  if (location.startsWith("/library/")) title = "Game Details";
  else if (location.startsWith("/library")) title = "Game Library";
  else if (location.startsWith("/discover")) title = "Discover";
  else if (location.startsWith("/search")) title = "Search";
  else if (location.startsWith("/news")) title = "News Feed";
  else if (location.startsWith("/achievements")) title = "Achievements";
  else if (location.startsWith("/settings")) title = "Settings";
  else if (location.startsWith("/profile")) title = "Profile";
  else if (location.startsWith("/community")) title = "Community";
  else if (location.startsWith("/leaderboards")) title = "Leaderboards";
  else if (location.startsWith("/reviews")) title = "Reviews";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-16 z-30 h-[60px] bg-[rgba(5,5,5,0.8)] backdrop-blur-md border-b border-[rgba(139,0,0,0.2)] px-4 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-400 hover:text-white"
        >
          <Menu size={24} />
        </button>
        <h1 className="font-orbitron font-bold text-xl tracking-wider text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] uppercase">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex relative group cursor-text" onClick={() => setOpen(true)} data-testid="button-open-search">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500 group-hover:text-red-400 transition-colors" />
          </div>
          <div className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm font-inter text-gray-500 w-64 hover:border-red-500/50 hover:bg-white/10 transition-all hover:shadow-[0_0_15px_rgba(139,0,0,0.2)] flex items-center justify-between">
            <span>Search games...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white/10 rounded font-mono text-[10px] text-gray-400">⌘K</kbd>
          </div>
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative text-gray-400 hover:text-white transition-colors group"
          >
            <Bell size={20} className={`group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-transform ${notifOpen ? 'text-white' : ''}`} />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-red-600 rounded-full border border-[#050505] shadow-[0_0_8px_rgba(255,0,0,0.8)] flex items-center justify-center px-0.5"
              >
                <span className="font-orbitron font-black text-[8px] text-white">{unreadCount}</span>
              </motion.span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
          </AnimatePresence>
        </div>

        {user && (
          <Link href="/profile">
            <div className="hidden sm:flex items-center gap-2 cursor-pointer group">
              <div className="flex flex-col items-end">
                <span className="font-rajdhani text-xs text-white font-bold group-hover:text-red-200 transition-colors">{user.displayName ?? user.username}</span>
                <span className="font-rajdhani text-[10px] text-red-500 font-bold uppercase tracking-wider">LVL {user.level}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-900/40 border border-red-500/40 flex items-center justify-center font-rajdhani text-sm font-bold text-white shadow-[0_0_10px_rgba(139,0,0,0.2)] group-hover:bg-red-800/60 group-hover:border-red-400/60 transition-all">
                {(user.username ?? "").substring(0, 2).toUpperCase()}
              </div>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
