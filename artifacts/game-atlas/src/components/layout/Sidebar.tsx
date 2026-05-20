import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Library, Compass, Trophy, Users, Newspaper,
  LogOut, X, User, BarChart3, Star, Gamepad2
} from "lucide-react";
import { auth } from "@/lib/auth";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Library, label: "Game Library", path: "/library" },
  { icon: Compass, label: "Discover", path: "/discover" },
  { icon: Gamepad2, label: "Arcade", path: "/arcade" },
  { icon: Trophy, label: "Achievements", path: "/achievements" },
  { icon: Users, label: "Community", path: "/community" },
  { icon: BarChart3, label: "Leaderboards", path: "/leaderboards" },
  { icon: Star, label: "Reviews", path: "/reviews" },
  { icon: Newspaper, label: "News", path: "/news" },
];

interface SidebarContentProps {
  expanded: boolean;
  mobileOpen: boolean;
  onClose?: () => void;
  onLogout: () => void;
}

function SidebarContent({ expanded, mobileOpen, onClose, onLogout }: SidebarContentProps) {
  const [location] = useLocation();
  const user = auth.getUser();
  const show = expanded || mobileOpen;

  return (
    <div className="h-full flex flex-col pt-4 pb-6 px-3 bg-[rgba(13,13,13,0.95)] backdrop-blur-md border-r-2 border-[rgba(139,0,0,0.5)]">
      <div className="flex items-center justify-between px-2 mb-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-800 rounded flex items-center justify-center font-orbitron font-bold text-white shrink-0 text-xs">
            GA
          </div>
          <AnimatePresence>
            {show && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-orbitron font-bold tracking-wider text-white whitespace-nowrap overflow-hidden"
              >
                GAMEATLAS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        {mobileOpen && onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white md:hidden">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location === item.path || location.startsWith(item.path + "/");
          const isArcade = item.path === "/arcade";
          return (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`nav-${item.label.toLowerCase().replace(/ /g, "-")}`}
              className={`flex items-center gap-4 px-3 py-2.5 rounded-md transition-all duration-300 group ${
                isActive
                  ? "bg-red-950/20 text-white border-l-2 border-red-500 shadow-[0_0_15px_rgba(139,0,0,0.3)]"
                  : "text-gray-400 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
              }`}
            >
              <item.icon
                size={18}
                className={`shrink-0 ${isActive ? "text-red-500 drop-shadow-[0_0_8px_rgba(255,42,42,0.8)]" : isArcade ? "group-hover:text-purple-400" : "group-hover:text-red-400"}`}
              />
              <AnimatePresence>
                {show && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className={`font-rajdhani uppercase tracking-wider font-semibold whitespace-nowrap overflow-hidden text-sm flex items-center gap-2 ${isActive ? "text-red-100" : ""}`}
                  >
                    {item.label}
                    {isArcade && !isActive && (
                      <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-purple-900/40 text-purple-400 border border-purple-500/30 uppercase tracking-wide">New</span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-4 space-y-4">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <Link href="/profile">
              <div className="w-10 h-10 rounded-full bg-red-900/50 border border-red-500/30 flex items-center justify-center font-rajdhani font-bold text-red-200 shrink-0 shadow-[0_0_10px_rgba(139,0,0,0.3)] cursor-pointer hover:border-red-400/60 transition-colors">
                {(user.username ?? "").substring(0, 2).toUpperCase()}
              </div>
            </Link>
            <AnimatePresence>
              {show && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className="flex flex-col whitespace-nowrap overflow-hidden"
                >
                  <span className="font-rajdhani font-bold text-white text-sm">{user.displayName ?? user.username}</span>
                  <span className="font-rajdhani text-xs text-red-400">LVL {user.level} LEGEND</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={onLogout}
          data-testid="button-logout"
          className="w-full flex items-center gap-4 px-3 py-3 rounded-md text-gray-400 hover:bg-white/5 hover:text-red-400 transition-colors group"
        >
          <LogOut size={20} className="shrink-0" />
          <AnimatePresence>
            {show && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-rajdhani uppercase tracking-wider font-semibold whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}) {
  const [, setLocation] = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    auth.logout();
    setLocation("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:block fixed left-0 top-0 bottom-0 z-50"
        initial={{ width: 64 }}
        animate={{ width: expanded ? 240 : 64 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <SidebarContent
          expanded={expanded}
          mobileOpen={false}
          onLogout={handleLogout}
        />
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 md:hidden"
            >
              <SidebarContent
                expanded={false}
                mobileOpen={true}
                onClose={() => setMobileOpen(false)}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
