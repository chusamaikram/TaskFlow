import { useState } from "react";
import { MapPin, Calendar, Briefcase, Edit3, Save, X, CheckCircle2, Clock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import Avatar from "../components/ui/Avatar";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";

function InfoRow({ Icon, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm min-w-0">
      <Icon size={14} className="text-cyan-500 flex-shrink-0" />
      <span className={`truncate ${value ? "text-slate-400" : "text-slate-600 italic"}`}>
        {value || "Not set"}
      </span>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="card text-center py-3 sm:py-4">
      <div className={`text-xl sm:text-2xl font-bold mb-0.5 font-display ${color}`}>{value}</div>
      <div className="text-xs uppercase tracking-wider font-mono text-slate-500">{label}</div>
    </div>
  );
}

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const { tasks } = useTasks();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:     user?.name     || "",
    bio:      user?.bio      || "",
    role:     user?.role     || "",
    location: user?.location || "",
  });

  const stats = {
    total:      tasks.length,
    done:       tasks.filter((t) => t.status === "done").length,
    inprogress: tasks.filter((t) => t.status === "inprogress").length,
    rate:       tasks.length ? Math.round((tasks.filter((t) => t.status === "done").length / tasks.length) * 100) : 0,
  };

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const handleCancel = () => {
    setForm({ name: user?.name || "", bio: user?.bio || "", role: user?.role || "", location: user?.location || "" });
    setEditing(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="max-w-5xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-slate-100 light:text-slate-900">My Profile</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your personal information</p>
        </div>

        {/* ── Mobile: profile card compact row ── */}
        <div className="flex items-center gap-4 card mb-5 lg:hidden">
          <Avatar name={user?.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold font-display text-slate-100 light:text-slate-900 truncate">{user?.name}</h2>
            <p className="text-xs text-cyan-500 mb-1">{user?.role || "Team Member"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="flex-shrink-0">
              <Edit3 size={13} />
            </Button>
          )}
        </div>

        {/* ── Mobile edit form (shown inline when editing) ── */}
        {editing && (
          <div className="card mb-5 lg:hidden space-y-3">
            <h3 className="text-sm font-semibold font-display text-slate-200">Edit Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Name"     value={form.name}     onChange={(e) => setForm((f) => ({ ...f, name:     e.target.value }))} />
              <Input label="Role"     value={form.role}     onChange={(e) => setForm((f) => ({ ...f, role:     e.target.value }))} />
              <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs mb-1.5 text-slate-400">Bio</label>
              <textarea
                className="input-field text-sm resize-none"
                rows={2}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="flex-1"><Save size={13} /> Save</Button>
              <Button variant="ghost" size="sm" onClick={handleCancel} className="flex-1"><X size={13} /> Cancel</Button>
            </div>
          </div>
        )}

        {/* Stats — full width on all screens */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
          <StatCard label="Total"       value={stats.total}      color="text-cyan-500"    />
          <StatCard label="Completed"   value={stats.done}       color="text-emerald-400" />
          <StatCard label="In Progress" value={stats.inprogress} color="text-indigo-400"  />
          <StatCard label="Rate"        value={`${stats.rate}%`} color="text-amber-400"   />
        </div>

        {/* ── Main grid: sidebar + content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left sidebar — hidden on mobile (replaced by compact row above) */}
          <div className="hidden lg:block space-y-5">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <Avatar name={user?.name} size="xl" />
              </div>

              {!editing ? (
                <>
                  <h2 className="text-xl font-bold mb-1 font-display text-slate-100 light:text-slate-900">{user?.name}</h2>
                  <p className="text-sm font-medium mb-3 text-cyan-500">{user?.role || "Team Member"}</p>
                  {user?.bio && <p className="text-sm leading-relaxed mb-4 text-slate-400">{user.bio}</p>}
                  <div className="space-y-2.5 text-left mb-5">
                    <InfoRow Icon={Mail}      value={user?.email} />
                    <InfoRow Icon={MapPin}    value={user?.location} />
                    <InfoRow Icon={Calendar}  value={user?.joined} />
                    <InfoRow Icon={Briefcase} value={user?.role} />
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="w-full">
                    <Edit3 size={14} /> Edit Profile
                  </Button>
                </>
              ) : (
                <div className="space-y-3 text-left">
                  <Input label="Name"     value={form.name}     onChange={(e) => setForm((f) => ({ ...f, name:     e.target.value }))} />
                  <Input label="Role"     value={form.role}     onChange={(e) => setForm((f) => ({ ...f, role:     e.target.value }))} />
                  <Input label="Location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
                  <div>
                    <label className="block text-xs mb-1.5 text-slate-400">Bio</label>
                    <textarea
                      className="input-field text-sm resize-none"
                      rows={3}
                      value={form.bio}
                      onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} className="flex-1"><Save size={13} /> Save</Button>
                    <Button variant="ghost" size="sm" onClick={handleCancel} className="flex-1"><X size={13} /> Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Progress bar */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm font-display text-slate-200 light:text-slate-800">Overall Progress</h3>
                <span className="text-sm font-mono text-cyan-500">{stats.rate}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/[0.06] light:bg-slate-200">
                <div
                  className="h-1.5 rounded-full transition-all duration-700 bg-gradient-to-r from-cyan-800 to-cyan-500"
                  style={{ width: `${stats.rate}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs font-mono text-slate-500">
                <span>0 tasks</span>
                <span>{stats.total} total</span>
              </div>
            </div>

            {/* Recent Tasks */}
            <div className="card">
              <h3 className="font-semibold text-sm mb-4 font-display text-slate-200 light:text-slate-800">Recent Tasks</h3>
              {tasks.length === 0 ? (
                <p className="text-sm text-center py-6 text-slate-500">No tasks yet.</p>
              ) : (
                <div className="space-y-2">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] light:bg-black/[0.02] light:border-slate-200">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${task.status === "done" ? "bg-emerald-500/10" : "bg-cyan-500/10"}`}>
                        {task.status === "done"
                          ? <CheckCircle2 size={14} className="text-emerald-400" />
                          : <Clock        size={14} className="text-cyan-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium font-display truncate ${task.status === "done" ? "text-slate-500 line-through" : "text-slate-200 light:text-slate-800"}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-slate-500">{task.category}</p>
                      </div>
                      <Badge type={task.priority} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Account Details */}
            <div className="card">
              <h3 className="font-semibold text-sm mb-4 font-display text-slate-200 light:text-slate-800">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Email",        value: user?.email },
                  { label: "Member Since", value: user?.joined },
                  { label: "Role",         value: user?.role || "Team Member" },
                  { label: "Location",     value: user?.location || "Not specified" },
                ].map(({ label, value }) => (
                  <div key={label} className="min-w-0">
                    <p className="text-xs mb-0.5 uppercase tracking-wider font-mono text-slate-500">{label}</p>
                    <p className="font-medium text-slate-200 light:text-slate-800 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
