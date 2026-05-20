import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SkeletonCard({ size, className }: SkeletonCardProps) {
  const sizeClasses = {
    sm: 'w-[150px] h-[225px]',
    md: 'w-[200px] h-[300px]',
    lg: 'w-full h-[180px]'
  };

  return (
    <div 
      className={cn(
        "bg-[rgba(13,13,13,0.6)] backdrop-blur-md border border-[rgba(139,0,0,0.2)] rounded-xl relative overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite linear'
        }}
      />
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
