import { useState } from "react";
import { Sparkles } from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import { useAI } from "../../context/AIContext";

const CATEGORIES = ["Design", "Engineering", "Product", "Management", "Marketing", "Other"];
const PRIORITIES  = ["high", "medium", "low"];
const STATUSES    = [{ value: "todo", label: "To Do" }, { value: "inprogress", label: "In Progress" }, { value: "done", label: "Done" }];

function ToggleBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 ${
        active
          ? "border-cyan-500 bg-cyan-500/15 text-cyan-400"
          : "border-cyan-500/15 bg-cyan-500/[0.04] text-slate-400 hover:border-cyan-500/30 hover:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function TaskForm({ initial = {}, onSubmit, onCancel }) {
  const { suggestDueDate } = useAI();
  const [form, setForm] = useState({
    title:       initial.title       || "",
    description: initial.description || "",
    status:      initial.status      || "todo",
    priority:    initial.priority    || "medium",
    category:    initial.category    || "Engineering",
    dueDate:     initial.dueDate     || "",
    tags:        initial.tags?.join(", ") || "",
  });
  const [errors, setErrors] = useState({});
  const [suggestingDate, setSuggestingDate] = useState(false);
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleSuggestDate = async () => {
    if (!form.title.trim()) { setErrors({ title: "Enter a title first" }); return; }
    setSuggestingDate(true);
    try {
      const date = await suggestDueDate(form.title, form.priority, form.category);
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) set("dueDate", date);
    } catch {}
    finally { setSuggestingDate(false); }
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { setErrors({ title: "Title is required" }); return; }
    onSubmit({ ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean) });
  };

  return (
    <div className="space-y-4">
      <Input label="Task Title" placeholder="What needs to be done?" value={form.title} onChange={(e) => set("title", e.target.value)} error={errors.title} />

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
        <textarea className="input-field resize-none" rows={3} placeholder="Add more context..." value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Status</label>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => <ToggleBtn key={s.value} active={form.status === s.value} onClick={() => set("status", s.value)}>{s.label}</ToggleBtn>)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Priority</label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => <ToggleBtn key={p} active={form.priority === p} onClick={() => set("priority", p)}>{p.charAt(0).toUpperCase() + p.slice(1)}</ToggleBtn>)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2">Category</label>
        <select className="input-field cursor-pointer" value={form.category} onChange={(e) => set("category", e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-slate-400">Due Date</label>
            <button
              type="button"
              onClick={handleSuggestDate}
              disabled={suggestingDate}
              className="flex items-center gap-1 text-xs transition-colors"
              style={{ color: "#06b6d4" }}
            >
              <Sparkles size={11} />
              {suggestingDate ? "Thinking..." : "AI suggest"}
            </button>
          </div>
          <input type="date" className="input-field" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        </div>
        <Input label="Tags (comma separated)" placeholder="UI, Frontend" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} className="flex-1">{initial.id ? "Update Task" : "Create Task"}</Button>
      </div>
    </div>
  );
}
