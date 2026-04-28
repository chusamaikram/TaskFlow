import { useState, useRef, useEffect } from "react";
import {
  X, Sparkles, Send, User, Plus, Trash2, ChevronDown,
  MessageSquare, FileText, CheckSquare, PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAI } from "../../context/AIContext";
import { useTasks } from "../../context/TaskContext";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

const SUGGESTIONS = [
  "What should I focus on today?",
  "Which tasks are overdue?",
  "Break down my high priority tasks",
  "Give me a weekly report",
];

// Parse ```json {...} ``` blocks from AI response
function parseTasksFromResponse(text) {
  const match = text.match(/```json\s*([\s\S]*?)```/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    return parsed.tasks || null;
  } catch {
    return null;
  }
}

// Strip the json block from display text
function stripJsonBlock(text) {
  return text.replace(/```json\s*[\s\S]*?```/g, "").trim();
}

export default function AIAssistant({ isOpen, onClose, initialPrompt = null }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { addTask } = useTasks();
  const {
    sessions, activeSessionId, setActiveSessionId,
    messages, streaming,
    createSession, deleteSession, sendMessage,
  } = useAI();

  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const sentInitial = useRef(false);

  // Handle initialPrompt (e.g. "explain this task")
  useEffect(() => {
    if (isOpen && initialPrompt && !sentInitial.current) {
      sentInitial.current = true;
      handleSend(initialPrompt);
    }
    if (!isOpen) sentInitial.current = false;
  }, [isOpen, initialPrompt]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!showScrollBtn) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100);
  };

  const handleSend = async (text) => {
    const content = text || input.trim();
    if (!content || streaming) return;
    setInput("");
    await sendMessage(content, activeSessionId);
  };

  const handleNewChat = async () => {
    setActiveSessionId(null);
    setSidebarOpen(false);
  };

  const handleWeeklyReport = async () => {
    setReportLoading(true);
    try {
      await sendMessage("Generate my weekly productivity report", activeSessionId);
    } catch {
      toast.error("Failed to generate report");
    } finally {
      setReportLoading(false);
    }
  };

  const handleAddTasks = async (suggestedTasks) => {
    for (const t of suggestedTasks) {
      await addTask({
        title: t.title,
        priority: t.priority || "medium",
        category: t.category || "Engineering",
        dueDate: t.dueDate || "",
        status: "todo",
        description: "",
        tags: [],
      });
    }
    toast.success(`${suggestedTasks.length} task${suggestedTasks.length > 1 ? "s" : ""} added!`);
  };

  if (!isOpen) return null;

  const bg = isDark ? "#07151f" : "#ffffff";
  const border = isDark ? "rgba(6,182,212,0.18)" : "rgba(6,182,212,0.25)";
  const subText = isDark ? "#475569" : "#94a3b8";
  const textMain = isDark ? "#f1f5f9" : "#0f172a";
  const textSub = isDark ? "#94a3b8" : "#475569";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end px-0 sm:px-6 pb-0 sm:pb-6 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:w-[700px] flex animate-slide-up rounded-t-2xl sm:rounded-2xl overflow-hidden"
        style={{
          height: "min(700px, 92dvh)",
          background: bg,
          border: `1px solid ${border}`,
          boxShadow: isDark
            ? "0 0 0 1px rgba(6,182,212,0.06), 0 32px 80px rgba(0,0,0,0.7), 0 0 60px rgba(6,182,212,0.08)"
            : "0 32px 80px rgba(0,0,0,0.15)",
        }}
      >
        {/* ── Sidebar ── */}
        <div
          className="flex-shrink-0 flex flex-col overflow-hidden transition-all duration-200"
          style={{
            width: sidebarOpen ? "200px" : "0px",
            borderRight: sidebarOpen ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}` : "none",
            background: isDark ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.02)",
          }}
        >
          {sidebarOpen && (
            <div className="flex flex-col h-full">
              <div className="px-3 pt-4 pb-2 flex-shrink-0">
                <button
                  onClick={handleNewChat}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4" }}
                >
                  <Plus size={13} /> New Chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5 modal-scroll">
                {sessions.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: subText }}>No chats yet</p>
                )}
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    className="group flex items-center gap-1 px-2 py-2 rounded-lg cursor-pointer transition-all"
                    style={{
                      background: s.id === activeSessionId
                        ? isDark ? "rgba(6,182,212,0.1)" : "rgba(6,182,212,0.08)"
                        : "transparent",
                    }}
                    onClick={() => { setActiveSessionId(s.id); }}
                  >
                    <MessageSquare size={11} style={{ color: s.id === activeSessionId ? "#06b6d4" : subText, flexShrink: 0 }} />
                    <span className="flex-1 text-xs truncate" style={{ color: s.id === activeSessionId ? textMain : textSub }}>
                      {s.title || "Chat"}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all hover:text-rose-400"
                      style={{ color: subText }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Main chat area ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
            style={{
              background: isDark
                ? "linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0.04) 100%)"
                : "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(6,182,212,0.03) 100%)",
              borderBottom: `1px solid ${isDark ? "rgba(6,182,212,0.12)" : "rgba(6,182,212,0.15)"}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setSidebarOpen((v) => !v)}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: subText }}
                title="Chat history"
              >
                {sidebarOpen ? <PanelLeftClose size={15} /> : <PanelLeftOpen size={15} />}
              </button>
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", boxShadow: "0 0 14px rgba(6,182,212,0.4)" }}
              >
                <Sparkles size={13} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold font-display" style={{ color: textMain }}>TaskFlow AI</p>
                <p className="text-xs" style={{ color: "#06b6d4" }}>
                  {activeSessionId
                    ? sessions.find((s) => s.id === activeSessionId)?.title?.slice(0, 30) || "Chat"
                    : "New conversation"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleWeeklyReport}
                disabled={reportLoading}
                title="Weekly report"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.15)", color: "#06b6d4" }}
              >
                <FileText size={12} />
                <span className="hidden sm:inline">{reportLoading ? "..." : "Report"}</span>
              </button>
              <button
                onClick={handleNewChat}
                title="New chat"
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: subText }}
              >
                <Plus size={15} />
              </button>
              <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: subText }}>
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 modal-scroll relative"
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-5 py-6">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(6,182,212,0.05))", border: "1px solid rgba(6,182,212,0.2)" }}
                >
                  <Sparkles size={22} style={{ color: "#06b6d4" }} />
                </div>
                <div className="text-center">
                  <p className="font-semibold font-display mb-1" style={{ color: textMain }}>
                    Hi {user?.name?.split(" ")[0]} 👋
                  </p>
                  <p className="text-sm" style={{ color: textSub }}>Ask me anything about your tasks</p>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSend(s)}
                      className="text-left text-xs px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        background: isDark ? "rgba(6,182,212,0.06)" : "rgba(6,182,212,0.05)",
                        border: `1px solid ${isDark ? "rgba(6,182,212,0.12)" : "rgba(6,182,212,0.15)"}`,
                        color: textSub,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)"; e.currentTarget.style.color = "#06b6d4"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? "rgba(6,182,212,0.12)" : "rgba(6,182,212,0.15)"; e.currentTarget.style.color = textSub; }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const suggestedTasks = msg.role === "ai" ? parseTasksFromResponse(msg.text) : null;
              const displayText = suggestedTasks ? stripJsonBlock(msg.text) : msg.text;

              return (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={msg.role === "user"
                      ? { background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.25)" }
                      : { background: "linear-gradient(135deg, #06b6d4, #0891b2)", boxShadow: "0 0 8px rgba(6,182,212,0.3)" }
                    }
                  >
                    {msg.role === "user"
                      ? <User size={12} style={{ color: "#06b6d4" }} />
                      : <Sparkles size={12} className="text-white" />
                    }
                  </div>

                  <div className="max-w-[80%] space-y-2">
                    <div
                      className="text-sm leading-relaxed px-3.5 py-2.5 rounded-2xl"
                      style={msg.role === "user"
                        ? { background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "#fff", borderBottomRightRadius: "4px" }
                        : {
                            background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                            border: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                            color: isDark ? "#cbd5e1" : "#334155",
                            borderBottomLeftRadius: "4px",
                          }
                      }
                    >
                      {msg.role === "ai" ? <MarkdownText text={displayText} /> : msg.text}
                      {msg.streaming && (
                        <span className="inline-flex gap-0.5 ml-1 align-middle">
                          {[0, 1, 2].map((d) => (
                            <span key={d} className="w-1 h-1 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                          ))}
                        </span>
                      )}
                    </div>

                    {/* Add tasks button */}
                    {suggestedTasks && !msg.streaming && (
                      <div
                        className="rounded-xl p-3 space-y-2"
                        style={{ background: isDark ? "rgba(6,182,212,0.06)" : "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.15)" }}
                      >
                        <p className="text-xs font-semibold" style={{ color: "#06b6d4" }}>
                          ✦ {suggestedTasks.length} task{suggestedTasks.length > 1 ? "s" : ""} suggested
                        </p>
                        {suggestedTasks.map((t, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                            <span className="text-xs flex-1" style={{ color: isDark ? "#94a3b8" : "#475569" }}>{t.title}</span>
                            <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: "rgba(6,182,212,0.1)", color: "#06b6d4" }}>{t.priority}</span>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddTasks(suggestedTasks)}
                          className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all mt-1"
                          style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)", color: "#fff" }}
                        >
                          <CheckSquare size={12} /> Add all to TaskFlow
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {showScrollBtn && (
            <button
              onClick={() => { setShowScrollBtn(false); bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              className="absolute bottom-20 right-6 w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: "#06b6d4", color: "#fff" }}
            >
              <ChevronDown size={14} />
            </button>
          )}

          {/* Input */}
          <div
            className="px-4 py-3 flex-shrink-0"
            style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}` }}
          >
            <div
              className="flex items-end gap-2 rounded-xl px-3 py-2"
              style={{
                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                border: `1px solid ${isDark ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0.2)"}`,
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
                }}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about your tasks..."
                disabled={streaming}
                className="flex-1 bg-transparent resize-none outline-none text-sm leading-relaxed py-0.5 modal-scroll"
                style={{ color: isDark ? "#e2e8f0" : "#1e293b", maxHeight: "120px", fontFamily: "inherit" }}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || streaming}
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all mb-0.5"
                style={{
                  background: input.trim() && !streaming ? "linear-gradient(135deg, #06b6d4, #0891b2)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
                  color: input.trim() && !streaming ? "#fff" : isDark ? "#475569" : "#94a3b8",
                  boxShadow: input.trim() && !streaming ? "0 0 12px rgba(6,182,212,0.35)" : "none",
                }}
              >
                <Send size={14} />
              </button>
            </div>
            <p className="text-center text-xs mt-2" style={{ color: isDark ? "#1e3a4a" : "#cbd5e1" }}>
              Shift+Enter for new line · Enter to send
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseInline(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i} className="font-semibold text-cyan-400">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i} className="italic text-cyan-300/80">{part.slice(1, -1)}</em>;
    if (part.startsWith("`") && part.endsWith("`"))
      return <code key={i} className="px-1.5 py-0.5 rounded text-xs font-mono bg-cyan-500/10 text-cyan-300">{part.slice(1, -1)}</code>;
    return part;
  });
}

