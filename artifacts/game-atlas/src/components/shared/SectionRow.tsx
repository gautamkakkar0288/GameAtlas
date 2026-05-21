import { useRef, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SectionRowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SectionRow({ title, subtitle, children }: SectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = dir === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative group">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="font-orbitron font-bold text-2xl text-white tracking-widest border-l-4 border-red-600 pl-3 uppercase">
            {title}
          </h2>
          {subtitle && <p className="font-rajdhani text-gray-400 font-semibold tracking-wider uppercase text-sm mt-1">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => scroll('left')} className="p-2 rounded-full bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-white transition-colors border border-white/10 hover:border-red-500/50">
            <ChevronLeft size={20} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 rounded-full bg-white/5 hover:bg-red-600/20 hover:text-red-400 text-white transition-colors border border-white/10 hover:border-red-500/50">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </section>
  );
}
