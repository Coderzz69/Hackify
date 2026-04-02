"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Code, Briefcase, ArrowRight, Loader2, Terminal } from "lucide-react";
import { onboardUser } from "@/lib/actions";

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<"DEVELOPER" | "RECRUITER" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("role", selectedRole);
      
      // Call Server Action
      await onboardUser(formData);
      // Note: onboardUser handles its own redirect
    } catch (error) {
      console.error("Onboarding failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      
      <motion.div 
        className="z-10 w-full max-w-4xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-surface/50 text-xs font-mono text-primary mb-8 backdrop-blur shadow-sm">
          <Terminal size={12} />
          <span>INITIALIZING_IDENTITY_FLOW</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Choose your path.</h1>
        <p className="text-text-muted text-lg mb-16 max-w-xl mx-auto">
          Welcome to Hackify. Are you here to prove your skills or find world-class talent?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 px-4 md:px-0">
          
          {/* Developer Option */}
          <motion.div
            className={`hackify-card cursor-pointer group relative p-10 flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.02] ${
              selectedRole === "DEVELOPER" 
                ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(108,58,255,0.2)]" 
                : "border-surface hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole("DEVELOPER")}
            whileHover={{ y: -5 }}
          >
            <div className={`p-4 rounded-xl mb-6 transition-colors duration-500 ${
              selectedRole === "DEVELOPER" ? "bg-primary text-white" : "bg-surface group-hover:bg-primary/20 group-hover:text-primary"
            }`}>
              <Code size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3">I'm a Developer</h3>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Take real-world challenges, build a verified skill graph, and get scouted by top tech recruiters.
            </p>
            <div className={`text-xs font-mono font-bold uppercase tracking-widest ${
              selectedRole === "DEVELOPER" ? "text-primary flex items-center gap-2" : "text-text-muted opacity-0"
            }`}>
              Path Selected <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowRight size={14} /></motion.span>
            </div>
          </motion.div>

          {/* Recruiter Option */}
          <motion.div
            className={`hackify-card cursor-pointer group relative p-10 flex flex-col items-center text-center transition-all duration-500 hover:scale-[1.02] ${
              selectedRole === "RECRUITER" 
                ? "border-accent bg-accent/10 shadow-[0_0_30px_rgba(0,245,160,0.2)]" 
                : "border-surface hover:border-accent/50"
            }`}
            onClick={() => setSelectedRole("RECRUITER")}
            whileHover={{ y: -5 }}
          >
            <div className={`p-4 rounded-xl mb-6 transition-colors duration-500 ${
              selectedRole === "RECRUITER" ? "bg-accent text-background" : "bg-surface group-hover:bg-accent/20 group-hover:text-accent"
            }`}>
              <Briefcase size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3">I'm a Recruiter</h3>
            <p className="text-text-muted text-sm leading-relaxed mb-6">
              Access the network of verified elite engineers. Filter by immutable skill scores and code performance.
            </p>
            <div className={`text-xs font-mono font-bold uppercase tracking-widest ${
              selectedRole === "RECRUITER" ? "text-accent flex items-center gap-2" : "text-text-muted opacity-0"
            }`}>
              Path Selected <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}><ArrowRight size={14} /></motion.span>
            </div>
          </motion.div>
        </div>

        <motion.button
          className={`btn-primary px-12 py-4 flex items-center justify-center gap-3 mx-auto min-w-[200px] transition-all duration-500 uppercase tracking-widest font-bold text-sm ${
            !selectedRole ? "opacity-50 grayscale cursor-not-allowed" : "hover:shadow-[0_0_20px_rgba(108,58,255,0.4)]"
          }`}
          disabled={!selectedRole || isLoading}
          onClick={handleComplete}
          whileHover={selectedRole ? { scale: 1.05 } : {}}
          whileTap={selectedRole ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Initializing...
            </>
          ) : (
            <>
              Establish Identity
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>
      </motion.div>
      
      {/* Decorative background orbits */}
      <div className="absolute -bottom-64 -left-64 w-[600px] h-[600px] rounded-full border border-primary/5 opacity-20 pointer-events-none" />
      <div className="absolute -top-64 -right-64 w-[600px] h-[600px] rounded-full border border-accent/5 opacity-20 pointer-events-none" />
    </div>
  );
}
