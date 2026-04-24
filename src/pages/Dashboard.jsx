import { useState, useMemo } from "react";
import { Plus, Search, CheckCircle2, Clock, ListTodo, TrendingUp, Pencil, Trash2, CheckCheck, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfirmModal from "../components/ui/ConfirmModal";
import TaskForm from "../components/ui/TaskForm";
import StatsCard from "../components/ui/StatsCard";
import Badge from "../components/ui/Badge";
import ThemeToggle from "../components/ui/ThemeToggle";

const TABS = [
  { key: "all",        label: "All",        color: "#06b6d4" },
  { key: "todo",       label: "Pending",    color: "#64748b" },
  { key: "inprogress", label: "In Progress",color: "#818cf8" },
  { key: "done",       label: "Completed",  color: "#34d399" },
];

const COLUMNS = [
  { label: "Title",        width: "30%" },
  { label: "Category",     width: "12%" },
  { label: "Priority",     width: "10%" },
  { label: "Status",       width: "12%" },
  { label: "Created",      width: "12%" },
  { label: "Due Date",     width: "12%" },
  { label: "Actions",      width: "12%" },
];

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Dashboard() {
  const { tasks, tasksLoading, addTask, updateTask, deleteTask } = useTasks();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask]         = useState(null);
  const [viewTask, setViewTask]         = useState(null);
  const [deleteId, setDeleteId]         = useState(null);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const filtered = useMemo(() => tasks.filter((t) => {
    const matchSearch   = t.title.toLowerCase().includes(search.toLowerCase()) || t.description?.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchTab      = activeTab === "all" || t.status === activeTab;
    return matchSearch && matchPriority && matchTab;
  }), [tasks, search, filterPriority, activeTab]);

  const counts = useMemo(() => ({
    all:        tasks.length,
    todo:       tasks.filter((t) => t.status === "todo").length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    done:       tasks.filter((t) => t.status === "done").length,
  }), [tasks]);

  const stats = {
    total:      tasks.length,
    inprogress: counts.inprogress,
    done:       counts.done,
    rate:       tasks.length ? Math.round((counts.done / tasks.length) * 100) : 0,
  };

  const handleCreate   = (data) => { addTask(data); setCreateOpen(false); toast.success("Task created!"); };
  const handleUpdate   = (data) => { updateTask(editTask.id, data); setEditTask(null); toast.success("Task updated!"); };
  const handleDelete   = (id)   => { setDeleteId(id); };
  const confirmDelete  = ()     => { deleteTask(deleteId); toast.success("Task deleted."); };
  const handleComplete = (id)   => { updateTask(id, { status: "done" }); toast.success("Marked as completed! 🎉"); };

  const rowBg    = isDark ? "rgba(255,255,255,0.0)" : "#ffffff";
  const rowHover = isDark ? "rgba(6,182,212,0.04)"  : "#f8fafc";
  const border   = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)";
  const headBg   = isDark ? "#0b1e2d"               : "#f8fafc";
  const headText = isDark ? "#475569"               : "#94a3b8";
  const cellText = isDark ? "#cbd5e1"               : "#1e293b";
  const mutedText= isDark ? "#475569"               : "#94a3b8";

  return (
    <div className="p-6 lg:p-8 animate-fade-in">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm mb-1 font-mono" style={{ color: mutedText }}>{greeting},</p>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
              {user?.name?.split(" ")[0]} 
            </h1>
            <p className="mt-1 text-sm" style={{ color: mutedText }}>
              You have <span className="text-cyan-500 font-semibold">{stats.inprogress} tasks</span> in progress
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} /> New Task
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={ListTodo}     label="Total"       value={stats.total}      color="#06b6d4" sub="All tasks"   />
        <StatsCard icon={Clock}        label="In Progress" value={stats.inprogress} color="#818cf8" sub="Active now"  />
        <StatsCard icon={CheckCircle2} label="Completed"   value={stats.done}       color="#34d399" sub="All time"   />
        <StatsCard icon={TrendingUp}   label="Rate"        value={`${stats.rate}%`} color="#f59e0b" sub="Completion" />
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input className="input-field" style={{ paddingLeft: "2.5rem" }} placeholder="Search tasks..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="input-field" style={{ width: "auto", cursor: "pointer" }} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 mb-6 p-1 rounded-xl overflow-x-auto"
        style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}` }}
      >
        {TABS.map(({ key, label, color }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-shrink-0"
              style={{
                background: isActive ? (isDark ? `${color}18` : `${color}12`) : "transparent",
                color: isActive ? color : mutedText,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {label}
              <span
                className="text-xs px-1.5 py-0.5 rounded-md min-w-[20px] text-center"
                style={{
                  background: isActive ? `${color}20` : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                  color: isActive ? color : mutedText,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {tasksLoading ? (
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
          {/* Skeleton header */}
          <div
            className="grid px-4 py-3"
            style={{
              gridTemplateColumns: COLUMNS.map((c) => c.width).join(" "),
              background: headBg,
              borderBottom: `1px solid ${border}`,
            }}
          >
            {COLUMNS.map((col) => (
              <div
                key={col.label}
                className="h-3 rounded-md"
                style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0", width: "60%" }}
              />
            ))}
          </div>
          {/* Skeleton rows */}
          {Array(5).fill(0).map((_, i) => (
            <div
              key={i}
              className="grid items-center px-4 py-4"
              style={{
                gridTemplateColumns: COLUMNS.map((c) => c.width).join(" "),
                background: rowBg,
                borderBottom: i < 4 ? `1px solid ${border}` : "none",
                opacity: 1 - i * 0.15,
              }}
            >
              <div className="space-y-1.5 pr-4">
                <div className="h-3 rounded-md" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "#e2e8f0", width: "70%", animation: "pulse 1.5s ease-in-out infinite" }} />
                <div className="h-2.5 rounded-md" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "#f1f5f9", width: "45%", animation: "pulse 1.5s ease-in-out infinite" }} />
              </div>
              {["50%", "40%", "55%", "60%", "50%", "70%"].map((w, j) => (
                <div key={j} className="h-3 rounded-md" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0", width: w, animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          ))}
        </div>
      ) : (
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${border}` }}
      >
        {/* Table header */}
        <div
          className="grid text-xs font-semibold uppercase tracking-wider px-4 py-3"
          style={{
            gridTemplateColumns: COLUMNS.map((c) => c.width).join(" "),
            background: headBg,
            color: headText,
            borderBottom: `1px solid ${border}`,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {COLUMNS.map((col) => (
            <div key={col.label}>{col.label}</div>
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center py-16 gap-2"
            style={{ background: rowBg, color: mutedText }}
          >
            <ListTodo size={28} className="opacity-30" />
            <p className="text-sm font-mono">No tasks found</p>
          </div>
        )}

        {/* Rows */}
        {filtered.map((task, i) => (
          <div
            key={task.id}
            className="grid items-center px-4 py-3 cursor-pointer transition-colors"
            style={{
              gridTemplateColumns: COLUMNS.map((c) => c.width).join(" "),
              background: rowBg,
              borderBottom: i < filtered.length - 1 ? `1px solid ${border}` : "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = rowHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = rowBg; }}
            onClick={() => setViewTask(task)}
          >
            {/* Title */}
            <div className="pr-4 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: task.status === "done" ? mutedText : cellText,
                  textDecoration: task.status === "done" ? "line-through" : "none",
                }}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs truncate mt-0.5" style={{ color: mutedText }}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <span
                className="text-xs px-2 py-0.5 rounded-md"
                style={{
                  background: isDark ? "rgba(129,140,248,0.1)" : "rgba(129,140,248,0.08)",
                  color: isDark ? "#a5b4fc" : "#6366f1",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {task.category || "—"}
              </span>
            </div>

            {/* Priority */}
            <div><Badge type={task.priority} /></div>

            {/* Status */}
            <div><Badge type={task.status} /></div>

            {/* Created */}
            <div className="text-xs font-mono" style={{ color: mutedText }}>
              {formatDate(task.createdAt)}
            </div>

            {/* Due Date */}
            <div className="text-xs font-mono" style={{ color: task.dueDate ? cellText : mutedText }}>
              {formatDate(task.dueDate)}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {/* View */}
              <button
                title="View"
                className="p-1.5 rounded-lg transition-all"
                style={{ color: mutedText }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.background = "rgba(6,182,212,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = mutedText; e.currentTarget.style.background = "transparent"; }}
                onClick={() => setViewTask(task)}
              >
                <Eye size={13} />
              </button>

              {/* Edit */}
              <button
                title="Edit"
                className="p-1.5 rounded-lg transition-all"
                style={{ color: mutedText }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.background = "rgba(129,140,248,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = mutedText; e.currentTarget.style.background = "transparent"; }}
                onClick={() => setEditTask(task)}
              >
                <Pencil size={13} />
              </button>

              {/* Complete */}
              {task.status !== "done" && (
                <button
                  title="Mark as done"
                  className="p-1.5 rounded-lg transition-all"
                  style={{ color: mutedText }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#34d399"; e.currentTarget.style.background = "rgba(52,211,153,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = mutedText; e.currentTarget.style.background = "transparent"; }}
                  onClick={() => handleComplete(task.id)}
                >
                  <CheckCheck size={13} />
                </button>
              )}

              {/* Delete */}
              <button
                title="Delete"
                className="p-1.5 rounded-lg transition-all"
                style={{ color: mutedText }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = mutedText; e.currentTarget.style.background = "transparent"; }}
                onClick={() => handleDelete(task.id)}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
      )} {/* end tasksLoading */}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} title="Create New Task" size="md">
        <TaskForm onSubmit={handleCreate} onCancel={() => setCreateOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="md">
        {editTask && <TaskForm initial={editTask} onSubmit={handleUpdate} onCancel={() => setEditTask(null)} />}
      </Modal>

      {/* Detail Modal */}
      <Modal isOpen={!!viewTask} onClose={() => setViewTask(null)} title="Task Details" size="md">
        {viewTask && (
          <div className="space-y-4">
            <div>
              <h3
                className="text-xl font-bold mb-3"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: isDark ? "#f1f5f9" : "#0f172a",
                  textDecoration: viewTask.status === "done" ? "line-through" : "none",
                  opacity: viewTask.status === "done" ? 0.5 : 1,
                }}
              >
                {viewTask.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge type={viewTask.status} />
                <Badge type={viewTask.priority} />
                {viewTask.category && (
                  <span className="text-xs px-2 py-0.5 rounded-md" style={{ background: isDark ? "rgba(129,140,248,0.1)" : "rgba(129,140,248,0.1)", color: isDark ? "#a5b4fc" : "#6366f1", fontFamily: "'DM Sans', sans-serif" }}>
                    {viewTask.category}
                  </span>
                )}
              </div>
            </div>

            {viewTask.description && (
              <p className="text-sm leading-relaxed rounded-xl p-4" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}`, color: isDark ? "#94a3b8" : "#475569" }}>
                {viewTask.description}
              </p>
            )}

            {viewTask.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {viewTask.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded" style={{ background: isDark ? "rgba(6,182,212,0.08)" : "rgba(6,182,212,0.08)", color: isDark ? "#67e8f9" : "#0891b2", fontFamily: "'JetBrains Mono', monospace" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Due Date", value: formatDate(viewTask.dueDate) },
                { label: "Created",  value: formatDate(viewTask.createdAt) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl p-3" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", border: `1px solid ${border}` }}>
                  <p className="text-xs mb-1 font-mono uppercase tracking-wider" style={{ color: mutedText }}>{label}</p>
                  <p className="text-sm font-medium" style={{ color: cellText }}>{value}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-1">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => { setViewTask(null); setEditTask(viewTask); }}>
                Edit Task
              </Button>
              <Button variant="danger" size="sm" className="flex-1" onClick={() => { setViewTask(null); handleDelete(viewTask.id); }}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
