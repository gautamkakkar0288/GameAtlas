import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { auth } from "@/lib/auth";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      setLocation("/login");
    }
  }, [location, setLocation]);

  if (!auth.isAuthenticated()) return null;

  return (
    <div className="min-h-[100dvh] bg-[#050505] text-white flex relative overflow-hidden">
      {/* Animated subtle grid background */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col md:pl-16 relative z-10 transition-all duration-300">
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 pt-[60px] p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
