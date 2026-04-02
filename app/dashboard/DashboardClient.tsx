"use client";

import { motion } from "framer-motion";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { Terminal, TrendingUp, RefreshCw, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { syncAndAnalyzeDeveloper } from "@/lib/actions";

interface DashboardClientProps {
  user: any;
  skillGraph: any;
}

export default function DashboardClient({ user, skillGraph }: DashboardClientProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await syncAndAnalyzeDeveloper();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const radarData = (skillGraph?.skills || []).map((s: any) => ({
    subject: s.name,
    A: s.value,
    fullMark: 100,
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Hackify Score Card */}
        <motion.div 
          className="hackify-card p-8 flex-1 flex items-center justify-between relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Verified Skill Score</h2>
              {skillGraph?.overallScore > 0 && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold border border-accent/20">
                  <Sparkles size={10} /> AI VERIFIED
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-display font-bold text-white tracking-tight leading-none drop-shadow-[0_0_15px_rgba(108,58,255,0.4)]">
                {Math.round(skillGraph?.overallScore) || 0}
              </span>
              <button 
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-2 text-accent font-semibold bg-accent/10 hover:bg-accent/20 px-3 py-1.5 rounded-md text-sm transition-all border border-accent/20 disabled:opacity-50"
              >
                {isSyncing ? (
                   <RefreshCw size={16} className="animate-spin" />
                ) : (
                   <RefreshCw size={16} />
                )}
                {isSyncing ? "Analyzing..." : "Sync with AI"}
              </button>
            </div>
            <p className="mt-4 text-text-muted text-sm max-w-[200px]">
              Based on GitHub and LeetCode activity as of {new Date(skillGraph?.lastUpdated).toLocaleDateString()}.
            </p>
          </div>
          <div className="hidden sm:block opacity-10 group-hover:opacity-20 transition-opacity">
             <Terminal size={120} />
          </div>
          
          {/* Decorative glow */}
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        </motion.div>

        {/* Skill Radar Chart */}
        <motion.div 
          className="hackify-card p-6 flex-1 h-[250px] relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
           <ResponsiveContainer width="100%" height="100%">
             <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
               <PolarGrid stroke="rgba(136, 136, 170, 0.2)" />
               <PolarAngleAxis dataKey="subject" tick={{ fill: '#8888AA', fontSize: 12 }} />
               <Radar name={user?.name || "Dev"} dataKey="A" stroke="#00F5A0" fill="#00F5A0" fillOpacity={0.2} strokeWidth={2} />
             </RadarChart>
           </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Challenge Banner */}
      <motion.div 
        className="glass-panel p-6 border-l-4 border-l-accent flex flex-col sm:flex-row items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div>
          <h3 className="text-xl font-bold text-white mb-2">New Challenge Available: Distributed Cache</h3>
          <p className="text-text-muted text-sm">Complete this System Design task to boost your score.</p>
        </div>
        <Link href="/challenge" className="btn-primary mt-4 sm:mt-0 whitespace-nowrap">
          Start Challenge
        </Link>
      </motion.div>

      {/* Skill Card Grid */}
      <div>
        <h3 className="text-lg font-bold mb-4 font-display">Core Competencies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(skillGraph?.skills || []).map((skill: any, i: number) => (
            <motion.div 
              key={skill.name}
              className="hackify-card p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + (i * 0.05) }}
            >
              <div className="flex justify-between items-end mb-4">
                <span className="font-semibold">{skill.name}</span>
                <span className="font-mono text-xl text-primary font-bold">{skill.value}</span>
              </div>
              <div className="w-full bg-surface-bright h-2 rounded-full overflow-hidden bg-surface-container">
                <motion.div 
                  className="h-full bg-cyber-gradient"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.value}%` }}
                  transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* AI Insights & Detailed Analysis */}
      {skillGraph?.overallScore > 0 && (
        <motion.div 
          className="hackify-glass p-8 relative overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg text-primary shadow-[0_0_15px_rgba(108,58,255,0.3)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-xl font-display font-bold text-white leading-tight">Hackify AI Analysis</h3>
              <p className="text-xs text-text-muted uppercase tracking-widest font-mono">Verified Intelligence Report</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
               <div>
                 <h4 className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Technical Bio</h4>
                 <p className="text-sm text-text-primary leading-relaxed bg-surface/30 p-4 rounded-lg border border-surface">
                   {user.profile?.bio || "No insights generated yet. Click 'Sync with AI' to begin verification."}
                 </p>
               </div>
               
               <div className="p-4 rounded-lg border border-[rgba(0,245,160,0.2)] bg-accent/5">
                 <h4 className="text-xs font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                    <TrendingUp size={12} /> Key Strengths
                 </h4>
                 <div className="flex flex-wrap gap-2">
                    {(skillGraph?.skills || []).slice(1).map((s: any) => (
                      <span key={s.name} className="px-2 py-1 bg-accent/10 text-accent rounded text-[10px] font-mono border border-accent/20">
                        {s.name}
                      </span>
                    ))}
                 </div>
               </div>
            </div>

            <div className="space-y-6">
               <div className="flex flex-col gap-4">
                  <div className="p-4 bg-surface/50 border border-surface rounded-lg">
                    <h4 className="text-sm font-bold text-white mb-3">Model Confidence</h4>
                    <div className="flex items-center justify-between mb-2 text-xs font-mono">
                      <span>Reliability Score</span>
                      <span className="text-accent">High</span>
                    </div>
                    <div className="w-full bg-background h-1.5 rounded-full overflow-hidden">
                       <div className="h-full bg-accent w-[92%]" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-surface/50 border border-surface rounded-lg">
                    <h4 className="text-sm font-bold text-white mb-2">Growth Projection</h4>
                    <p className="text-xs text-text-muted italic">
                      Current trajectory suggests "Expert" status reachable within 6 months of continued consistency in System Design.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
