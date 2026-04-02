"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, ShieldCheck, Terminal, Award, Briefcase, Check } from "lucide-react";
import { useAuth, UserButton, SignInButton } from "@clerk/nextjs";
import { HackifyScoreRing } from "@/components/shared/HackifyScoreRing";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { developers } from "@/lib/mock-data";

function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden flex flex-col items-center justify-center text-center px-6">
      <div className="absolute inset-0 grid-bg opacity-30 select-none z-0" />
      <div className="absolute top-0 right-0 p-32 bg-radial opacity-40 z-0 h-full w-full pointer-events-none" />

      <motion.div
        className="z-10 relative max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-surface/80 text-primary text-sm font-mono mb-8 backdrop-blur shadow-[0_0_15px_rgba(108,58,255,0.2)]">
          <Terminal size={14} />
          <span>v2.0 Beta is Live</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
          Prove your <span className="bg-clip-text text-transparent bg-cyber-gradient">expertise</span>,<br />
          not your resume.
        </h1>
        
        <p className="text-xl md:text-2xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          The developer platform that verifies your actual coding skills through real-world, kinetic challenges.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard" className="btn-primary flex items-center gap-2 group">
            Start Coding <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/recruiter" className="btn-secondary">
            For Recruiters
          </Link>
        </div>
      </motion.div>

      {/* Floating JSON Card */}
      <motion.div 
        className="mt-16 z-10 w-full max-w-2xl mx-auto glass-panel p-6 text-left font-mono text-sm relative"
        initial={{ opacity: 0, rotateX: 20, y: 40 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ delay: 0.3, duration: 1 }}
        style={{ perspective: 1000 }}
      >
        <div className="absolute -top-[1px] -left-[1px] w-[20%] h-[1px] bg-cyber-gradient z-20 shadow-[0_0_10px_#00F5A0]" />
        <pre className="text-text-muted overflow-x-auto">
          <span className="text-primary">const</span> <span className="text-text-primary">developerProfile</span> = {'{'}{'\n'}
          {'  '}name: <span className="text-accent">"Alex Chen"</span>,{'\n'}
          {'  '}status: <span className="text-accent">"Verified"</span>,{'\n'}
          {'  '}hackifyScore: <span className="text-primary font-bold">842</span>,{'\n'}
          {'  '}coreSkills: [{'\n'}
          {'    '}TypeScript: <span className="text-accent">91</span>,{'\n'}
          {'    '}SystemDesign: <span className="text-accent">88</span>{'\n'}
          {'  '}]{'\n'}
          {'}'};
        </pre>
      </motion.div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: <Code className="text-primary" size={24} />, title: "Take Challenges", desc: "Complete real-world technical tasks in our Monaco-based editor." },
    { icon: <Award className="text-accent" size={24} />, title: "Earn Scores", desc: "Gain dynamic, verifiable ratings across multiple tech stacks." },
    { icon: <Briefcase className="text-primary" size={24} />, title: "Get Hired", desc: "Stand out to recruiters who filter by immutable Hackify scores." }
  ];

  return (
    <section className="py-24 px-6 relative z-10 bg-surface/30">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-display font-bold mb-16">How it Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Dashed connector line */}
          <div className="hidden md:block absolute top-[40px] left-[15%] right-[15%] h-[2px] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjIiPjxsaW5lIHgxPSIwIiB5MT0iMSIgeDI9IjEwMCUiIHkyPSIxIiBzdHJva2U9InJnYmEoMTA4LCA1OCwgMjU1LCAwLjMpIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1kYXNoYXJyYXk9IjQgNCIgLz48L3N2Zz4=')]" />
          
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              className="hackify-card p-8 text-center flex flex-col items-center relative z-10 bg-surface"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-background border border-border-glow flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(108,58,255,0.15)]">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-text-muted">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillShowcase() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-display font-bold mb-4">Top Talent, Verified</h2>
          <p className="text-text-muted max-w-2xl mx-auto">See the caliber of engineers currently using Hackify to prove their skills to top tech companies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {developers.slice(0,3).map((dev, i) => (
            <motion.div 
              key={dev.username}
              className="hackify-card p-6 flex flex-col items-center relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="absolute top-4 right-4">
                {dev.verified && <VerifiedBadge />}
              </div>
              <div className="mt-8 mb-6">
                 <HackifyScoreRing score={dev.score} size={100} strokeWidth={6} />
              </div>
              <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
              <p className="text-text-muted font-mono text-sm mb-6">@{dev.username}</p>
              
              <div className="w-full space-y-3">
                {dev.skills.slice(0,3).map(skill => (
                  <div key={skill.name} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary">{skill.name}</span>
                    <span className="font-mono text-accent">{skill.value}</span>
                  </div>
                ))}
              </div>
              
              <Link href={`/profile/${dev.username}`} className="mt-8 w-full py-2 text-center text-sm font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary/10 transition-colors">
                View Profile
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section className="py-24 px-6 relative z-10 bg-surface/30">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-display font-bold mb-16">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Free Plan */}
          <div className="hackify-card p-10 text-left relative flex flex-col">
            <h3 className="text-2xl font-bold mb-2">Developer</h3>
            <div className="text-4xl font-display font-bold mb-6">$0<span className="text-lg text-text-muted font-sans font-normal">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3"><CheckIcon /> Unlimited Code Challenges</li>
              <li className="flex items-center gap-3"><CheckIcon /> Public Verified Profile</li>
              <li className="flex items-center gap-3"><CheckIcon /> Core Skill Badges</li>
            </ul>
            <Link href="/dashboard" className="btn-secondary text-center w-full">Start Free</Link>
          </div>

          {/* Pro Plan */}
          <div className="hackify-card p-10 text-left relative flex flex-col border-primary shadow-[0_0_30px_rgba(108,58,255,0.2)]">
            <div className="absolute top-0 right-0 py-1 px-3 bg-primary text-xs font-bold rounded-bl-lg rounded-tr-lg">POPULAR</div>
            <h3 className="text-2xl font-bold mb-2">Recruiter Pro</h3>
            <div className="text-4xl font-display font-bold mb-6">$199<span className="text-lg text-text-muted font-sans font-normal">/mo</span></div>
            <ul className="space-y-4 mb-10 flex-1">
              <li className="flex items-center gap-3"><CheckIcon /> Access 10k+ Verified Devs</li>
              <li className="flex items-center gap-3"><CheckIcon /> Deep Skill Filtering</li>
              <li className="flex items-center gap-3"><CheckIcon /> Direct Outreach</li>
              <li className="flex items-center gap-3"><CheckIcon /> Custom Challenge Creation</li>
            </ul>
            <Link href="/recruiter" className="btn-primary text-center w-full">Get Access</Link>
          </div>

        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-surface text-center text-text-muted text-sm relative z-10 bg-background">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-lg text-text-primary mb-4 md:mb-0">
          <Terminal size={20} className="text-primary" /> Hackify.
        </div>
        <div className="flex gap-6">
          <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-primary transition-colors">GitHub</Link>
          <Link href="#" className="hover:text-primary transition-colors">Discord</Link>
        </div>
        <div className="mt-4 md:mt-0">
          &copy; {new Date().getFullYear()} Hackify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function CheckIcon() {
  return <Check size={18} className="text-accent flex-shrink-0" />;
}

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Navbar Minimal */}
      <nav className="absolute top-0 w-full p-6 z-50 flex justify-between items-center backdrop-blur-sm border-b border-surface/50">
        <div className="flex items-center gap-2 font-display font-bold text-xl tracking-tight">
          <Terminal size={24} className="text-primary" /> Hackify.
        </div>
        <div className="flex items-center gap-6 text-sm font-semibold">
          {!isLoaded ? (
            <div className="w-20 h-8 bg-surface rounded animate-pulse" />
          ) : !isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <button className="hover:text-primary transition-colors cursor-pointer">Sign In</button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="btn-primary py-2 px-4 shadow-none cursor-pointer">Get Started</button>
              </SignInButton>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <UserButton />
            </>
          )}
        </div>
      </nav>

      <main>
        <HeroSection />
        <HowItWorks />
        <SkillShowcase />
        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
