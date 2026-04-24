import { useState } from "react";
import { MapPin, Calendar, Briefcase, Edit3, Save, X, CheckCircle2, Clock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import { useTheme } from "../context/ThemeContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { tasks } = useTasks();
  const { isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || "", bio: user?.bio || "", role: user?.role || "", location: user?.location || "" });

  const t  = (d, l) => isDark ? d : l;
  const h1 = t("#f1f5f9", "#0f172a");
  const h2 = t("#e2e8f0", "#1e293b");
  const p1 = t("#94a3b8", "#475569");
  const p2 = t("#475569", "#94a3b8");
  const bg = t("rgba(255,255,255,0.03)", "rgba(0,0,0,0.02)");
  const br = t("rgba(255,255,255,0.06)", "#e2e8f0");

  const stats = {
    total:      tasks.length,
    done:       tasks.filter((t) => t.status === "done").length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    rate:       tasks.length ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) : 0,
  };

  const recentTasks = tasks.slice(0, 4);

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const infoRow = (Icon, value) => (
    <div className="flex items-center gap-2.5 text-sm">
      <Icon size={14} style={{ color: "#06b6d4", flexShrink: 0 }} />
      <span style={{ color: value ? p1 : p2, fontStyle: value ? "normal" : "italic" }}>
        {value || "Not set"}
      </span>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 animate-fade-in max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: h1 }}>
          My Profile
        </h1>
        <p className="mt-1 text-sm" style={{ color: p2 }}>Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="space-y-5">
          <div className="card text-center">
            <div className="flex justify-center mb-4">
              <Avatar name={user?.name} size="xl" />
            </div>
            {!editing ? (
              <>
                <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: h1 }}>
                  {user?.name}
                </h2>
                <p className="text-sm font-medium mb-3" style={{ color: "#06b6d4" }}>{user?.role || "Team Member"}</p>
                {user?.bio && <p className="text-sm leading-relaxed mb-4" style={{ color: p1 }}>{user.bio}</p>}
                <div className="space-y-2.5 text-left mb-5">
                  {infoRow(Mail,     user?.email)}
                  {infoRow(MapPin,   user?.location)}
                  {infoRow(Calendar, user?.joined)}
                  {infoRow(Briefcase,user?.role)}
                </div>
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="w-full">
                  <Edit3 size={14} /> Edit Profile
                </Button>
              </>
            ) : (
              <div className="space-y-3 text-left">
                <Input label="Name"       value={form.name}     onChange={(e) => setForm((f) => ({ ...f, name:     e.target.value }))} />
                <Input label="Role"       value={form.role}     onChange={(e) => setForm((f) => ({ ...f, role:     e.target.value }))} />
                <Input label="Location"   value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: p1, fontFamily: "'DM Sans', sans-serif" }}>Bio</label>
                  <textarea
                    className="input-field text-sm"
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    style={{ resize: "none" }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSave} className="flex-1"><Save size={13} /> Save</Button>
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="flex-1"><X size={13} /> Cancel</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total",      value: stats.total,      color: "#06b6d4" },
              { label: "Completed",  value: stats.done,       color: "#34d399" },
              { label: "In Progress",value: stats.inprogress, color: "#818cf8" },
              { label: "Rate",       value: `${stats.rate}%`, color: "#f59e0b" },
            ].map(({ label, value, color }) => (
              <div key={label} className="card text-center py-4">
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color }}>{value}</div>
                <div className="text-xs uppercase tracking-wider font-mono" style={{ color: p2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm" style={{ fontFamily: "'Syne', sans-serif", color: h2 }}>Overall Progress</h3>
              <span className="text-sm font-mono" style={{ color: "#06b6d4" }}>{stats.rate}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0" }}>
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${stats.rate}%`, background: "linear-gradient(90deg, #0e7490, #06b6d4)" }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs font-mono" style={{ color: p2 }}>
              <span>0 tasks</span>
              <span>{stats.total} total</span>
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="card">
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif", color: h2 }}>Recent Tasks</h3>
            {recentTasks.length === 0 && (
              <p className="text-sm text-center py-6" style={{ color: p2 }}>No tasks yet.</p>
            )}
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: bg, border: `1px solid ${br}` }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: task.status === "done" ? "rgba(52,211,153,0.12)" : "rgba(6,182,212,0.1)" }}
                  >
                    {task.status === "done"
                      ? <CheckCircle2 size={14} style={{ color: "#34d399" }} />
                      : <Clock        size={14} style={{ color: "#06b6d4" }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        color: task.status === "done" ? p2 : h2,
                        textDecoration: task.status === "done" ? "line-through" : "none",
                      }}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs" style={{ color: p2 }}>{task.category}</p>
                  </div>
                  <Badge type={task.priority} />
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="card">
            <h3 className="font-semibold text-sm mb-4" style={{ fontFamily: "'Syne', sans-serif", color: h2 }}>Account Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Email",        value: user?.email },
                { label: "Member Since", value: user?.joined },
                { label: "Role",         value: user?.role || "Team Member" },
                { label: "Location",     value: user?.location || "Not specified" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs mb-0.5 uppercase tracking-wider font-mono" style={{ color: p2 }}>{label}</p>
                  <p className="font-medium" style={{ color: h2 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
