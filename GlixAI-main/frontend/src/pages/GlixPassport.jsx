import { useState } from "react";
import {
  ChevronLeft,
  Zap,
  Loader2,
  Shield,
  Award,
  TrendingUp,
  Heart,
  Users,
  CheckCircle,
  X,
  Copy,
  ExternalLink,
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
import { generatePassport, getAvailableRoles } from "../lib/api";
import { useEffect } from "react";

export default function GlixPassport({ onNavigate }) {
  const [name, setName] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);
  const [targetRole, setTargetRole] = useState("");
  const [level, setLevel] = useState("Mid-Level");
  const [bio, setBio] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [passport, setPassport] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getAvailableRoles().then((r) => setRoles(r.data.roles || [])).catch(() => {});
  }, []);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setSkillInput("");
    }
  };

  const handleGenerate = async () => {
    if (!name || !targetRole || skills.length === 0) return;
    setLoading(true);
    try {
      const res = await generatePassport(name, skills, targetRole, level, bio);
      setPassport(res.data.passport);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  const copyPassportId = () => {
    if (passport?.id) {
      navigator.clipboard.writeText(passport.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const p = passport;
  const risk = p?.automation_risk;
  const salary = p?.salary_insight;
  const eq = p?.eq_sq_assessment;
  const gap = p?.gap_analysis;

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="scanlines fixed inset-0 pointer-events-none opacity-30" />

      <header className="glass-panel border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center gap-4">
          <button
            data-testid="passport-back-btn"
            onClick={() => onNavigate("landing")}
            className="text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Zap className="w-5 h-5 text-neon-purple" />
          <span className="font-heading text-sm font-bold tracking-widest text-white uppercase">
            GLIX PASSPORT
          </span>
          <div className="w-2 h-2 bg-neon-purple animate-pulse ml-2" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {!passport ? (
          <>
            <h1
              data-testid="passport-heading"
              className="font-heading font-bold text-lg tracking-wider text-white uppercase mb-2"
            >
              GENERATE YOUR GLIX PASSPORT
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Your live digital portfolio with verified skill badges, AI risk analysis, and EQ/SQ scoring.
            </p>

            <div className="glass-panel tech-border p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                    Full Name
                  </label>
                  <input
                    data-testid="passport-name-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name..."
                    className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-body text-sm text-white placeholder:text-gray-600 px-4 py-3 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                    Experience Level
                  </label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger
                      data-testid="passport-level-select"
                      className="bg-black/50 border-white/10 text-white font-body h-[46px] rounded-none"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-none">
                      {["Junior", "Mid-Level", "Senior", "Lead", "Principal"].map((l) => (
                        <SelectItem key={l} value={l} className="font-body text-white rounded-none">
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  Target Role
                </label>
                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger
                    data-testid="passport-role-select"
                    className="bg-black/50 border-white/10 text-white font-body h-12 rounded-none"
                  >
                    <SelectValue placeholder="Select target role..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-none">
                    {roles.map((role) => (
                      <SelectItem key={role.name} value={role.name} className="font-body text-white rounded-none">
                        {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  Your Skills
                </label>
                <div className="flex gap-3">
                  <input
                    data-testid="passport-skill-input"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Type a skill..."
                    className="flex-1 bg-black/50 border border-white/10 focus:border-neon-cyan font-body text-sm text-white placeholder:text-gray-600 px-4 py-3 outline-none transition-all"
                  />
                  <Button
                    data-testid="passport-add-skill-btn"
                    onClick={addSkill}
                    className="font-heading text-xs uppercase bg-neon-cyan text-black rounded-none h-[46px] px-6"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {skills.map((s) => (
                    <Badge
                      key={s}
                      className="font-mono text-[10px] bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 uppercase cursor-pointer hover:bg-neon-cyan/20 flex items-center gap-1"
                      onClick={() => setSkills((p) => p.filter((sk) => sk !== s))}
                    >
                      {s} <X className="w-3 h-3" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground uppercase block mb-2">
                  Bio / Experience Summary (for EQ/SQ analysis)
                </label>
                <textarea
                  data-testid="passport-bio-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your experience, projects, and collaborations..."
                  rows={4}
                  className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan font-body text-sm text-white placeholder:text-gray-600 p-4 outline-none transition-all resize-none"
                />
              </div>

              <Button
                data-testid="generate-passport-btn"
                onClick={handleGenerate}
                disabled={loading || !name || !targetRole || skills.length === 0}
                className="font-heading font-bold uppercase tracking-wider bg-neon-purple text-white hover:shadow-[0_0_20px_rgba(112,0,255,0.4)] hover:brightness-110 disabled:opacity-30 transition-all duration-300 rounded-none h-12 px-8 text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Award className="w-4 h-4 mr-2" />}
                {loading ? "GENERATING..." : "GENERATE PASSPORT"}
              </Button>
            </div>
          </>
        ) : (
          <div className="animate-fade-in space-y-8">
            {/* Passport Header */}
            <div className="bg-black/80 border border-neon-purple/30 p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan" />
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-neon-purple" />
                    <span className="font-heading text-xs tracking-widest text-neon-purple uppercase">
                      Glix Passport
                    </span>
                  </div>
                  <h2 data-testid="passport-name-display" className="font-heading font-bold text-2xl tracking-wider text-white uppercase">
                    {p.name}
                  </h2>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    {p.experience_level} | Target: {p.target_role}
                  </p>
                </div>
                <div className="text-right">
                  <button
                    data-testid="copy-passport-id-btn"
                    onClick={copyPassportId}
                    className="flex items-center gap-1 font-mono text-[10px] text-neon-cyan/60 hover:text-neon-cyan transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? "Copied!" : p.id?.slice(0, 8)}
                  </button>
                  <p className="font-mono text-[10px] text-muted-foreground/40 mt-1">
                    {new Date(p.generated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Skill Match Score */}
              <div className="mt-6">
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-xs text-muted-foreground">Skill Match for {p.target_role}</span>
                  <span className="font-mono text-xs text-neon-cyan">{p.skill_match_score}%</span>
                </div>
                <Progress value={p.skill_match_score} className="h-2 bg-white/5" />
              </div>
            </div>

            {/* Verified Badges */}
            <div className="bg-black/80 border border-white/5 p-6">
              <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> Verified Skill Badges
              </h3>
              <div className="flex flex-wrap gap-2">
                {p.verified_badges?.map((badge, i) => (
                  <Badge
                    key={i}
                    className="font-mono text-[10px] bg-neon-green/10 text-neon-green border-neon-green/20 uppercase tracking-wider"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> {badge.skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Automation Risk */}
              {risk && (
                <div className="bg-black/80 border border-white/5 p-6">
                  <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Automation Risk
                  </h3>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className={`font-heading text-3xl font-bold ${risk.risk_score <= 30 ? "text-neon-green" : risk.risk_score <= 60 ? "text-neon-gold" : "text-neon-red"}`}>
                      {risk.human_necessity}%
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">Human Necessity</span>
                  </div>
                  <Progress value={risk.human_necessity} className="h-2 bg-white/5 mb-2" />
                  <div className="flex justify-between">
                    <span className="font-mono text-[10px] text-muted-foreground">{risk.risk_level} Risk</span>
                    <span className="font-mono text-[10px] text-muted-foreground">Horizon: {risk.horizon}</span>
                  </div>
                  <p className="font-body text-xs text-muted-foreground/70 mt-3">{risk.mitigation}</p>
                </div>
              )}

              {/* Shadow Salary */}
              {salary && (
                <div className="bg-black/80 border border-white/5 p-6">
                  <h3 className="font-heading text-xs tracking-widest text-neon-gold uppercase mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Shadow Salary IQ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-xs text-muted-foreground">Low</span>
                      <span className="font-mono text-sm text-white">${salary.low?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body text-xs text-neon-gold">Median</span>
                      <span className="font-heading text-lg text-neon-gold font-bold">${salary.median?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body text-xs text-muted-foreground">High</span>
                      <span className="font-mono text-sm text-white">${salary.high?.toLocaleString()}</span>
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex justify-between">
                      <span className="font-mono text-[10px] text-muted-foreground">Trend: {salary.trend}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">Demand: {salary.demand}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* EQ/SQ */}
            {eq && (
              <div className="bg-black/80 border border-white/5 p-6">
                <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4 flex items-center gap-2">
                  <Heart className="w-4 h-4" /> EQ / SQ Assessment
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground">EQ</span>
                      <span className="font-mono text-xs text-neon-cyan">{eq.eq_score}</span>
                    </div>
                    <Progress value={eq.eq_score} className="h-2 bg-white/5" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground">SQ</span>
                      <span className="font-mono text-xs text-neon-purple">{eq.sq_score}</span>
                    </div>
                    <Progress value={eq.sq_score} className="h-2 bg-white/5" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-mono text-[10px] text-muted-foreground">Combined</span>
                      <span className="font-mono text-xs text-neon-green">{eq.combined_score}</span>
                    </div>
                    <Progress value={eq.combined_score} className="h-2 bg-white/5" />
                  </div>
                </div>
                {eq.culture_fit?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {eq.culture_fit.map((c, i) => (
                      <Badge key={i} className="font-mono text-[10px] bg-neon-gold/10 text-neon-gold border-neon-gold/20 capitalize">
                        <Users className="w-3 h-3 mr-1" /> {c.culture}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Gap Analysis */}
            {gap && (
              <div className="bg-black/80 border border-white/5 p-6">
                <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4">
                  Skill Gap Analysis
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="font-mono text-[10px] text-neon-green/60 uppercase">Matching</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gap.matching?.map((s, i) => (
                        <Badge key={i} className="font-mono text-[10px] bg-neon-green/10 text-neon-green border-neon-green/20">
                          <CheckCircle className="w-3 h-3 mr-1" /> {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-neon-red/60 uppercase">Must Learn</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gap.missing_must_have?.map((s, i) => (
                        <Badge key={i} className="font-mono text-[10px] bg-neon-red/10 text-neon-red border-neon-red/20">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-neon-gold/60 uppercase">Nice to Have</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {gap.missing_nice_to_have?.map((s, i) => (
                        <Badge key={i} className="font-mono text-[10px] bg-neon-gold/10 text-neon-gold border-neon-gold/20">{s}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="glass-panel border border-neon-purple/10 p-4 text-center">
              <p className="font-mono text-[10px] text-muted-foreground/50">
                Powered by GlixAI Autonomous Engine | White-Label Ready
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                data-testid="passport-new-btn"
                onClick={() => setPassport(null)}
                variant="outline"
                className="font-heading text-xs uppercase tracking-wider border-neon-purple/30 text-neon-purple hover:bg-neon-purple/10 rounded-none"
              >
                Generate New Passport
              </Button>
              <Button
                data-testid="passport-to-roadmap-btn"
                onClick={() => onNavigate("roadmap")}
                className="font-heading text-xs uppercase tracking-wider bg-neon-cyan text-black rounded-none"
              >
                Generate Roadmap
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
