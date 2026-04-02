"use client";

import Link from "next/link";
import { usePathname, redirect } from "next/navigation";
import { LayoutDashboard, TerminalSquare, User, Trophy, Code2 } from "lucide-react";
import { useUser, UserButton } from "@clerk/nextjs";
import { HackifyScoreRing } from "@/components/shared/HackifyScoreRing";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  if (isLoaded && user && (user.publicMetadata as any).role === "RECRUITER") {
    redirect("/recruiter");
  }

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Challenges", href: "/challenge", icon: TerminalSquare },
    { name: "Profile", href: "/profile/alexchen", icon: User },
    { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surface bg-surface/50 flex flex-col hidden md:flex backdrop-blur-md">
        <div className="p-6 flex items-center gap-2 font-display font-bold text-xl tracking-tight text-white">
          <Code2 size={24} className="text-primary" /> Hackify.
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary shadow-[inset_2px_0_10px_rgba(108,58,255,0.2)] border-l-2 border-primary"
                    : "text-text-muted hover:text-text-primary hover:bg-surface"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Score at bottom */}
        <div className="p-6 border-t border-surface flex flex-col items-center">
          <HackifyScoreRing score={842} size={80} strokeWidth={6} />
          <div className="mt-4 text-center">
            <h4 className="font-bold text-sm">Alex Chen</h4>
            <div className="text-xs text-text-muted flex items-center gap-1 justify-center mt-1">
              Top 15% <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden focus:outline-none bg-background relative z-0">
        <div className="absolute inset-0 grid-bg opacity-30 select-none z-0 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
