"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, TerminalSquare, CheckCircle2, Lock, ArrowLeft, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import Link from "next/link";
import { HackifyScoreRing } from "@/components/shared/HackifyScoreRing";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";

interface ProfileClientProps {
  user: any;
  skillGraph: any;
  insights: any;
}

export default function ProfileClient({ user, skillGraph, insights }: ProfileClientProps) {
  const [copied, setCopied] = useState(false);
  
  const radarData = (skillGraph?.skills || []).map((s: any) => ({
    subject: s.name,
    A: s.value,
    fullMark: 100,
  }));

  const copyBadgeCode = () => {
    navigator.clipboard.writeText(`<a href="https://hackify.dev/${user.username}"><img src="https://hackify.dev/api/badge/${user.username}" alt="Hackify Score" /></a>`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background relative animate-in fade-in pb-20">
      
      {/* Top Navbar */}
      <nav className="h-16 border-b border-surface/50 backdrop-blur-md sticky top-0 z-50 px-6 flex items-center justify-between">
         <Link href="/dashboard" className="text-text-muted hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Back
         </Link>
         <div className="font-display font-bold text-lg text-primary tracking-tight">Hackify.</div>
         <div className="w-16" /> {/* Spacer */}
      </nav>

      {/* Hero Section / Profile Header */}
      <div className="relative pt-20 pb-24 overflow-hidden flex flex-col items-center justify-center text-center">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-radial opacity-30 select-none z-0 pointer-events-none" />
        
        <motion.div 
          className="relative z-10 flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative mb-6">
            <HackifyScoreRing score={skillGraph?.overallScore || 0} size={150} strokeWidth={8} />
            <img 
              src={user?.image || "https://i.pravatar.cc/150"} 
              alt={user?.name} 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-2 border-surface shadow-[0_0_20px_rgba(108,58,255,0.4)]"
            />
          </div>
          
          <div className="flex items-center gap-3 justify-center mb-2">
            <h1 className="text-4xl font-display font-bold text-white">{user?.name}</h1>
            {skillGraph?.overallScore > 0 && <VerifiedBadge />}
            {skillGraph?.overallScore > 0 && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold border border-accent/20">
                <Sparkles size={10} /> AI VERIFIED
              </span>
            )}
          </div>
          
          <p className="text-text-muted font-mono mb-8">@{user?.username}</p>
          
          <div className="flex gap-4">
             <button className="btn-primary">Connect</button>
             <button className="btn-secondary">Message</button>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        
        {/* Left Column */}
        <div className="md:col-span-1 space-y-8">
          
          {/* Embeddable Badge */}
          <motion.div 
            className="hackify-glass p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4">Embed Badge</h3>
            <div className="p-4 border border-surface rounded-lg bg-background flex flex-col items-center justify-center mb-4">
               <div className="flex items-center gap-2 font-mono text-sm border-2 border-primary/30 rounded-md px-3 py-1 bg-primary/10 text-primary">
                 <TerminalSquare size={14} /> Hackify Score: {skillGraph?.overallScore || 0}
               </div>
            </div>
            <button 
              onClick={copyBadgeCode}
              className="w-full flex justify-center items-center gap-2 py-2 border border-border-glow rounded-md text-sm font-semibold hover:bg-surface/50 transition-colors"
            >
              {copied ? <CheckCircle2 size={16} className="text-accent" /> : <Copy size={16} />}
              {copied ? "Copied HTML!" : "Copy Snippet"}
            </button>
          </motion.div>

          {/* Skill Radar */}
          <motion.div 
            className="hackify-glass p-6 h-[300px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-4 text-center">Skill Matrix</h3>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData}>
                <PolarGrid stroke="rgba(136, 136, 170, 0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#8888AA', fontSize: 11 }} />
                <Radar name={user?.name} dataKey="A" stroke="#00F5A0" fill="#00F5A0" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Right Column - AI Analysis & Evaluation Timeline */}
        <div className="md:col-span-2 space-y-8">
           
           {/* AI Skills Analysis */}
           <motion.div 
             className="hackify-glass p-8 relative overflow-hidden group"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
           >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <Sparkles size={120} className="text-primary" />
             </div>
             
             <div className="flex items-center gap-3 mb-6">
               <div className="p-2 bg-primary/20 rounded-lg text-primary shadow-[0_0_15px_rgba(108,58,255,0.3)]">
                 <Sparkles size={20} />
               </div>
               <div>
                 <h3 className="text-xl font-display font-bold text-white leading-tight">AI Skills Analysis</h3>
                 <p className="text-xs text-text-muted uppercase tracking-widest font-mono">Verified Intelligence Report</p>
               </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
               <div>
                 <div className="flex items-center gap-2 text-accent mb-4">
                   <TrendingUp size={16} />
                   <span className="text-sm font-bold uppercase tracking-wider">Key Strengths</span>
                 </div>
                 <ul className="space-y-3">
                   {(insights?.strengths || []).map((strength: string, i: number) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-text-primary group/item">
                       <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#00F5A0]" />
                       <span className="leading-relaxed">{strength}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <div>
                 <div className="flex items-center gap-2 text-primary mb-4">
                   <AlertCircle size={16} />
                   <span className="text-sm font-bold uppercase tracking-wider">Focus Areas</span>
                 </div>
                 <ul className="space-y-3">
                   {(insights?.areasForImprovement || []).map((area: string, i: number) => (
                     <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                       <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#6C3AFF]" />
                       <span className="leading-relaxed">{area}</span>
                     </li>
                   ))}
                 </ul>
               </div>
             </div>

             <div className="mt-8 pt-6 border-t border-surface/50 flex items-center justify-between">
                <div className="text-[10px] text-text-muted font-mono uppercase tracking-[0.2em]">Model: Hackify-Eval-v2</div>
                <div className="text-[10px] text-accent font-mono uppercase tracking-[0.2em] flex items-center gap-2">
                  <CheckCircle2 size={10} /> 99.4% Confidence Score
                </div>
             </div>
           </motion.div>

           <h3 className="text-2xl font-display font-bold mb-6 pt-4">Evaluation Timeline</h3>
           
           <div className="space-y-4">
             {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  className="hackify-card p-6 flex flex-col sm:flex-row sm:items-center justify-between"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                >
                  <div className="mb-4 sm:mb-0">
                    <h4 className="font-bold text-lg">{i === 1 ? "Rate Limiter Pipeline" : i === 2 ? "Optimized React Table" : "Data ETL Pipeline"}</h4>
                    <div className="flex items-center gap-3 mt-2 text-sm">
                      <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{i === 2 ? "React" : "TypeScript"}</span>
                      <span className="text-text-muted border-l border-surface pl-3">{i * 2} days ago</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-white mb-1">+{Math.floor(Math.random() * 40) + 10}</div>
                    <div className="text-xs text-accent">Score Yield</div>
                  </div>
                </motion.div>
             ))}
           </div>

           {/* Recruiter Unlock Overlay */}
           <div className="relative mt-8 group cursor-pointer overflow-hidden rounded-xl border border-border-glow shadow-glow-lg">
             <div className="absolute inset-0 bg-surface/40 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center transition-all bg-gradient-to-t from-background via-surface/80 to-transparent">
               <Lock className="text-primary mb-3 drop-shadow-glow" size={32} />
               <h3 className="text-xl font-bold text-white mb-2">Detailed Tech Breakdown</h3>
               <p className="text-text-muted text-sm max-w-sm">Upgrade to Recruiter Pro to view specific algorithm choices, time taken, and line-by-line playback.</p>
               <button className="btn-primary mt-6 text-sm">Upgrade to Pro</button>
             </div>
             
             {/* Fake blurred background content */}
             <div className="p-6 opacity-30 select-none blur-sm space-y-4 filter pointer-events-none">
                <div className="h-6 bg-surface-bright rounded w-1/3"></div>
                <div className="h-20 bg-surface-bright rounded w-full"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-surface-bright rounded"></div>
                  <div className="h-16 bg-surface-bright rounded"></div>
                </div>
             </div>
           </div>

        </div>

      </div>

    </div>
  );
}
