import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

// --- MOCK DATA ---
const HERO_GAMES = [
  {
    id: 1,
    title: "Elden Ring",
    tag: "GAME OF THE YEAR",
    platform: "Steam",
    genre: "Action RPG",
    rating: "9.5",
    discount: "40% OFF",
    price: "₹3,299",
    salePrice: "₹1,979",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_hero.jpg",
  },
  {
    id: 2,
    title: "God of War",
    tag: "CRITICALLY ACCLAIMED",
    platform: "Steam",
    genre: "Action Adventure",
    rating: "9.8",
    discount: "25% OFF",
    price: "₹3,999",
    salePrice: "₹2,999",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/library_hero.jpg",
  },
  {
    id: 3,
    title: "GTA V",
    tag: "BESTSELLER",
    platform: "Steam",
    genre: "Open World",
    rating: "9.2",
    discount: "60% OFF",
    price: "₹1,099",
    salePrice: "₹439",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/library_hero.jpg",
  },
  {
    id: 4,
    title: "Valorant",
    tag: "FREE TO PLAY",
    platform: "Epic",
    genre: "Tactical Shooter",
    rating: "8.7",
    discount: null,
    price: "Free",
    salePrice: null,
    image: "/images/valorant.jpg",
  },
];

const STORY_DATA = [
  {
    id: 1,
    text: "Explore vast open worlds...",
    game: "Elden Ring",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
  },
  {
    id: 2,
    text: "Fight alongside legends...",
    game: "God of War",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg",
  },
  {
    id: 3,
    text: "Create chaos in living cities...",
    game: "GTA V",
    image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/header.jpg",
  },
  {
    id: 4,
    text: "Compete in intense battles...",
    game: "Valorant",
    image: "/images/valorant.jpg",
  },
];

