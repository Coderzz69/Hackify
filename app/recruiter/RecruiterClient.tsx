"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Filter, Bookmark, Star, UserPlus, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { HackifyScoreRing } from "@/components/shared/HackifyScoreRing";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";

interface RecruiterClientProps {
  initialDevelopers: any[];
}

export default function RecruiterClient({ initialDevelopers }: RecruiterClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minScore, setMinScore] = useState(750);

  // In a real scenario, this filtering would move to URL search params 
  // or a server-side search action for max security.
  const filteredDevelopers = initialDevelopers.filter(dev => {
    const matchesSearch = 
      dev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dev.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dev.skills || []).some((s: any) => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesScore = (dev.overallScore || 0) >= minScore;
    
    return matchesSearch && matchesScore;
  });

  return (
    <div className="flex h-screen bg-background overflow-hidden animate-in fade-in duration-500 relative">
      <div className="absolute inset-0 grid-bg opacity-30 select-none z-0 pointer-events-none" />

      {/* Main Column */}
      <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
        
        {/* Navigation / Header */}
        <header className="h-16 px-6 border-b border-surface flex items-center justify-between shrink-0 bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
             <Link href="/" className="text-text-muted hover:text-white"><ArrowLeft size={16} /></Link>
             <div className="w-[1px] h-6 bg-surface" />
             <div className="font-display font-bold text-lg text-primary tracking-tight">Hackify<span className="text-accent">Recruit</span></div>
          </div>
          <button 
             onClick={() => setSidebarOpen(!sidebarOpen)}
             className="flex items-center gap-2 text-sm font-semibold text-text-primary px-3 py-1.5 rounded-lg border border-surface hover:bg-surface transition-colors"
          >
             <Bookmark size={16} /> Saved ({sidebarOpen ? "Open" : "3"})
          </button>
        </header>

        {/* FilterBar (Sticky Top) */}
        <div className="p-4 px-6 border-b border-[rgba(108,58,255,0.2)] bg-surface/50 backdrop-blur-md shadow-glow sticky top-0 z-20 flex flex-col sm:flex-row gap-4 items-center shrink-0">
          <div className="relative flex-1">
             <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? "text-primary shadow-glow" : "text-text-muted"}`} />
             <input 
                type="text" 
                placeholder="Search verified developers by skill, name or stack..." 
                className="w-full bg-background border border-surface rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 text-white placeholder-text-muted/50 transition-all font-mono"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex flex-col">
               <span className="text-[10px] text-text-muted uppercase font-bold ml-1 mb-1">Min Score</span>
               <select 
                  className="bg-background border border-surface rounded-lg px-4 py-2 text-sm font-semibold hover:border-primary/50 transition-colors appearance-none cursor-pointer text-accent font-mono"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
               >
                 <option value={0}>Any Score</option>
                 <option value={700}>700+</option>
                 <option value={750}>750+</option>
                 <option value={800}>800+</option>
                 <option value={900}>900+</option>
               </select>
             </div>
             
             <div className="flex flex-col">
               <span className="text-[10px] text-text-muted uppercase font-bold ml-1 mb-1">Status</span>
               <button className="flex items-center gap-2 bg-background border border-surface rounded-lg px-4 py-2 text-sm font-semibold hover:border-primary/50 transition-colors">
                 <Filter size={14} /> Verified Only
               </button>
             </div>
          </div>
        </div>

        {/* Developer Card Grid */}
        <main className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <AnimatePresence mode="popLayout">
               {filteredDevelopers.map((dev: any, i: number) => (
                  <motion.div 
                     layout
                     key={dev.id}
                     className="hackify-card flex flex-col p-6"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ duration: 0.2 }}
                  >
                   <div className="flex justify-between items-start mb-6 border-b border-surface pb-6">
                      <div className="flex gap-4">
                         <img src={dev.image || `https://i.pravatar.cc/150?u=${dev.id}`} alt={dev.name} className="w-14 h-14 rounded-full border border-primary/30" />
                         <div>
                            <h3 className="font-bold text-lg mb-0.5">{dev.name}</h3>
                            <p className="text-text-muted text-sm font-mono leading-none">@{dev.username}</p>
                            <div className="mt-2">
                               <VerifiedBadge />
                            </div>
                         </div>
                      </div>
                      <button className="text-text-muted hover:text-accent transition-colors"><Bookmark size={20} /></button>
                   </div>
                   
                   <div className="flex items-center justify-between mb-8 px-2">
                      <HackifyScoreRing score={dev.overallScore || 0} size={80} strokeWidth={5} />
                      <div className="flex-1 ml-6 space-y-3">
                         {(dev.skills || []).slice(0, 3).map((skill: any) => (
                            <div key={skill.name} className="flex justify-between items-center text-sm font-mono border-b border-surface/50 pb-1">
                               <span>{skill.name}</span>
                               <span className="text-accent font-bold">{skill.value}</span>
                            </div>
                         ))}
                      </div>
                   </div>

                   <div className="flex gap-3 mt-auto">
                      <Link href={`/profile/${dev.publicSlug || dev.username}`} className="flex-1 btn-secondary text-sm !py-2 border-surface flex items-center justify-center gap-2">
                         <Search size={14} /> Full Profile
                      </Link>
                      <button className="flex-1 btn-primary text-sm !py-2 flex items-center justify-center gap-2">
                         <UserPlus size={14} /> Outreach
                      </button>
                   </div>
                </motion.div>
               ))}
             </AnimatePresence>
             
             {filteredDevelopers.length === 0 && (
               <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mb-6 text-text-muted">
                    <Search size={32} />
                 </div>
                 <h3 className="text-xl font-bold mb-2">No developers found</h3>
                 <p className="text-text-muted">Try adjusting your search filters or minimum score.</p>
               </div>
             )}
          </div>
        </main>
      </div>

      {/* Saved Candidates Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside 
            className="w-80 border-l border-[rgba(108,58,255,0.2)] shadow-[-10px_0_30px_rgba(108,58,255,0.1)] bg-background/90 backdrop-blur-xl relative z-40 shrink-0 flex flex-col"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          >
            <div className="p-6 border-b border-surface">
              <h3 className="font-display font-bold text-lg flex items-center gap-2">
                 <Star className="text-accent" size={18} /> Shortlisted
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {initialDevelopers.slice(0, 2).map((dev: any) => (
                 <div key={dev.id} className="bg-surface/50 border border-surface p-4 rounded-lg flex items-center gap-4 hover:border-primary/30 cursor-pointer transition-colors group">
                    <img src={dev.image} alt={dev.name} className="w-10 h-10 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                    <div className="flex-1">
                       <h4 className="font-bold text-sm">{dev.name}</h4>
                       <span className="font-mono text-xs text-primary">{dev.overallScore} pts</span>
                    </div>
                 </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-surface">
               <button className="btn-primary w-full shadow-glow">Export to ATS</button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Upgrade Banner (Sticky Bottom) */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <div className="max-w-4xl mx-auto banner-container bg-surface border border-primary/50 shadow-glow-lg rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-lg">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary"><SlidersHorizontal size={18} /></div>
              <div>
                <h4 className="font-bold text-sm text-white">Unlock Deep Filtering</h4>
                <p className="text-xs text-text-muted">Pro accounts can filter by exact framework versions and verified architecture skills.</p>
              </div>
           </div>
           <button className="btn-primary !py-2 !px-4 text-sm whitespace-nowrap border-r-2 border-b-2 border-background/50 outline outline-1 outline-primary">
             Upgrade to Pro
           </button>
        </div>
      </motion.div>
    </div>
  );
}
