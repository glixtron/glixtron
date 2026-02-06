import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  ExternalLink,
  ChevronLeft,
  Zap,
  Loader2,
  Star,
  Shield,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { searchJobs, getStreams } from "../lib/api";

export default function JobSearch({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [stream, setStream] = useState("");
  const [streams, setStreams] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    getStreams().then((r) => setStreams(r.data.streams || [])).catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
      const res = await searchJobs(query, location, skillList, stream);
      setJobs(res.data.jobs || []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const getRiskColor = (score) => {
    if (score <= 20) return "text-neon-green";
    if (score <= 40) return "text-neon-cyan";
    if (score <= 60) return "text-neon-gold";
    return "text-neon-red";
  };

  const getRiskBg = (score) => {
    if (score <= 20) return "bg-neon-green/10 border-neon-green/20";
    if (score <= 40) return "bg-neon-cyan/10 border-neon-cyan/20";
    if (score <= 60) return "bg-neon-gold/10 border-neon-gold/20";
    return "bg-neon-red/10 border-neon-red/20";
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#050505]">
        <div className="scanlines fixed inset-0 pointer-events-none opacity-30" />

        <header className="glass-panel border-b border-white/5 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center gap-4">
            <button
              data-testid="jobs-back-btn"
              onClick={() => onNavigate("landing")}
              className="text-muted-foreground hover:text-neon-cyan transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <Zap className="w-5 h-5 text-neon-cyan" />
            <span className="font-heading text-sm font-bold tracking-widest text-white uppercase">
              GLIX HUNTER
            </span>
            <div className="w-2 h-2 bg-neon-cyan animate-pulse ml-2" />
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
          {/* Search Form */}
          <div className="glass-panel tech-border p-8 mb-12">
            <h1
              data-testid="job-search-heading"
              className="font-heading font-bold text-lg tracking-wider text-white uppercase mb-2"
            >
              AUTONOMOUS JOB HUNTER
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-6">
              AI Risk Scores + Shadow Salary Intelligence + Skill Matching
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="job-query-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Job title or keywords..."
                  className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-body text-sm text-white placeholder:text-gray-600 pl-10 pr-4 py-3 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="job-location-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Location..."
                  className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-body text-sm text-white placeholder:text-gray-600 pl-10 pr-4 py-3 outline-none transition-all"
                />
              </div>
              <div className="relative">
                <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  data-testid="job-skills-input"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Your skills (comma-separated)..."
                  className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-body text-sm text-white placeholder:text-gray-600 pl-10 pr-4 py-3 outline-none transition-all"
                />
              </div>
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger
                  data-testid="stream-select"
                  className="bg-black/50 border-white/10 text-white font-body h-[46px] rounded-none"
                >
                  <SelectValue placeholder="Science Stream..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0a0a0a] border-white/10 rounded-none">
                  <SelectItem value="any" className="font-body text-white rounded-none">
                    All Streams
                  </SelectItem>
                  {streams.map((s) => (
                    <SelectItem key={s.code} value={s.code} className="font-body text-white rounded-none">
                      {s.code.toUpperCase()} - {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              data-testid="job-search-btn"
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              className="font-heading font-bold uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:brightness-110 disabled:opacity-30 transition-all duration-300 rounded-none h-12 px-8 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
              {loading ? "SCANNING PORTALS..." : "LAUNCH HUNTER"}
            </Button>
          </div>

          {/* Results */}
          {searched && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-xs text-muted-foreground tracking-wider uppercase">
                  {loading ? "Autonomous agents scanning..." : `${jobs.length} targets acquired`}
                </span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-neon-green">
                    <Shield className="w-3 h-3" /> AI Risk
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[10px] text-neon-gold">
                    <DollarSign className="w-3 h-3" /> Shadow Salary
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {jobs.map((job, i) => (
                  <div
                    key={i}
                    data-testid={`job-card-${i}`}
                    className="bg-black/80 border border-white/5 hover:border-neon-cyan/20 transition-all duration-300 p-6 group animate-slide-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-heading font-bold text-sm tracking-wider text-white uppercase">
                            {job.title}
                          </h3>
                          {job.match_score !== undefined && (
                            <Badge
                              data-testid={`match-score-${i}`}
                              className={`font-mono text-[10px] ${
                                job.match_score >= 70
                                  ? "bg-neon-green/10 text-neon-green border-neon-green/30"
                                  : job.match_score >= 40
                                  ? "bg-neon-gold/10 text-neon-gold border-neon-gold/30"
                                  : "bg-neon-red/10 text-neon-red border-neon-red/30"
                              }`}
                            >
                              {job.match_score}% match
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm font-body text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" /> {job.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> {job.salary}
                          </span>
                        </div>

                        <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {job.skills?.map((skill, j) => (
                            <Badge
                              key={j}
                              variant="outline"
                              className="font-mono text-[10px] border-neon-cyan/20 text-neon-cyan/70 bg-neon-cyan/5 uppercase tracking-wider"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Analytics Panel */}
                      <div className="shrink-0 w-full lg:w-64 space-y-3">
                        {/* Risk Score */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              data-testid={`risk-score-${i}`}
                              className={`border p-3 ${getRiskBg(job.risk_score)}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                                  AI Risk
                                </span>
                                <Shield className={`w-4 h-4 ${getRiskColor(job.risk_score)}`} />
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className={`font-heading text-lg font-bold ${getRiskColor(job.risk_score)}`}>
                                  {100 - job.risk_score}%
                                </span>
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  Human Necessity
                                </span>
                              </div>
                              <Progress value={100 - job.risk_score} className="h-1 mt-1 bg-white/5" />
                              <div className="flex justify-between mt-1">
                                <span className="font-mono text-[9px] text-muted-foreground/60">
                                  {job.risk_level}
                                </span>
                                <span className="font-mono text-[9px] text-muted-foreground/60">
                                  {job.horizon}
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-[#0a0a0a] border-white/10 rounded-none max-w-xs">
                            <p className="font-body text-xs">
                              Glix Risk Score: {job.risk_score}% automation probability in next {job.horizon}
                            </p>
                          </TooltipContent>
                        </Tooltip>

                        {/* Shadow Salary */}
                        {job.shadow_salary && (
                          <div className="border border-neon-gold/10 bg-neon-gold/5 p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                                Shadow Salary
                              </span>
                              <TrendingUp className="w-4 h-4 text-neon-gold" />
                            </div>
                            <div className="font-mono text-xs text-neon-gold">
                              ${job.shadow_salary.low?.toLocaleString()} - ${job.shadow_salary.high?.toLocaleString()}
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="font-mono text-[9px] text-muted-foreground/60">
                                Trend: {job.shadow_salary.trend}
                              </span>
                              <span className="font-mono text-[9px] text-muted-foreground/60">
                                {job.shadow_salary.demand}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Source & Link */}
                        <div className="flex items-center justify-between">
                          <Badge className="font-mono text-[10px] bg-white/5 text-muted-foreground border-none">
                            {job.source}
                          </Badge>
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-testid={`job-link-${i}`}
                            className="text-neon-cyan/60 hover:text-neon-cyan transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {!loading && jobs.length === 0 && (
                  <div className="text-center py-16">
                    <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                    <p className="font-body text-sm text-muted-foreground">
                      No targets found. Try different keywords.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button
              data-testid="jobs-to-chat-btn"
              onClick={() => onNavigate("chat")}
              variant="outline"
              className="font-heading text-xs uppercase tracking-wider border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 rounded-none"
            >
              Ask GlixAI for deeper analysis
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
