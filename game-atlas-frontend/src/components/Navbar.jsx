import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, logout } from "../store/slices/authSlice";
import { getProfilePicUrl, debounce } from "../utils/helpers";
import { gameService } from "../services/gameService";
import { Search, X, Gamepad2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const location = useLocation();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);

  const isActive = (path) =>
    location.pathname === path ? "text-white" : "text-slate-400 hover:text-white";

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/");
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced API Call for Search
  const fetchSearchResults = useRef(
    debounce(async (query) => {
      if (!query.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      try {
        // Fallback mock data in case backend isn't ready
        // const { data } = await gameService.searchGames(query); 

        // --- Simulated API Response ---
        const mockData = [
          { id: 1, title: "Elden Ring", price: "₹3,299", platform: "Steam", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&q=80" },
          { id: 2, title: "God of War", price: "₹2,999", platform: "Steam", image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=100&q=80" },
        ].filter(g => g.title.toLowerCase().includes(query.toLowerCase()));

        setSearchResults(mockData);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 400)
  ).current;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowDropdown(true);
    setIsSearching(true);
    fetchSearchResults(value);
  };

  return (
    <nav className="sticky top-0 z-[100] flex h-20 items-center justify-between border-b border-white/10 bg-[#04050F]/80 px-6 backdrop-blur-xl md:px-12 lg:px-20 transition-all">

      {/* Left: Logo & Links */}
      <div className="flex items-center gap-10">
        <Link to="/" className="text-2xl font-black tracking-tight text-white">
          GameAtlas<span className="text-cyan-400">.</span>
        </Link>

        <div className="hidden items-center gap-6 text-sm font-bold uppercase tracking-wider md:flex">
          <Link to="/" className={`transition-colors ${isActive("/")}`}>Store</Link>
          <Link to="/cloud" className={`transition-colors ${isActive("/cloud")}`}>Cloud</Link>
          {user && (
            <>
              <Link to="/library" className={`transition-colors ${isActive("/library")}`}>Library</Link>
              <Link to="/friends" className={`transition-colors ${isActive("/friends")}`}>Friends</Link>
            </>
          )}
        </div>
      </div>

      {/* Right: Search & Profile */}
      <div className="flex items-center gap-6">

        {/* Smart Search Bar */}
        <div className="relative hidden lg:block" ref={searchRef}>
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery && setShowDropdown(true)}
              placeholder="Search games..."
              className="w-64 rounded-full border border-white/10 bg-white/5 py-2 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition-all focus:w-80 focus:border-purple-500 focus:bg-white/10"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setShowDropdown(false); }}
                className="absolute right-3 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Live Search Dropdown */}
          <AnimatePresence>
            {showDropdown && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-3 w-80 overflow-hidden rounded-2xl border border-white/10 bg-[#10122B] shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl"
              >
                {isSearching ? (
                  <div className="flex items-center justify-center p-6 text-slate-400">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/30 border-t-purple-500" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="flex max-h-[400px] flex-col overflow-y-auto p-2 scrollbar-hide">
                    {searchResults.map((game) => (
                      <Link
                        key={game.id}
                        to={`/games/${game.id}`}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/5"
                      >
                        <img src={game.image} alt={game.title} className="h-12 w-16 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-white">{game.title}</h4>
                          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                            <span className="text-emerald-400">{game.price}</span> • <span>{game.platform}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    <Link to={`/search?q=${searchQuery}`} onClick={() => setShowDropdown(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-white/5 p-3 text-xs font-bold uppercase tracking-wider text-purple-400 hover:bg-white/10">
                      <Gamepad2 size={14} /> View All Results
                    </Link>
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm font-medium text-slate-400">
                    No games found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Auth/Profile */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/wishlist" className="text-slate-400 hover:text-pink-400 transition-colors hidden sm:block">
                <Heart size={20} />
              </Link>
              <Link to="/profile" title={user.name} className="relative group">
                <img
                  src={getProfilePicUrl(user.profilePic, user.name)}
                  alt={user.name}
                  className="h-10 w-10 rounded-full border-2 border-purple-500/50 object-cover transition-all group-hover:border-cyan-400 group-hover:scale-105 shadow-[0_0_15px_rgba(109,40,217,0.3)]"
                />
              </Link>
              <button onClick={handleLogout} className="hidden rounded-lg px-4 py-2 text-sm font-bold text-slate-400 transition-colors hover:bg-white/5 hover:text-white md:block">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Log In</Link>
              <Link to="/signup" className="rounded-full bg-white px-5 py-2 text-sm font-black text-black transition-transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;