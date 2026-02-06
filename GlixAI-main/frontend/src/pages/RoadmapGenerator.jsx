import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Zap,
  Loader2,
  Target,
  BookOpen,
  Award,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { generateRoadmap, getAvailableRoles } from "../lib/api";

function SprintCard({ sprint }) {
  if (!sprint) return null;
  return (
    <div className="bg-black/60 border border-neon-purple/20 p-5 mt-3">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-neon-purple" />
        <span className="font-heading text-xs tracking-wider text-neon-purple uppercase">
          7-Day Sprint: {sprint.skill}
        </span>
      </div>
      <div className="space-y-2">
        {sprint.days && Object.entries(sprint.days).map(([day, info]) => (
          <div key={day} className="flex items-start gap-3">
            <span className="font-mono text-[10px] text-neon-cyan w-10 shrink-0">Day {day}</span>
            <div>
              <span className="font-body text-xs text-white">{info.focus}</span>
              {info.resources?.map((r, j) => (
                <a key={j} href={r.url} target="_blank" rel="noopener noreferrer"
                  className="block font-mono text-[10px] text-neon-cyan/60 hover:text-neon-cyan mt-0.5">
                  {r.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Award className="w-3 h-3 text-neon-green" />
        <span className="font-mono text-[10px] text-neon-green">{sprint.completion_badge}</span>
      </div>
    </div>
  );
}

export default function RoadmapGenerator({ onNavigate }) {
  const [roles, setRoles] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [weeks, setWeeks] = useState(12);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await getAvailableRoles();
      setRoles(res.data.roles || []);
    } catch {
      /* ignore */
    }
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setSkillInput("");
    }
  };

  const removeSkill = (s) => {
    setSkills((prev) => prev.filter((sk) => sk !== s));
  };

  const handleGenerate = async () => {
    if (!targetRole || skills.length === 0) return;
    setLoading(true);
    try {
      const res = await generateRoadmap(skills, targetRole, weeks);
      setResult(res.data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const roadmap = result?.structured_roadmap;
  const gap = roadmap?.skill_gap_analysis;
  const sprints = result?.sprints;

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="scanlines fixed inset-0 pointer-events-none opacity-30" />

      {/* Header */}
      <header className="glass-panel border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center gap-4">
          <button
            data-testid="roadmap-back-btn"
            onClick={() => onNavigate("landing")}
            className="text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Zap className="w-5 h-5 text-neon-cyan" />
          <span className="font-heading text-sm font-bold tracking-widest text-white uppercase">
            ROADMAP ENGINE
          </span>
          <div className="w-2 h-2 bg-neon-cyan animate-pulse ml-2" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {!result ? (
          <>
            <h1
              data-testid="roadmap-heading"
              className="font-heading font-bold text-lg tracking-wider text-white uppercase mb-2"
            >
              CAREER ROADMAP GENERATOR
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Enter your skills and target role to generate a personalized milestone-based career roadmap.
            </p>

            <div className="glass-panel tech-border p-8 space-y-6">
              {/* Target Role */}
              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  Target Role
                </label>
                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger
                    data-testid="role-select"
                    className="bg-black/50 border-white/10 focus:border-neon-cyan text-white font-body h-12 rounded-none"
                  >
                    <SelectValue placeholder="Select target role..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-none">
                    {roles.map((role) => (
                      <SelectItem
                        key={role.name}
                        value={role.name}
                        className="font-body text-white hover:bg-neon-cyan/10 rounded-none"
                      >
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Skills */}
              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  Your Current Skills
                </label>
                <div className="flex gap-3">
                  <input
                    data-testid="skill-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 bg-black/50 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-body text-sm text-white placeholder:text-gray-600 px-4 py-3 outline-none transition-all"
                  />
                  <Button
                    data-testid="add-skill-btn"
                    onClick={addSkill}
                    className="font-heading text-xs uppercase bg-neon-cyan text-black hover:brightness-110 rounded-none h-12 px-6"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((s) => (
                    <Badge
                      key={s}
                      className="font-mono text-[10px] bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 uppercase tracking-wider cursor-pointer hover:bg-neon-cyan/20 transition-colors flex items-center gap-1"
                      onClick={() => removeSkill(s)}
                    >
                      {s}
                      <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  Timeline: {weeks} weeks
                </label>
                <input
                  data-testid="weeks-range"
                  type="range"
                  min={4}
                  max={52}
                  value={weeks}
                  onChange={(e) => setWeeks(parseInt(e.target.value))}
                  className="w-full accent-[#00f2ff] h-1 bg-white/10 appearance-none cursor-pointer"
                />
                <div className="flex justify-between font-mono text-[10px] text-muted-foreground/50 mt-1">
                  <span>4 weeks</span>
                  <span>52 weeks</span>
                </div>
              </div>

              <Button
                data-testid="generate-roadmap-btn"
                onClick={handleGenerate}
                disabled={loading || !targetRole || skills.length === 0}
                className="font-heading font-bold uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:brightness-110 disabled:opacity-30 transition-all duration-300 rounded-none h-12 px-8 text-sm"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Target className="w-4 h-4 mr-2" />
                )}
                {loading ? "GENERATING..." : "GENERATE ROADMAP"}
              </Button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2
                  data-testid="roadmap-result-heading"
                  className="font-heading font-bold text-lg tracking-wider text-white uppercase"
                >
                  {roadmap?.target_role?.toUpperCase()} ROADMAP
                </h2>
                <p className="font-mono text-xs text-neon-cyan/60 mt-1">
                  {roadmap?.timeline_weeks} weeks | {roadmap?.skills_to_learn} skills to learn
                </p>
              </div>
              <Button
                data-testid="new-roadmap-btn"
                onClick={() => setResult(null)}
                variant="outline"
                className="font-heading text-xs uppercase tracking-wider border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 rounded-none"
              >
                New Roadmap
              </Button>
            </div>

            {/* Skill Gap */}
            {gap && (
              <div className="bg-black/80 border border-white/5 p-6">
                <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4">
                  Skill Gap Analysis
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">Match Score</span>
                    <span className="font-mono text-xs text-neon-cyan">{gap.match_score}%</span>
                  </div>
                  <Progress
                    data-testid="match-progress"
                    value={gap.match_score}
                    className="h-2 bg-white/5"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <span className="font-mono text-[10px] text-neon-green/60 uppercase tracking-wider">
                      Matching
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gap.matching?.map((s, i) => (
                        <Badge
                          key={i}
                          className="font-mono text-[10px] bg-neon-green/10 text-neon-green border-neon-green/20"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-neon-red/60 uppercase tracking-wider">
                      Must Learn
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gap.missing_must_have?.map((s, i) => (
                        <Badge
                          key={i}
                          className="font-mono text-[10px] bg-neon-red/10 text-neon-red border-neon-red/20"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-neon-gold/60 uppercase tracking-wider">
                      Nice to Have
                    </span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gap.missing_nice_to_have?.map((s, i) => (
                        <Badge
                          key={i}
                          className="font-mono text-[10px] bg-neon-gold/10 text-neon-gold border-neon-gold/20"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Phases */}
            <div className="space-y-4">
              {roadmap?.phases?.map((phase, i) => (
                <div
                  key={i}
                  data-testid={`phase-${i}`}
                  className="bg-black/80 border border-white/5 p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
                      <span className="font-heading text-xs text-neon-cyan font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-heading text-sm tracking-wider text-white uppercase">
                        {phase.name}
                      </h3>
                      <p className="font-mono text-[10px] text-muted-foreground">
                        Weeks {phase.weeks} | {phase.duration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 ml-11">
                    {phase.milestones?.map((m, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-neon-cyan mt-1.5 shrink-0" />
                        <span className="font-body text-sm text-muted-foreground">{m}</span>
                      </div>
                    ))}

                    {phase.resources?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {phase.resources.map((r, j) => (
                          <a
                            key={j}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 font-mono text-[10px] text-neon-cyan/70 hover:text-neon-cyan transition-colors"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {r.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Micro-Learning Sprints */}
            {sprints?.length > 0 && (
              <div className="bg-black/80 border border-white/5 p-6">
                <h3 className="font-heading text-xs tracking-widest text-neon-purple uppercase mb-4 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  7-Day Gap Sprints
                </h3>
                <p className="font-body text-xs text-muted-foreground mb-4">
                  Micro-learning sprints generated for your skill gaps. Complete each sprint to earn a GlixAI Verified badge.
                </p>
                <div className="space-y-4">
                  {sprints.map((sprint, i) => (
                    <SprintCard key={i} sprint={sprint} />
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio Projects */}
            {roadmap?.portfolio_projects?.length > 0 && (
              <div className="bg-black/80 border border-white/5 p-6">
                <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Portfolio Projects
                </h3>
                <div className="space-y-2">
                  {roadmap.portfolio_projects.map((p, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-neon-purple shrink-0" />
                      <span className="font-body text-sm text-muted-foreground">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator className="bg-white/5" />

            {/* AI Roadmap */}
            {result?.ai_roadmap && (
              <div className="bg-black/80 border border-white/5 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-5 h-5 text-neon-cyan" />
                  <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase">
                    AI-Enhanced Roadmap
                  </h3>
                </div>
                <div className="chat-markdown font-body text-sm text-gray-200 leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {result.ai_roadmap}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
