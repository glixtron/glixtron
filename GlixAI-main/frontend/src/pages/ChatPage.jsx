import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Plus,
  Trash2,
  MessageSquare,
  Zap,
  Search,
  FileText,
  Map,
  ChevronLeft,
  Menu,
  X,
  Award,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  sendMessage,
  getChatSessions,
  getChatHistory,
  deleteSession,
} from "../lib/api";

function ChatMessage({ msg, index }) {
  const isUser = msg.role === "user";

  return (
    <div
      data-testid={`chat-message-${index}`}
      className={`flex gap-4 animate-slide-up ${isUser ? "justify-end" : "justify-start"}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {!isUser && (
        <div className="shrink-0 w-8 h-8 bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mt-1">
          <Zap className="w-4 h-4 text-neon-cyan" />
        </div>
      )}
      <div
        className={`max-w-[80%] ${
          isUser
            ? "bg-neon-cyan/10 border border-neon-cyan/20 px-5 py-3"
            : "bg-black/40 border border-white/5 px-5 py-4"
        }`}
      >
        {isUser ? (
          <p className="font-body text-sm text-white leading-relaxed">{msg.content}</p>
        ) : (
          <div className="chat-markdown font-body text-sm text-gray-200 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
          </div>
        )}
        <div className="mt-2 font-mono text-[10px] text-muted-foreground/50">
          {msg.timestamp
            ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : ""}
        </div>
      </div>
      {isUser && (
        <div className="shrink-0 w-8 h-8 bg-neon-purple/10 border border-neon-purple/30 flex items-center justify-center mt-1">
          <span className="font-heading text-xs text-neon-purple font-bold">U</span>
        </div>
      )}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="shrink-0 w-8 h-8 bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
        <Zap className="w-4 h-4 text-neon-cyan animate-pulse" />
      </div>
      <div className="bg-black/40 border border-white/5 px-5 py-4">
        <div className="typing-indicator flex items-center gap-1">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage({ onNavigate, initialPrompt }) {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initialPromptSent = useRef(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, scrollToBottom]);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (initialPrompt && !initialPromptSent.current && !loading) {
      initialPromptSent.current = true;
      const sid = crypto.randomUUID();
      setActiveSession(sid);
      setMessages([]);
      handleSend(initialPrompt, sid);
    }
  }, [initialPrompt]);

  const loadSessions = async () => {
    try {
      const res = await getChatSessions();
      setSessions(res.data.sessions || []);
    } catch {
      /* ignore */
    }
  };

  const loadHistory = async (sessionId) => {
    try {
      const res = await getChatHistory(sessionId);
      setMessages(res.data.messages || []);
      setActiveSession(sessionId);
      setSidebarOpen(false);
    } catch {
      /* ignore */
    }
  };

  const newChat = () => {
    const sid = crypto.randomUUID();
    setActiveSession(sid);
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
    inputRef.current?.focus();
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (activeSession === sessionId) {
        setActiveSession(null);
        setMessages([]);
      }
    } catch {
      /* ignore */
    }
  };

  const handleSend = async (text, sessionId) => {
    const msg = text || input.trim();
    const sid = sessionId || activeSession || crypto.randomUUID();

    if (!msg) return;

    if (!activeSession) setActiveSession(sid);
    setInput("");

    const userMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: msg,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await sendMessage(sid, msg);
      const assistantMsg = res.data.message;
      setMessages((prev) => [...prev, assistantMsg]);
      loadSessions();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Connection error. Please check if the backend is running and try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex bg-[#050505] overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-testid="chat-sidebar"
        className={`fixed lg:relative z-50 lg:z-auto h-full w-72 glass-panel border-r border-white/5 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar header */}
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-neon-cyan" />
            <span className="font-heading text-sm font-bold tracking-wider text-white uppercase">
              GlixAI
            </span>
          </div>
          <Button
            data-testid="new-chat-btn"
            onClick={newChat}
            size="icon"
            variant="ghost"
            className="w-8 h-8 text-neon-cyan hover:bg-neon-cyan/10"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Nav links */}
        <div className="p-3 space-y-1">
          {[
            { icon: MessageSquare, label: "Chat", page: "chat" },
            { icon: Search, label: "Job Search", page: "jobs" },
            { icon: FileText, label: "Resume", page: "resume" },
            { icon: Map, label: "Roadmap", page: "roadmap" },
            { icon: Award, label: "Passport", page: "passport" },
          ].map((item) => (
            <button
              key={item.page}
              data-testid={`nav-${item.page}`}
              onClick={() => {
                onNavigate(item.page);
                setSidebarOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm font-body text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        <Separator className="bg-white/5" />

        {/* Chat history */}
        <div className="px-3 pt-3 pb-1">
          <span className="font-mono text-[10px] text-muted-foreground/60 tracking-widest uppercase">
            History
          </span>
        </div>
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-4">
            {sessions.map((session) => (
              <button
                key={session.id}
                data-testid={`session-${session.id}`}
                onClick={() => loadHistory(session.id)}
                className={`w-full text-left group flex items-center gap-2 px-3 py-2 text-sm font-body transition-colors ${
                  activeSession === session.id
                    ? "text-neon-cyan bg-neon-cyan/5 border-l-2 border-neon-cyan"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-3 h-3 shrink-0" />
                <span className="truncate flex-1">{session.title}</span>
                <button
                  data-testid={`delete-session-${session.id}`}
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </button>
              </button>
            ))}
            {sessions.length === 0 && (
              <p className="text-xs text-muted-foreground/40 font-mono px-3 py-4">
                No conversations yet
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Back to home */}
        <div className="p-3 border-t border-white/5">
          <button
            data-testid="back-home-btn"
            onClick={() => onNavigate("landing")}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-mono text-muted-foreground hover:text-neon-cyan transition-colors"
          >
            <ChevronLeft className="w-3 h-3" />
            Back to Home
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-14 glass-panel border-b border-white/5 flex items-center px-4 gap-3">
          <button
            data-testid="toggle-sidebar-btn"
            className="lg:hidden text-muted-foreground hover:text-white"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-neon-cyan animate-pulse" />
            <span className="font-heading text-xs tracking-widest text-muted-foreground uppercase">
              {activeSession ? "Active Session" : "New Conversation"}
            </span>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 md:px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 bg-neon-cyan/5 border border-neon-cyan/20 flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-neon-cyan/60" />
                </div>
                <h2 className="font-heading text-base md:text-lg font-bold tracking-wider text-white uppercase mb-3">
                  GlixAI Ready
                </h2>
                <p className="font-body text-sm text-muted-foreground max-w-md">
                  Ask me about jobs, career paths, skill gaps, or paste your resume for analysis.
                  I&apos;m your autonomous career intelligence engine.
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage key={msg.id || i} msg={msg} index={i} />
            ))}

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-white/5 glass-panel p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  data-testid="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask GlixAI anything about your career..."
                  rows={1}
                  className="w-full bg-black/50 border border-white/10 focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50 font-body text-sm text-white placeholder:text-gray-600 px-4 py-3 resize-none outline-none transition-all duration-300"
                  style={{ minHeight: "48px", maxHeight: "120px" }}
                />
              </div>
              <Button
                data-testid="send-message-btn"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="font-heading font-bold uppercase tracking-wider bg-neon-cyan text-black hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:brightness-110 disabled:opacity-30 disabled:hover:shadow-none transition-all duration-300 rounded-none h-12 w-12 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="font-mono text-[10px] text-muted-foreground/40 mt-2 text-center">
              Powered by GlixAI Autonomous Engine
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
