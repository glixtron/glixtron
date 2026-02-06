import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  ChevronLeft,
  Zap,
  Loader2,
  User,
  Mail,
  Phone,
  Linkedin,
  Heart,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { analyzeResume, analyzeResumeText } from "../lib/api";

function EQSQPanel({ data }) {
  if (!data) return null;
  return (
    <div className="bg-black/80 border border-white/5 p-6">
      <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4 flex items-center gap-2">
        <Heart className="w-4 h-4" /> EQ / SQ Assessment
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground">Emotional IQ</span>
            <span className="font-mono text-xs text-neon-cyan">{data.eq_score}/100</span>
          </div>
          <Progress value={data.eq_score} className="h-2 bg-white/5" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground">Social IQ</span>
            <span className="font-mono text-xs text-neon-purple">{data.sq_score}/100</span>
          </div>
          <Progress value={data.sq_score} className="h-2 bg-white/5" />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="font-mono text-[10px] text-muted-foreground">Combined</span>
            <span className="font-mono text-xs text-neon-green">{data.combined_score}/100</span>
          </div>
          <Progress value={data.combined_score} className="h-2 bg-white/5" />
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <span className="font-mono text-[10px] text-neon-cyan/60 uppercase tracking-wider">EQ Breakdown</span>
          <div className="space-y-2 mt-2">
            {data.eq_breakdown && Object.entries(data.eq_breakdown).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="font-body text-xs text-muted-foreground capitalize w-28">{k.replace("_", " ")}</span>
                <Progress value={v} className="h-1 flex-1 bg-white/5" />
                <span className="font-mono text-[10px] text-muted-foreground w-8">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="font-mono text-[10px] text-neon-purple/60 uppercase tracking-wider">SQ Breakdown</span>
          <div className="space-y-2 mt-2">
            {data.sq_breakdown && Object.entries(data.sq_breakdown).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="font-body text-xs text-muted-foreground capitalize w-28">{k.replace("_", " ")}</span>
                <Progress value={v} className="h-1 flex-1 bg-white/5" />
                <span className="font-mono text-[10px] text-muted-foreground w-8">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Fit */}
      {data.culture_fit?.length > 0 && (
        <div className="mt-4">
          <span className="font-mono text-[10px] text-neon-gold/60 uppercase tracking-wider">Culture Fit</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {data.culture_fit.map((c, i) => (
              <Badge key={i} className="font-mono text-[10px] bg-neon-gold/10 text-neon-gold border-neon-gold/20 capitalize">
                <Users className="w-3 h-3 mr-1" /> {c.culture} ({c.confidence}%)
              </Badge>
            ))}
          </div>
        </div>
      )}

      <p className="font-body text-xs text-muted-foreground/70 mt-4 italic">
        {data.assessment_note}
      </p>
    </div>
  );
}

export default function ResumeAnalyzer({ onNavigate }) {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const handleFileUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const res = await analyzeResume(file);
      setResult(res.data);
    } catch {
      setError("Failed to analyze resume. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!textInput.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await analyzeResumeText(textInput);
      setResult(res.data);
    } catch {
      setError("Failed to analyze text. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const parsed = result?.parsed;

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="scanlines fixed inset-0 pointer-events-none opacity-30" />

      <header className="glass-panel border-b border-white/5 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center gap-4">
          <button
            data-testid="resume-back-btn"
            onClick={() => onNavigate("landing")}
            className="text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <Zap className="w-5 h-5 text-neon-cyan" />
          <span className="font-heading text-sm font-bold tracking-widest text-white uppercase">
            RESUME ANALYZER
          </span>
          <div className="w-2 h-2 bg-neon-cyan animate-pulse ml-2" />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {!result ? (
          <>
            <h1
              data-testid="resume-heading"
              className="font-heading font-bold text-lg tracking-wider text-white uppercase mb-2"
            >
              AI-POWERED RESUME ANALYSIS
            </h1>
            <p className="font-body text-sm text-muted-foreground mb-8">
              Upload your resume or paste text for AI skill extraction, EQ/SQ scoring, and career recommendations.
            </p>

            <Tabs defaultValue="upload" className="space-y-6">
              <TabsList className="bg-black/60 border border-white/5 rounded-none p-1">
                <TabsTrigger
                  data-testid="tab-upload"
                  value="upload"
                  className="font-heading text-xs tracking-wider uppercase rounded-none data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan"
                >
                  Upload File
                </TabsTrigger>
                <TabsTrigger
                  data-testid="tab-paste"
                  value="paste"
                  className="font-heading text-xs tracking-wider uppercase rounded-none data-[state=active]:bg-neon-cyan/10 data-[state=active]:text-neon-cyan"
                >
                  Paste Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload">
                <div
                  data-testid="upload-dropzone"
                  onClick={() => fileRef.current?.click()}
                  className="glass-panel tech-border p-12 text-center cursor-pointer hover:border-neon-cyan/40 transition-all duration-300"
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <Upload className="w-12 h-12 text-neon-cyan/40 mx-auto mb-4" />
                  {file ? (
                    <div>
                      <p className="font-body text-sm text-white mb-1">{file.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-body text-sm text-muted-foreground mb-1">
                        Click to upload PDF, TXT, or DOC
                      </p>
                      <p className="font-mono text-xs text-muted-foreground/50">Max 5MB</p>
                    </div>
                  )}
                </div>
                <Button
                  data-testid="analyze-file-btn"
                  onClick={handleFileUpload}
                  disabled={!file || loading}
                  className="mt-6 font-heading font-bold uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-30 transition-all duration-300 rounded-none h-12 px-8 text-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                  {loading ? "ANALYZING..." : "ANALYZE RESUME"}
                </Button>
              </TabsContent>

              <TabsContent value="paste">
                <textarea
                  data-testid="resume-text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Paste your resume text here..."
                  rows={12}
                  className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-body text-sm text-white placeholder:text-gray-600 p-4 outline-none transition-all resize-none"
                />
                <Button
                  data-testid="analyze-text-btn"
                  onClick={handleTextAnalysis}
                  disabled={!textInput.trim() || loading}
                  className="mt-6 font-heading font-bold uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-30 transition-all duration-300 rounded-none h-12 px-8 text-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FileText className="w-4 h-4 mr-2" />}
                  {loading ? "ANALYZING..." : "ANALYZE TEXT"}
                </Button>
              </TabsContent>
            </Tabs>

            {error && (
              <div data-testid="resume-error" className="mt-6 flex items-center gap-2 text-destructive font-body text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </>
        ) : (
          <div className="animate-fade-in space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 data-testid="analysis-heading" className="font-heading font-bold text-lg tracking-wider text-white uppercase">
                  ANALYSIS COMPLETE
                </h2>
                <p className="font-mono text-xs text-neon-cyan/60 mt-1">Processed by GlixAI Engine</p>
              </div>
              <Button
                data-testid="new-analysis-btn"
                onClick={() => { setResult(null); setFile(null); setTextInput(""); }}
                variant="outline"
                className="font-heading text-xs uppercase tracking-wider border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 rounded-none"
              >
                New Analysis
              </Button>
            </div>

            {/* Parsed Data */}
            {parsed && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/80 border border-white/5 p-6">
                  <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4">Extracted Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {parsed.skills?.map((skill, i) => (
                      <Badge key={i} variant="outline" className="font-mono text-[10px] border-neon-cyan/20 text-neon-cyan/80 bg-neon-cyan/5 uppercase tracking-wider">
                        {skill}
                      </Badge>
                    ))}
                    {(!parsed.skills || parsed.skills.length === 0) && (
                      <span className="font-body text-sm text-muted-foreground">No skills detected</span>
                    )}
                  </div>
                </div>
                <div className="bg-black/80 border border-white/5 p-6">
                  <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase mb-4">Profile Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-body text-sm text-white">Level: {parsed.experience_level}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="font-body text-sm text-muted-foreground">Education: {parsed.education?.join(", ")}</span>
                    </div>
                    {parsed.contact?.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">{parsed.contact.email}</span>
                      </div>
                    )}
                    {parsed.contact?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs text-muted-foreground">{parsed.contact.phone}</span>
                      </div>
                    )}
                    {parsed.contact?.linkedin && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-xs text-neon-cyan">{parsed.contact.linkedin}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* EQ/SQ Assessment */}
            <EQSQPanel data={result?.eq_sq} />

            <Separator className="bg-white/5" />

            {/* AI Analysis */}
            <div className="bg-black/80 border border-white/5 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5 text-neon-cyan" />
                <h3 className="font-heading text-xs tracking-widest text-neon-cyan uppercase">AI Analysis</h3>
              </div>
              <div className="chat-markdown font-body text-sm text-gray-200 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.ai_analysis}</ReactMarkdown>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                data-testid="resume-to-passport-btn"
                onClick={() => onNavigate("passport")}
                className="font-heading text-xs uppercase tracking-wider bg-neon-purple text-white hover:shadow-[0_0_20px_rgba(112,0,255,0.4)] rounded-none"
              >
                Generate Glix Passport
              </Button>
              <Button
                data-testid="resume-to-roadmap-btn"
                onClick={() => onNavigate("roadmap")}
                className="font-heading text-xs uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] rounded-none"
              >
                Generate Career Roadmap
              </Button>
              <Button
                data-testid="resume-to-chat-btn"
                onClick={() => onNavigate("chat")}
                variant="outline"
                className="font-heading text-xs uppercase tracking-wider border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 rounded-none"
              >
                Discuss with GlixAI
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
