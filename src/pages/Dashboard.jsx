import { useState, useMemo, useEffect } from "react";
import { Plus, Search, CheckCircle2, Clock, ListTodo, TrendingUp, Pencil, Trash2, CheckCheck, Eye, Sparkles, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useAI } from "../context/AIContext";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";
import TaskForm from "../components/ui/TaskForm";
import StatsCard from "../components/ui/StatsCard";
import Badge from "../components/ui/Badge";
import AIAssistant from "../components/ui/AIAssistant";

const TABS = [
  { key: "all",        label: "All",         color: "text-cyan-500"   },
  { key: "todo",       label: "Pending",     color: "text-slate-400"  },
  { key: "inprogress", label: "In Progress", color: "text-indigo-400" },
  { key: "done",       label: "Completed",   color: "text-emerald-400"},
];

const COLUMNS = ["Title", "Category", "Priority", "Status", "Created", "Due Date", "Actions"];
const COL_WIDTHS = "30% 12% 10% 12% 12% 12% 12%";

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard() {
  const { tasks, tasksLoading, addTask, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const { briefing, briefingLoading, generateBriefing, explainTask } = useAI();
  const [search, setSearch]             = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [activeTab, setActiveTab]       = useState("all");
  const [isCreateOpen, setCreateOpen]   = useState(false);
  const [editTask, setEditTask]         = useState(null);
  const [viewTask, setViewTask]         = useState(null);
  const [deleteId, setDeleteId]         = useState(null);
  const [aiOpen, setAiOpen]             = useState(false);
  const [aiPrompt, setAiPrompt]         = useState(null);
  const [briefingDismissed, setBriefingDismissed] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Open AI from sidebar/header button via ?ai=1
  useEffect(() => {
    if (searchParams.get("ai") === "1") {
      setAiOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  // Generate briefing once when tasks load
  useEffect(() => {
    if (!tasksLoading && tasks.length > 0 && !briefing && !briefingLoading) {
      generateBriefing();
    }
  }, [tasksLoading]);

  const handleExplainTask = async (task) => {
    const prompt = await explainTask(task);
    setAiPrompt(prompt);
    setAiOpen(true);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const counts = useMemo(() => ({
    all:        tasks.length,
    todo:       tasks.filter((t) => t.status === "todo").length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    done:       tasks.filter((t) => t.status === "done").length,
  }), [tasks]);

  const filtered = useMemo(() => tasks.filter((t) => {
    const matchSearch   = t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchTab      = activeTab === "all" || t.status === activeTab;
    return matchSearch && matchPriority && matchTab;
  }), [tasks, search, filterPriority, activeTab]);

  const stats = {
    total:      tasks.length,
    inprogress: counts.inprogress,
    done:       counts.done,
    rate:       tasks.length ? Math.round((counts.done / tasks.length) * 100) : 0,
  };

  const handleCreate   = (data) => { addTask(data); setCreateOpen(false); toast.success("Task created!"); };
  const handleUpdate   = (data) => { updateTask(editTask.id, data); setEditTask(null); toast.success("Task updated!"); };
  const confirmDelete  = ()     => { deleteTask(deleteId); toast.success("Task deleted."); };
  const handleComplete = (id)   => { updateTask(id, { status: "done" }); toast.success("Marked as completed! 🎉"); };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm mb-1 font-mono text-slate-500">{greeting},</p>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-slate-100">
              {user?.name?.split(" ")[0]}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              You have <span className="text-cyan-500 font-semibold">{stats.inprogress} tasks</span> in progress
            </p>
          </div>
          <Button onClick={() => setCreateOpen(true)} size="sm"><Plus size={15} /> New Task</Button>
        </div>
      </div>

      {/* AI Daily Briefing */}
      {briefing && !briefingDismissed && (
        <div
          className="mb-6 rounded-xl px-4 py-3 flex items-start gap-3 animate-fade-in"
          style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.18)" }}
        >
          <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}>
            <Sparkles size={12} className="text-white" />
          </div>
          <p className="flex-1 text-sm" style={{ color: "#94a3b8" }}>{briefing}</p>
          <button onClick={() => setBriefingDismissed(true)} className="text-slate-500 hover:text-slate-300 transition-colors flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatsCard icon={ListTodo}     label="Total"       value={stats.total}      color="#06b6d4" sub="All tasks"   />
        <StatsCard icon={Clock}        label="In Progress" value={stats.inprogress} color="#818cf8" sub="Active now"  />
        <StatsCard icon={CheckCircle2} label="Completed"   value={stats.done}       color="#34d399" sub="All time"   />
        <StatsCard icon={TrendingUp}   label="Rate"        value={`${stats.rate}%`} color="#f59e0b" sub="Completion" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input className="input-field pl-10" placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field w-auto cursor-pointer" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-xl overflow-x-auto bg-black/[0.03] border border-black/[0.05] dark:bg-white/[0.03] dark:border-white/[0.05]">
        {TABS.map(({ key, label, color }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0 ${isActive ? `${color} bg-black/[0.04] dark:bg-white/[0.06]` : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md min-w-[20px] text-center font-mono ${isActive ? "bg-white/10" : "bg-white/[0.05]"}`}>
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden border border-black/[0.07] dark:border-white/[0.05]">
        {tasksLoading ? (
          <>
            <div className="hidden md:grid px-4 py-3 bg-slate-50 dark:bg-dark-800 border-b border-slate-200 dark:border-white/[0.05]"
              style={{ gridTemplateColumns: COL_WIDTHS }}>
              {COLUMNS.map((c) => <div key={c} className="h-3 rounded-md bg-white/[0.06] light:bg-slate-200 w-3/5" />)}
            </div>
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="hidden md:grid items-center px-4 py-4 border-b border-slate-100 dark:border-white/[0.05] last:border-0"
                style={{ gridTemplateColumns: COL_WIDTHS, opacity: 1 - i * 0.15 }}>
                <div className="space-y-1.5 pr-4">
                  <div className="h-3 rounded-md bg-slate-200 dark:bg-white/[0.07] w-4/5 animate-pulse" />
                  <div className="h-2.5 rounded-md bg-slate-100 dark:bg-white/[0.04] w-2/5 animate-pulse" />
                </div>
                {["50%","40%","55%","60%","50%","70%"].map((w, j) => (
                  <div key={j} className="h-3 rounded-md bg-slate-200 dark:bg-white/[0.05] animate-pulse" style={{ width: w }} />
                ))}
              </div>
            ))}
            {/* Mobile skeleton */}
            <div className="md:hidden space-y-3 p-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="card space-y-2 animate-pulse">
                  <div className="h-4 rounded bg-white/[0.07] w-3/4" />
                  <div className="h-3 rounded bg-white/[0.04] w-1/2" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Desktop table header */}
            <div className="hidden md:grid text-xs font-semibold uppercase tracking-wider px-4 py-3 font-mono text-slate-500 bg-slate-50 dark:bg-dark-800 border-b border-slate-200 dark:border-white/[0.05]"
              style={{ gridTemplateColumns: COL_WIDTHS }}>
              {COLUMNS.map((col) => <div key={col}>{col}</div>)}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-500">
                <ListTodo size={28} className="opacity-30" />
                <p className="text-sm font-mono">No tasks found</p>
              </div>
            )}

            {/* Desktop rows */}
            <div className="hidden md:block">
              {filtered.map((task, i) => (
                <div
                  key={task.id}
                  className="grid items-center px-4 py-3 cursor-pointer hover:bg-cyan-500/[0.04] transition-colors border-b border-slate-100 dark:border-white/[0.05] last:border-0"
                  style={{ gridTemplateColumns: COL_WIDTHS }}
                  onClick={() => setViewTask(task)}
                >
                  <div className="pr-4 min-w-0">
                    <p className={`text-sm font-semibold font-display truncate ${task.status === "done" ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"}`}>
                      {task.title}
                    </p>
                    {task.description && <p className="text-xs truncate mt-0.5 text-slate-500">{task.description}</p>}
                  </div>
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">{task.category || "—"}</span>
                  </div>
                  <div><Badge type={task.priority} /></div>
                  <div><Badge type={task.status} /></div>
                  <div className="text-xs font-mono text-slate-500">{formatDate(task.createdAt)}</div>
                  <div className={`text-xs font-mono ${task.dueDate ? "text-slate-700 dark:text-slate-300" : "text-slate-400"}`}>{formatDate(task.dueDate)}</div>
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button title="View"    className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"    onClick={() => setViewTask(task)}><Eye size={13} /></button>
                    <button title="Edit"    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"  onClick={() => setEditTask(task)}><Pencil size={13} /></button>
                    <button title="Explain" className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"    onClick={() => handleExplainTask(task)}><Sparkles size={13} /></button>
                    {task.status !== "done" && (
                      <button title="Mark done" className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" onClick={() => handleComplete(task.id)}><CheckCheck size={13} /></button>
                    )}
                    <button title="Delete" className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all"   onClick={() => setDeleteId(task.id)}><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filtered.map((task) => (
                <div key={task.id} className="p-4 hover:bg-cyan-500/[0.04] transition-colors cursor-pointer" onClick={() => setViewTask(task)}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className={`text-sm font-semibold font-display flex-1 ${task.status === "done" ? "text-slate-400 line-through" : "text-slate-900 dark:text-slate-100"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all" onClick={() => setEditTask(task)}><Pencil size={13} /></button>
                      {task.status !== "done" && (
                        <button className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" onClick={() => handleComplete(task.id)}><CheckCheck size={13} /></button>
                      )}
                      <button className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all" onClick={() => setDeleteId(task.id)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                  {task.description && <p className="text-xs text-slate-500 mb-2 line-clamp-1">{task.description}</p>}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge type={task.status} />
                    <Badge type={task.priority} />
                    {task.category && <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">{task.category}</span>}
                    {task.dueDate && <span className="text-xs font-mono text-slate-500">{formatDate(task.dueDate)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={confirmDelete} />

      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} title="Create New Task" size="md">
        <TaskForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="md">
        {editTask && <TaskForm initial={editTask} onSubmit={handleUpdate} onCancel={() => setEditTask(null)} />}
      </Modal>

      <Modal isOpen={!!viewTask} onClose={() => setViewTask(null)} title="Task Details" size="md">
        {viewTask && (
          <div className="space-y-4">
            <div>
              <h3 className={`text-xl font-bold mb-3 font-display text-slate-900 dark:text-slate-100 ${viewTask.status === "done" ? "line-through opacity-50" : ""}`}>
                {viewTask.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge type={viewTask.status} />
                <Badge type={viewTask.priority} />
                {viewTask.category && <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">{viewTask.category}</span>}
              </div>
            </div>

            {viewTask.description && (
              <p className="text-sm leading-relaxed rounded-xl p-4 bg-black/[0.03] border border-slate-200 text-slate-600 dark:bg-white/[0.03] dark:border-white/[0.06] dark:text-slate-400">
                {viewTask.description}
              </p>
            )}

            {viewTask.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {viewTask.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded bg-cyan-500/[0.08] text-cyan-700 dark:text-cyan-400 font-mono">#{tag}</span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[{ label: "Due Date", value: formatDate(viewTask.dueDate) }, { label: "Created", value: formatDate(viewTask.createdAt) }].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3 bg-black/[0.03] border border-slate-200 dark:bg-white/[0.03] dark:border-white/[0.06]">
                  <p className="text-xs mb-1 font-mono uppercase tracking-wider text-slate-500">{label}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setViewTask(null); setEditTask(viewTask); }}>Edit Task</Button>
              <Button variant="ghost" size="sm" onClick={() => { handleExplainTask(viewTask); setViewTask(null); }}>
                <Sparkles size={13} /> Ask AI
              </Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={() => { setViewTask(null); setDeleteId(viewTask.id); }}>Delete</Button>
            </div>
          </div>
        )}
      </Modal>

      <AIAssistant
        isOpen={aiOpen}
        onClose={() => { setAiOpen(false); setAiPrompt(null); }}
        initialPrompt={aiPrompt}
      />
    </div>
  );
}
