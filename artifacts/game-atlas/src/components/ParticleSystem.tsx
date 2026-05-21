import { useEffect, useRef } from "react";

interface ParticleSystemProps {
  count?: number;
}

export function ParticleSystem({ count = 50 }: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; opacitySpeed: number }> = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isMobile = window.innerWidth < 768;
    const actualCount = isMobile ? Math.floor(count / 3) : count;

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < actualCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5 - 0.2, // Drift upwards
          opacity: Math.random(),
          opacitySpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed;

        if (p.opacity > 1 || p.opacity < 0) {
          p.opacitySpeed *= -1;
        }
        
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 42, 42, ${Math.max(0, Math.min(1, p.opacity)) * 0.5})`;
        ctx.fill();
        
        // Add a subtle glow to some particles
        if (p.size > 1.5) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 42, 42, 0.8)';
        } else {
          ctx.shadowBlur = 0;
        }
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener("resize", resize);
    resize();
    initParticles();
    drawParticles();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-50"
    />
  );
}
