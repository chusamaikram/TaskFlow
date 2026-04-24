import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

const CATEGORIES = ["Design", "Engineering", "Product", "Management", "Marketing", "Other"];
const PRIORITIES = ["high", "medium", "low"];
const STATUSES = [
  { value: "todo", label: "To Do" },
  { value: "inprogress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export default function TaskForm({ initial = {}, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: initial.title || "",
    description: initial.description || "",
    status: initial.status || "todo",
    priority: initial.priority || "medium",
    category: initial.category || "Engineering",
    dueDate: initial.dueDate || "",
    tags: initial.tags?.join(", ") || "",
  });
  const [errors, setErrors] = useState({});

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSubmit({
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  const selectStyle = (value, active) => ({
    padding: "0.4rem 0.85rem",
    borderRadius: "0.5rem",
    border: "1px solid",
    borderColor: value === active ? "#06b6d4" : "rgba(6,182,212,0.15)",
    background: value === active ? "rgba(6,182,212,0.15)" : "rgba(6,182,212,0.04)",
    color: value === active ? "#22d3ee" : "#94a3b8",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    transition: "all 0.15s",
  });

  return (
    <div className="space-y-4 ">
      <Input
        label="Task Title"
        placeholder="What needs to be done?"
        value={form.title}
        onChange={(e) => set("title", e.target.value)}
        error={errors.title}
      />

      <div>
        <label className="block text-sm font-medium text-slate-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Description
        </label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Add more context..."
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          style={{ resize: "none" }}
        />
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Status</label>
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button key={s.value} type="button" style={selectStyle(s.value, form.status)} onClick={() => set("status", s.value)}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Priority</label>
        <div className="flex gap-2">
          {PRIORITIES.map((p) => (
            <button key={p} type="button" style={selectStyle(p, form.priority)} onClick={() => set("priority", p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-slate-400 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Category</label>
        <select
          className="input-field"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          style={{ background: "#0a1f2e", cursor: "pointer" }}
        >
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
        <Input label="Tags (comma separated)" placeholder="UI, Frontend" value={form.tags} onChange={(e) => set("tags", e.target.value)} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button onClick={handleSubmit} className="flex-1">
          {initial.id ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </div>
  );
}
