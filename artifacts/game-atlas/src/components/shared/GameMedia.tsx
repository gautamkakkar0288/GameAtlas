import { useState } from "react";
import { Gamepad2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GameMediaProps {
  src?: string | null;
  alt: string;
  className?: string;
  aspectRatio?: "3/4" | "16/9" | "square" | "video" | "auto";
  priority?: boolean;
  genre?: string;
  title?: string;
  fallbackIcon?: React.ReactNode;
}

export function GameMedia({
  src,
  alt,
  className = "",
  aspectRatio = "3/4",
  priority = false,
  genre,
  title,
  fallbackIcon,
}: GameMediaProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(!src);

  const aspectClass =
    aspectRatio === "3/4"
      ? "aspect-[3/4]"
      : aspectRatio === "16/9" || aspectRatio === "video"
      ? "aspect-video"
      : aspectRatio === "square"
      ? "aspect-square"
      : "";

  if (error || !src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden flex flex-col items-center justify-center p-4 select-none bg-gradient-to-br from-[#1c0808] via-[#0d0d0d] to-[#050505] border border-white/5",
          aspectClass,
          className
        )}
      >
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:12px_12px]" />
        <div className="relative z-10 flex flex-col items-center text-center gap-2">
          {fallbackIcon || (
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/20 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <Gamepad2 size={20} />
            </div>
          )}
          {title && (
            <span className="font-orbitron font-bold text-xs text-white line-clamp-2 px-2">
              {title}
            </span>
          )}
          {genre && (
            <span className="font-rajdhani uppercase text-[10px] tracking-wider text-red-400/80 font-semibold px-2 py-0.5 rounded bg-red-950/30 border border-red-500/20">
              {genre}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-white/5", aspectClass, className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <Gamepad2 size={20} className="text-white/10 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          !loaded ? "opacity-0 scale-95" : "opacity-100 scale-100"
        )}
      />
    </div>
  );
}
