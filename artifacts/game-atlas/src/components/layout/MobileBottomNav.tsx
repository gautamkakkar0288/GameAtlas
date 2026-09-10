import { Link, useLocation } from "wouter";
import { LayoutDashboard, Library, Compass, Gamepad2, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const [location] = useLocation();

  const items = [
    { label: "Home", path: "/dashboard", icon: LayoutDashboard },
    { label: "Discover", path: "/discover", icon: Compass },
    { label: "Library", path: "/library", icon: Library },
    { label: "Arcade", path: "/arcade", icon: Gamepad2 },
    { label: "Profile", path: "/profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[rgba(10,10,10,0.92)] backdrop-blur-xl border-t border-red-950/40 px-2 py-1.5 flex items-center justify-around safe-area-bottom shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      {items.map((item) => {
        const active = location === item.path || (item.path !== "/dashboard" && location.startsWith(item.path));
        const Icon = item.icon;
        return (
          <Link key={item.path} href={item.path}>
            <div
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer",
                active ? "text-red-500" : "text-gray-400 hover:text-gray-200"
              )}
            >
              <Icon size={18} className={cn(active && "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]")} />
              <span className="font-rajdhani text-[10px] uppercase font-bold tracking-wider mt-0.5">
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
