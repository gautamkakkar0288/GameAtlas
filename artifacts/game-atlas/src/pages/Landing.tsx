import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { CinematicHero } from "@/components/landing/CinematicHero";
import { SearchBar } from "@/components/SearchBar";
import { Features } from "@/components/Features";
import { GameShowcase } from "@/components/GameShowcase";
import { Stats } from "@/components/Stats";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { ParticleSystem } from "@/components/ParticleSystem";
import { MouseLighting } from "@/components/MouseLighting";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const handleComplete = useCallback(() => setLoading(false), []);

  return (
    <SmoothScroll>
      <main className="min-h-screen bg-background text-foreground selection:bg-red-600 selection:text-white">
        <AnimatePresence mode="wait">
          {loading && <Preloader onComplete={handleComplete} />}
        </AnimatePresence>

        {!loading && (
          <>
            <MouseLighting />
            <ParticleSystem count={50} />
            <CinematicHero />
            <SearchBar />
            <Features />
            <GameShowcase />
            <Stats />
            <Footer />
          </>
        )}
      </main>
    </SmoothScroll>
  );
}