const RECOMMENDED_GAMES = [
  { id: 5, title: "Ghost of Tsushima", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", platform: "Steam", price: "₹3,999", rating: "4.8" },
  { id: 6, title: "Hades II", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80", platform: "Epic", price: "₹1,200", rating: "4.9" },
  { id: 7, title: "Starfield", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80", platform: "Steam", price: "₹2,499", rating: "3.8" },
  { id: 8, title: "Baldur's Gate 3", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=800&q=80", platform: "Steam", price: "₹2,999", rating: "5.0" },
];

const TRENDING_GAMES = [
  { id: 1, title: "Helldivers 2", players: "450K Players Online", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=80" },
  { id: 2, title: "Palworld", players: "320K Players Online", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=200&q=80" },
  { id: 3, title: "Cyberpunk 2077", players: "180K Players Online", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=200&q=80" },
  { id: 4, title: "Apex Legends", players: "150K Players Online", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=200&q=80" },
];

const CATEGORIES = [
  { id: 1, title: "Action", count: "1,204 Games", image: "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=600&q=80" },
  { id: 2, title: "RPG", count: "843 Games", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80" },
  { id: 3, title: "FPS", count: "512 Games", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=600&q=80" },
  { id: 4, title: "Strategy", count: "329 Games", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80" }
];

// --- COMPONENTS ---
const MotionDiv = motion.div;
const MotionImg = motion.img;

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 900], [0, 160]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_GAMES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const game = HERO_GAMES[current];

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#04050F] text-[#F8FAFC]">
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <MotionDiv
            key={current}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            transition={{ duration: 1.15, ease: "easeOut" }}
            style={{ y }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${game.image})` }}
            />
          </MotionDiv>
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#04050F] via-[#04050F]/80 to-transparent md:w-2/3" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#04050F] via-transparent to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#04050F]/90 via-transparent to-[#04050F]/80" />

      {/* Container with increased horizontal padding for breathing room */}
      <div className="relative z-20 mx-auto flex min-h-screen w-full max-w-[90rem] flex-col justify-center px-6 pt-32 pb-20 md:px-16 lg:px-24">
        <MotionDiv
          key={`content-${current}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-2xl lg:max-w-3xl"
        >
          <span className="mb-6 inline-block rounded-full border border-purple-400/30 bg-purple-900/35 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-purple-200 uppercase backdrop-blur-md">
            {game.tag}
          </span>

          <h1 className="mb-6 text-5xl leading-tight font-black tracking-tight text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.55)] md:text-6xl lg:text-7xl">
            Step Into Worlds
            <br />
            <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Beyond Reality
            </span>
          </h1>

          <p className="mb-8 max-w-xl text-base leading-relaxed font-light text-slate-200/90 md:text-lg">
            Discover, play, and experience the best games across platforms.
          </p>

          <div className="mb-8 flex flex-wrap items-center gap-3 text-xs font-semibold tracking-wide text-slate-200 md:text-sm">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              {game.platform}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-md">
              {game.genre}
            </span>
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1.5 text-amber-300">
              ★ {game.rating}
            </span>
            {game.discount && (
              <span className="rounded-full border border-pink-300/35 bg-pink-500/20 px-3 py-1.5 text-pink-300">
                {game.discount}
              </span>
            )}
          </div>

          <div className="mb-10 flex items-end gap-4">
            {game.salePrice ? (
              <>
                <span className="text-lg text-slate-400 line-through">{game.price}</span>
                <span className="text-4xl font-extrabold text-emerald-300 md:text-5xl">{game.salePrice}</span>
              </>
            ) : (
              <span className="text-4xl font-extrabold text-emerald-300 md:text-5xl">{game.price}</span>
            )}
          </div>

          <MotionDiv className="flex flex-wrap gap-4">
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/library"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#6D28D9] to-[#EC4899] px-8 py-3.5 text-base font-bold text-white shadow-[0_0_24px_rgba(109,40,217,0.45)] transition-all duration-300 hover:shadow-[0_0_36px_rgba(236,72,153,0.6)]"
              >
                ▶ Explore Games
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-base font-bold text-slate-100 backdrop-blur-md transition-all duration-300 hover:bg-white/15"
              >
                Start Playing →
              </Link>
            </motion.div>
          </MotionDiv>
        </MotionDiv>
      </div>

      <div className="absolute right-6 bottom-10 z-20 flex gap-2.5 md:right-16 lg:right-24">
        {HERO_GAMES.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-500 ${idx === current
              ? "w-12 bg-gradient-to-r from-purple-400 to-pink-400"
              : "w-2 bg-white/30 hover:w-7 hover:bg-white/60"
              }`}
            aria-label={`Go to ${item.title}`}
          />
        ))}
      </div>
    </section>
  );
};

const StorySection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      const index = Math.min(Math.floor(latest * STORY_DATA.length), STORY_DATA.length - 1);
      if (index >= 0 && index !== activeIndex) {
        setActiveIndex(index);
      }
    });
  }, [scrollYProgress, activeIndex]);

  return (
    <section ref={containerRef} className="relative bg-[#04050F] py-32 text-white">
      <div className="pointer-events-none absolute top-10 right-0 h-64 w-64 rounded-full bg-fuchsia-600/10 blur-[130px]" />
      <div className="pointer-events-none absolute bottom-10 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-[140px]" />

      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-16 lg:px-24">
        <div className="mb-16 md:mb-24">
          <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-purple-300 uppercase">
            Immersive Storytelling
          </p>
          <h2 className="max-w-3xl text-4xl leading-tight font-black tracking-tight md:text-5xl lg:text-6xl">
            Scroll Through Worlds Built to Pull You In
          </h2>
        </div>

        <div className="relative flex h-[180vh] flex-col gap-12 md:flex-row md:gap-16">
          {/* Left Text Container */}
          <div className="sticky top-32 h-fit w-full md:w-1/2">
            <AnimatePresence mode="wait">
              <MotionDiv
                key={activeIndex}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md md:p-10 lg:p-12"
              >
                <p className="mb-5 text-sm font-medium tracking-[0.18em] text-slate-300 uppercase">
                  Chapter {activeIndex + 1}
                </p>
                <h3 className="mb-6 text-3xl leading-tight font-bold text-slate-100 md:text-4xl lg:text-5xl">
                  "{STORY_DATA[activeIndex].text}"
                </h3>
                <p className="text-lg text-slate-300 md:text-xl">
                  Experience it in{" "}
                  <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text font-bold text-transparent">
                    {STORY_DATA[activeIndex].game}
                  </span>
                </p>
              </MotionDiv>
            </AnimatePresence>
          </div>

          {/* Right Image Container - Fixed the zoomed issue by using aspect-video instead of fixed height */}
          <div className="sticky top-32 w-full md:w-1/2 aspect-video lg:max-h-[500px]">
            <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
              <AnimatePresence mode="wait">
                <MotionImg
                  key={activeIndex}
                  src={STORY_DATA[activeIndex].image}
                  alt={STORY_DATA[activeIndex].game}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#04050F]/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturedGames = () => {
  return (
    <section className="relative bg-[#04050F] py-24 text-white">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-16 lg:px-24">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4 md:mb-16">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-cyan-300 uppercase">
              Featured Collection
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Tonight&apos;s Premium Picks</h2>
          </div>
          <Link
            to="/library"
            className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur transition-colors hover:bg-white/10"
          >
            Browse Full Library
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {HERO_GAMES.map((game, idx) => (
            <motion.article
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            >
              {/* Changed from fixed height to aspect ratio to prevent zoom/crop issues */}
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 rounded-full border border-pink-300/35 bg-pink-400/20 px-3 py-1 text-xs font-bold tracking-wide text-pink-200 backdrop-blur-md">
                  {game.discount || "HOT DROP"}
                </div>
              </div>

              <div className="flex flex-1 flex-col space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold tracking-tight text-slate-50 line-clamp-1">{game.title}</h3>
                  <span className="whitespace-nowrap text-sm font-semibold text-amber-300 mt-0.5">★ {game.rating}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">
                    {game.platform}
                  </span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">
                    {game.genre}
                  </span>
                </div>

                <div className="mt-auto pt-2 flex items-end gap-3">
                  {game.salePrice ? (
                    <>
                      <span className="text-sm text-slate-400 line-through">{game.price}</span>
                      <span className="text-2xl font-extrabold text-emerald-400">{game.salePrice}</span>
                    </>
                  ) : (
                    <span className="text-2xl font-extrabold text-emerald-400">{game.price}</span>
                  )}
                </div>

                <Link
                  to={`/games/${game.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-purple-400/30 bg-gradient-to-r from-purple-600/30 to-pink-500/20 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(168,85,247,0.35)]"
                >
                  View Details
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

const Recommended = () => {
  return (
    <section className="relative bg-[#04050F] py-24 text-white border-t border-white/5">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-16 lg:px-24">
        <h2 className="mb-12 text-3xl font-black md:text-4xl">
          Because you played <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Action RPGs</span>
        </h2>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
          {RECOMMENDED_GAMES.map((game) => (
            <div key={game.id} className="min-w-[280px] md:min-w-[320px] snap-start">
              <div className="group relative bg-white/5 rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] border border-white/10 backdrop-blur-md">
                <div className="relative aspect-video w-full overflow-hidden">
                  <img src={game.image} alt={game.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-sm font-bold text-amber-300 flex items-center gap-1">
                    ★ {game.rating}
                  </div>
                  <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wider border border-white/20">
                    {game.platform}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-4 truncate group-hover:text-blue-400 transition-colors">{game.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-emerald-400">{game.price}</span>
                    <button className="text-sm bg-white/10 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors border border-white/10">View</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TrendingDiscounts = () => {
  return (
    <section className="relative bg-[#04050F] py-24 text-white">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Trending Now */}
        <div className="col-span-1 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-2">
            🔥 Trending Now
          </h2>
          <div className="space-y-6">
            {TRENDING_GAMES.map((item, index) => (
              <div key={item.id} className="flex items-center gap-4 group cursor-pointer p-2 rounded-xl hover:bg-white/5 transition-colors">
                <span className="text-2xl font-bold text-white/20 group-hover:text-blue-400 transition-colors">0{index + 1}</span>
                <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-slate-100 font-bold group-hover:text-blue-300 transition-colors truncate">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 truncate">{item.players}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Discounts Banner */}
        <div className="col-span-1 lg:col-span-2 relative rounded-2xl overflow-hidden group cursor-pointer border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.45)] h-full min-h-[400px]">
          <img
            src="https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80"
            alt="Sale Banner"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#04050F] via-[#04050F]/80 to-transparent flex flex-col justify-center p-8 md:p-14">
            <span className="bg-gradient-to-r from-red-600 to-pink-600 text-white text-xs font-bold px-4 py-1.5 rounded-full w-max mb-6 uppercase tracking-wider shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              Weekend Deal
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 drop-shadow-lg">
              Publisher Sale
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-md leading-relaxed">
              Up to 80% off on award-winning titles. Offer ends in 48 hours.
            </p>
            <button className="bg-white text-[#04050F] font-bold py-3.5 px-8 rounded-xl w-max hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Browse Offers →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

const Categories = () => {
  return (
    <section className="relative bg-[#04050F] py-24 text-white">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-16 lg:px-24">
        <h2 className="mb-12 text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Category</span></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="relative group overflow-hidden rounded-2xl cursor-pointer aspect-[4/3] sm:aspect-auto sm:h-56 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04050F] via-[#04050F]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-sm font-medium text-slate-400 mt-1">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CloudPromo = () => {
  return (
    <section className="relative bg-[#04050F] py-24 text-white">
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-16 lg:px-24">
        <div className="rounded-3xl bg-gradient-to-br from-blue-900/40 to-purple-900/20 border border-blue-500/30 p-12 md:p-24 text-center relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1200&q=80')] opacity-5 mix-blend-overlay"></div>
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-blue-500/20 blur-[120px]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              Play Instantly. <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">No Downloads.</span>
            </h2>
            <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience next-gen gaming directly in your browser with Game Atlas Cloud. High performance, zero wait time, pure gaming.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              Launch Cloud Gaming
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#020205] text-slate-400 py-16 px-6 md:px-16 lg:px-24 border-t border-white/10">
      <div className="max-w-[90rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-1">
          <h3 className="text-white text-2xl font-black tracking-tight mb-4">Game Atlas</h3>
          <p className="text-sm leading-relaxed text-slate-500 max-w-xs">The ultimate platform for discovering, buying, and playing the world's best games in one seamless ecosystem.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide">Platform</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Store</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Cloud Gaming</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Client Download</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide">Support</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-pink-400 transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-pink-400 transition-colors">Refunds</a></li>
            <li><a href="#" className="hover:text-pink-400 transition-colors">System Status</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wide">Legal</h4>
          <ul className="space-y-4 text-sm font-medium">
            <li><a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-[90rem] mx-auto pt-8 border-t border-white/10 text-sm font-medium text-slate-500 flex flex-col md:flex-row justify-between items-center gap-6">
        <p>© 2026 Game Atlas. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
          <span className="hover:text-white cursor-pointer transition-colors">Discord</span>
          <span className="hover:text-white cursor-pointer transition-colors">YouTube</span>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  return (
    <main className="min-h-screen bg-[#04050F] font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      <Hero />
      <StorySection />
      <FeaturedGames />
      <Recommended />
      <TrendingDiscounts />
      <Categories />
      <CloudPromo />
      <Footer />
    </main>
  );
};

export default Home;