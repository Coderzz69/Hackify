"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import Link from "next/link";
import { ArrowLeft, Clock, Play, Code2, CheckCircle2, ChevronRight } from "lucide-react";
import { challenges } from "@/lib/mock-data";
import { HackifyScoreRing } from "@/components/shared/HackifyScoreRing";

const HACKIFY_THEME = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '0A0A0F' },
    { token: 'keyword', foreground: '6C3AFF', fontStyle: 'bold' },
    { token: 'string', foreground: '00F5A0' },
    { token: 'number', foreground: '00F5A0' },
    { token: 'comment', foreground: '8888AA', fontStyle: 'italic' },
  ],
  colors: {
    'editor.background': '#0A0A0F',
    'editor.foreground': '#F0F0FF',
    'editorLineNumber.foreground': '#8888AA',
    'editor.lineHighlightBackground': '#111118',
    'editorCursor.foreground': '#00F5A0',
  }
};

export default function ChallengePage() {
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const challenge = challenges[0];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerColor = timeLeft > 300 ? "text-accent" : timeLeft > 60 ? "text-yellow-400" : "text-red-500 animate-pulse";

  const handleEditorMount = (editor: any, monaco: any) => {
    monaco.editor.defineTheme('hackify-dark', HACKIFY_THEME);
    monaco.editor.setTheme('hackify-dark');
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowResult(true);
    }, 2000); // Simulated evaluation
  };

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <header className="h-16 border-b border-surface bg-background flex items-center justify-between px-6 shrink-0 relative z-20">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-[1px] bg-surface" />
          <h1 className="font-display font-bold font-lg text-white">{challenge.title}</h1>
          <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-primary/20 text-primary border border-primary/30">
            {challenge.difficulty}
          </span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${timerColor}`}>
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={handleSubmit} 
            className="flex items-center gap-2 bg-accent hover:bg-accent/80 text-background font-semibold px-6 py-2 rounded-md transition-all ease-out"
            disabled={isSubmitting || showResult}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-background border-t-transparent animate-spin" /> Evaluating...</span>
            ) : (
              <span className="flex items-center gap-2"><Play size={16} /> Run & Submit</span>
            )}
          </button>
        </div>
      </header>

      {/* Split Layout */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        
        {/* Task Panel (40%) */}
        <div className="w-[40%] min-w-[300px] border-r border-surface bg-surface/30 p-8 overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Code2 className="text-primary" /> Task Description
          </h2>
          <div className="prose prose-invert prose-p:text-text-muted prose-h3:text-white max-w-none">
            <h3>Optimize the Rate Limiter</h3>
            <p>
              Your task is to implement a sliding window log rate limiter in TypeScript. 
              The provided codebase has a naive implementation that OOMs under high load.
            </p>
            <p>
              Requirements:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-text-muted">
              <li>Must handle 10,000 requests per second.</li>
              <li>Memory footprint must remain under 50MB.</li>
              <li>Requests exceeding the limit must return `false` instantly.</li>
            </ul>
            <div className="mt-8 p-4 bg-surface rounded-lg border border-border-glow shadow-glow text-sm font-mono text-accent">
              Input format: `[timestamps[], limit, windowSize]`
            </div>
          </div>
        </div>

        {/* Monaco Editor Panel (60%) */}
        <div className="flex-1 bg-background relative">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            defaultValue={`// Implement your solution here
export class SlidingWindowRateLimiter {
  private limit: number;
  private windowSize: number;
  
  constructor(limit: number, windowSize: number) {
    this.limit = limit;
    this.windowSize = windowSize;
  }

  isAllowed(timestamp: number): boolean {
    // TODO: Write optimized logic
    return true;
  }
}
`}
            theme="vs-dark" // Will be overridden by onMount Hackify theme
            onMount={handleEditorMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 24,
              padding: { top: 24 },
              scrollBeyondLastLine: false,
              cursorBlinking: "smooth",
              cursorSmoothCaretAnimation: "on",
              renderLineHighlight: "all",
            }}
          />
        </div>
      </div>

      {/* Evaluation Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div 
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-surface border border-primary p-10 rounded-2xl shadow-glow-lg w-full max-w-2xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 text-accent mb-6 shadow-neon">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-display font-bold">Challenge Mastered!</h2>
                <p className="text-text-muted mt-2">Your solution outperformed 92% of submissions in memory usage.</p>
              </div>

              <div className="flex items-center justify-around py-8 border-y border-surface-bright/30 mb-8 bg-background rounded-lg border border-[rgba(108,58,255,0.2)] shadow-glow">
                <div className="text-center">
                  <div className="text-xs text-text-muted font-mono mb-1">EXECUTION TIME</div>
                  <div className="text-2xl font-bold font-mono text-white">12<span className="text-sm text-text-muted">ms</span></div>
                </div>
                <div className="w-[1px] h-12 bg-surface-bright/50" />
                <div className="text-center">
                  <div className="text-xs text-text-muted font-mono mb-1">MEMORY</div>
                  <div className="text-2xl font-bold font-mono text-white">14.2<span className="text-sm text-text-muted">MB</span></div>
                </div>
                <div className="w-[1px] h-12 bg-surface-bright/50" />
                <div className="text-center">
                  <div className="text-xs text-text-muted font-mono mb-1">SCORE YIELD</div>
                  <div className="text-2xl font-bold font-mono text-accent">+42</div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Link href="/dashboard" className="px-6 py-3 font-semibold text-text-muted hover:text-white transition-colors">
                  Close Dashboard
                </Link>
                <Link href="/challenge" className="btn-primary flex items-center gap-2">
                  Next Challenge <ChevronRight size={18} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
