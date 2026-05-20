import { useState } from 'react';
import { Game } from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Clock, Star } from 'lucide-react';
import { SiSteam, SiEpicgames, SiRiotgames } from "react-icons/si";

interface GameCardProps {
  game: Game;
  size: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

const PlatformIcon = ({ platform, className = "" }: { platform: string, className?: string }) => {
  switch (platform) {
    case 'Steam': return <SiSteam className={`text-[#66c0f4] ${className}`} />;
    case 'Epic': return <SiEpicgames className={`text-white ${className}`} />;
    case 'Riot': return <SiRiotgames className={`text-[#eb0029] ${className}`} />;
    default: return null;
  }
};

export function GameCard({ game, size, onClick, className }: GameCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (size !== 'md') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 15, y: -x * 15 });
  };

  const handleMouseLeave = () => {
    if (size !== 'md') return;
    setTilt({ x: 0, y: 0 });
  };

  if (size === 'sm') {
    return (
      <div 
        onClick={onClick}
        className={cn("group cursor-pointer w-[150px] shrink-0", className)}
      >
        <div className="aspect-[3/4] rounded-xl overflow-hidden border border-white/10 group-hover:border-red-500/50 group-hover:shadow-[0_0_15px_rgba(139,0,0,0.3)] transition-all duration-300">
          <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <h3 className="font-rajdhani font-bold text-white mt-2 truncate text-sm">{game.title}</h3>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div 
        onClick={onClick}
        className={cn("group cursor-pointer w-full bg-[rgba(13,13,13,0.6)] backdrop-blur-md border border-[rgba(139,0,0,0.2)] hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(139,0,0,0.3)] rounded-xl overflow-hidden flex transition-all duration-300", className)}
      >
        <div className="w-[120px] md:w-[180px] shrink-0 aspect-[3/4]">
          <img src={game.coverUrl} alt={game.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="p-4 flex flex-col justify-center flex-1">
          <div className="flex items-center gap-2 mb-2">
            <PlatformIcon platform={game.platform} />
            <span className="font-rajdhani text-xs text-gray-400 uppercase tracking-wider font-bold">{game.genre}</span>
          </div>
          <h3 className="font-orbitron font-bold text-xl text-white mb-2 line-clamp-1">{game.title}</h3>
          <p className="font-inter text-sm text-gray-400 line-clamp-2 mb-4">{game.description}</p>
          <div className="flex items-center gap-4 mt-auto">
            <div className="flex items-center gap-1 font-inter text-xs text-gray-300"><Clock size={14} className="text-red-400" /> {game.playtime}h</div>
            <div className="flex items-center gap-1 font-inter text-xs text-gray-300"><Star size={14} className="text-yellow-400" /> {game.rating}</div>
          </div>
        </div>
      </div>
    );
  }

  // md size
  return (
    <div 
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("group cursor-pointer w-[200px] shrink-0 aspect-[3/4] relative rounded-xl overflow-hidden border border-white/10 hover:border-red-500/50 transition-all duration-300", className)}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out',
        transformStyle: 'preserve-3d'
      }}
    >
      <img src={game.coverUrl} alt={game.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur rounded p-1.5 border border-white/10 shadow-lg z-10">
        <PlatformIcon platform={game.platform} />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
      
      <div className="absolute inset-0 z-20 p-4 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 font-inter text-xs text-white"><Clock size={14} className="text-red-400" /> {game.playtime}h</div>
          <div className="flex items-center gap-1 font-inter text-xs text-white"><Star size={14} className="text-yellow-400" /> {game.rating}</div>
        </div>
        <button className="px-6 py-2 bg-red-600 text-white font-rajdhani uppercase font-bold tracking-widest rounded shadow-[0_0_15px_rgba(139,0,0,0.5)] border border-red-400">
          VIEW
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 z-20 group-hover:opacity-0 transition-opacity duration-300">
        <span className="font-rajdhani text-[10px] uppercase tracking-wider text-red-400 font-bold">{game.genre}</span>
        <h3 className="font-orbitron text-sm font-bold text-white truncate">{game.title}</h3>
      </div>
    </div>
  );
}
