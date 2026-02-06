import { useState, useCallback } from "react";
import {
  Search,
  MessageSquare,
  FileText,
  Map,
  Zap,
  ArrowRight,
  ChevronRight,
  Terminal,
  Brain,
  Target,
} from "lucide-react";
import { Button } from "../components/ui/button";

const FEATURES = [
  {
    icon: Brain,
    title: "AI CAREER COACH",
    desc: "GPT-5.2 powered conversations for personalized career guidance and skill analysis",
    action: "chat",
  },
  {
    icon: Search,
    title: "GLIX HUNTER",
    desc: "Autonomous job search with AI Risk Scores, Shadow Salary IQ, and science stream filtering",
    action: "jobs",
  },
  {
    icon: FileText,
    title: "RESUME ANALYZER",
    desc: "AI-powered skill extraction with EQ/SQ emotional intelligence scoring and culture fit",
    action: "resume",
  },
  {
    icon: Map,
    title: "ROADMAP ENGINE",
    desc: "Adaptive roadmaps with 7-day micro-learning sprints, gap analysis, and verified badges",
    action: "roadmap",
  },
  {
    icon: Target,
    title: "GLIX PASSPORT",
    desc: "Your live digital portfolio with verified badges, automation risk, and salary intelligence",
    action: "passport",
  },
  {
    icon: Terminal,
    title: "RISK & SALARY IQ",
    desc: "Future-proofing scores, automation vulnerability index, and shadow salary predictions",
    action: "jobs",
  },
];

const QUICK_PROMPTS = [
  "Find me senior Python developer jobs in San Francisco",
  "Create a 12-week roadmap to become an ML Engineer",
  "What skills do I need for a Full Stack Developer role?",
  "Analyze the gap between my React skills and a Cloud Architect role",
];

export default function Landing({ onNavigate }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Background Effects */}
      <div className="hero-glow fixed inset-0 pointer-events-none" />
      <div className="scanlines fixed inset-0 pointer-events-none opacity-50" />

      {/* Header */}
      <header className="relative z-10 glass-panel border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-neon-cyan" />
            <span className="font-heading font-bold text-lg tracking-widest text-white uppercase">
              GlixAI
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-neon-cyan/60 tracking-wider ml-2 border border-neon-cyan/20 px-2 py-0.5">
              v1.0
            </span>
          </div>
          <Button
            data-testid="launch-engine-btn"
            onClick={() => onNavigate("chat")}
            className="font-heading font-bold uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:brightness-110 transition-all duration-300 rounded-none h-10 px-6 text-sm"
          >
            LAUNCH ENGINE
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 bg-neon-cyan animate-pulse" />
              <span className="font-mono text-xs text-neon-cyan/80 tracking-widest uppercase">
                Autonomous Career Intelligence
              </span>
            </div>

            <h1
              data-testid="hero-heading"
              className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white uppercase leading-tight mb-8"
            >
              YOUR AI-POWERED
              <br />
              <span className="gradient-text">CAREER ENGINE</span>
            </h1>

            <p className="font-body text-base md:text-lg text-muted-foreground max-w-2xl mb-12 leading-relaxed">
              GlixAI combines autonomous web scraping, heuristic skill matching,
              and GPT-powered intelligence to find your next career move.
              No API keys needed. No limits.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                data-testid="start-chat-btn"
                onClick={() => onNavigate("chat")}
                className="font-heading font-bold uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:brightness-110 transition-all duration-300 rounded-none h-12 px-8 text-sm"
              >
                <MessageSquare className="mr-2 w-4 h-4" />
                START CHAT
              </Button>
              <Button
                data-testid="search-jobs-btn"
                onClick={() => onNavigate("jobs")}
                variant="outline"
                className="font-heading font-bold uppercase tracking-wider border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all duration-300 rounded-none h-12 px-8 text-sm"
              >
                <Search className="mr-2 w-4 h-4" />
                SEARCH JOBS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Prompts */}
      <section className="relative z-10 pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="font-mono text-xs text-muted-foreground mb-4 tracking-wider uppercase">
            Quick Commands
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                data-testid={`quick-prompt-${i}`}
                onClick={() => onNavigate("chat", prompt)}
                className="text-left glass-panel tech-border px-5 py-4 text-sm font-body text-muted-foreground hover:text-white hover:border-neon-cyan/40 transition-all duration-300 group flex items-center gap-3"
              >
                <ChevronRight className="w-4 h-4 text-neon-cyan/40 group-hover:text-neon-cyan transition-colors shrink-0" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-12">
            <span className="font-mono text-xs text-neon-cyan/60 tracking-widest uppercase">
              Engine Modules
            </span>
            <h2 className="font-heading font-bold text-base md:text-lg text-white uppercase tracking-wider mt-2">
              AUTONOMOUS CAPABILITIES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <button
                key={i}
                data-testid={`feature-card-${i}`}
                onClick={() => onNavigate(feature.action)}
                onMouseEnter={() => setHoveredFeature(i)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`text-left relative overflow-hidden bg-black/80 border transition-all duration-300 p-8 group ${
                  hoveredFeature === i
                    ? "border-neon-cyan/40 shadow-[0_0_20px_rgba(0,242,255,0.1)]"
                    : "border-white/5"
                }`}
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <feature.icon
                  className={`w-8 h-8 mb-6 transition-colors duration-300 ${
                    hoveredFeature === i ? "text-neon-cyan" : "text-neon-cyan/50"
                  }`}
                />
                <h3 className="font-heading font-bold text-sm tracking-widest text-white mb-3 uppercase">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
                <ChevronRight className="absolute bottom-6 right-6 w-5 h-5 text-neon-cyan/30 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 glass-panel border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neon-cyan/60" />
            <span className="font-mono text-xs text-muted-foreground">
              Powered by GlixAI Autonomous Engine
            </span>
          </div>
          <span className="font-mono text-xs text-muted-foreground/50">
            White-Label Ready
          </span>
        </div>
      </footer>
    </div>
  );
}