function MarkdownText({ text }) {
  if (!text) return null;

  // Split out fenced code blocks first
  const segments = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-1.5">
      {segments.map((seg, si) => {
        if (seg.startsWith("```")) {
          const body = seg.replace(/^```\w*\n?/, "").replace(/```$/, "");
          return (
            <pre key={si} className="rounded-lg px-3 py-2.5 text-xs font-mono overflow-x-auto modal-scroll"
              style={{ background: "rgba(6,182,212,0.07)", border: "1px solid rgba(6,182,212,0.15)", color: "#67e8f9" }}>
              {body}
            </pre>
          );
        }

        return seg.split("\n").map((line, i) => {
          if (!line.trim()) return <div key={`${si}-${i}`} className="h-1" />;

          // Headings
          if (line.startsWith("### "))
            return <p key={`${si}-${i}`} className="text-sm font-bold text-cyan-400 mt-1">{parseInline(line.slice(4))}</p>;
          if (line.startsWith("## "))
            return <p key={`${si}-${i}`} className="text-base font-bold text-cyan-400 mt-1">{parseInline(line.slice(3))}</p>;
          if (line.startsWith("# "))
            return <p key={`${si}-${i}`} className="text-lg font-bold text-cyan-400 mt-1">{parseInline(line.slice(2))}</p>;

          // Horizontal rule
          if (/^---+$/.test(line.trim()))
            return <hr key={`${si}-${i}`} className="border-cyan-500/20 my-1" />;

          // Bullet list
          if (line.startsWith("- ") || line.startsWith("• "))
            return (
              <div key={`${si}-${i}`} className="flex gap-2 items-start">
                <span className="text-cyan-400 mt-0.5 flex-shrink-0 text-xs">•</span>
                <span>{parseInline(line.replace(/^[-•]\s/, ""))}</span>
              </div>
            );

          // Numbered list
          if (/^\d+\.\s/.test(line)) {
            const num = line.match(/^\d+/)[0];
            return (
              <div key={`${si}-${i}`} className="flex gap-2 items-start">
                <span className="text-cyan-400 flex-shrink-0 font-mono text-xs min-w-[1rem]">{num}.</span>
                <span>{parseInline(line.replace(/^\d+\.\s/, ""))}</span>
              </div>
            );
          }

          return <p key={`${si}-${i}`}>{parseInline(line)}</p>;
        });
      })}
    </div>
  );
}
