import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db, getModel } from "../firebase/firebaseConfig";
import { useAuth } from "./AuthContext";
import { useTasks } from "./TaskContext";

const AIContext = createContext(null);

export function buildSystemContext(tasks, user) {
  const today = new Date().toISOString().split("T")[0];
  const summary = tasks.map((t) =>
    `- [${t.status}] "${t.title}" | priority: ${t.priority} | due: ${t.dueDate || "none"} | category: ${t.category}`
  ).join("\n");
  return `You are an AI productivity assistant inside TaskFlow, a task management app.
Today's date: ${today}
User: ${user?.name} (${user?.role || "Team Member"})

User's current tasks (${tasks.length} total):
${summary || "No tasks yet."}

Keep responses concise, helpful, and formatted with markdown where useful. Focus on actionable advice.
When asked to create tasks, respond with a JSON block like:
\`\`\`json
{"tasks": [{"title": "...", "priority": "high|medium|low", "category": "...", "dueDate": "YYYY-MM-DD or empty"}]}
\`\`\`
followed by a brief explanation.`;
}

export function AIProvider({ children }) {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [briefing, setBriefing] = useState(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  // Load sessions list
  useEffect(() => {
    if (!user?.uid) { setSessions([]); return; }
    const q = query(
      collection(db, "aiChats", user.uid, "sessions"),
      orderBy("updatedAt", "desc")
    );
    return onSnapshot(q, (snap) => {
      setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [user?.uid]);

  // Load messages for active session
  useEffect(() => {
    if (!user?.uid || !activeSessionId) { setMessages([]); return; }
    const q = query(
      collection(db, "aiChats", user.uid, "sessions", activeSessionId, "messages"),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [user?.uid, activeSessionId]);

  const createSession = useCallback(async (title = "New Chat") => {
    if (!user?.uid) return null;
    const ref = await addDoc(collection(db, "aiChats", user.uid, "sessions"), {
      title,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setActiveSessionId(ref.id);
    return ref.id;
  }, [user?.uid]);

  const deleteSession = useCallback(async (sessionId) => {
    if (!user?.uid) return;
    await deleteDoc(doc(db, "aiChats", user.uid, "sessions", sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([]);
    }
  }, [user?.uid, activeSessionId]);

  const sendMessage = useCallback(async (text, sessionId) => {
    if (!text?.trim() || streaming || !user?.uid) return;
    let sid = sessionId || activeSessionId;

    // Create session if none exists
    if (!sid) sid = await createSession(text.slice(0, 40));

    setStreaming(true);

    // Save user message to Firestore
    await addDoc(collection(db, "aiChats", user.uid, "sessions", sid, "messages"), {
      role: "user",
      text,
      createdAt: serverTimestamp(),
    });

    // Build chat history excluding the current message (last 20, skip last user msg)
    const history = messages.slice(-20).filter((m) => m.text).map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const chat = getModel(buildSystemContext(tasks, user)).startChat({ history });

    // Add optimistic AI message
    const aiDocRef = await addDoc(collection(db, "aiChats", user.uid, "sessions", sid, "messages"), {
      role: "ai",
      text: "",
      createdAt: serverTimestamp(),
    });

    try {
      const result = await chat.sendMessageStream(text);
      let full = "";
      for await (const chunk of result.stream) {
        full += chunk.text();
        // Update local state optimistically for smooth streaming
        setMessages((prev) => {
          const idx = prev.findIndex((m) => m.id === aiDocRef.id);
          if (idx === -1) return [...prev, { id: aiDocRef.id, role: "ai", text: full, streaming: true }];
          const updated = [...prev];
          updated[idx] = { ...updated[idx], text: full, streaming: true };
          return updated;
        });
      }
      // Persist final AI response
      await updateDoc(doc(db, "aiChats", user.uid, "sessions", sid, "messages", aiDocRef.id), { text: full });
      // Update session title (first message) and timestamp
      await updateDoc(doc(db, "aiChats", user.uid, "sessions", sid), {
        updatedAt: serverTimestamp(),
        ...(messages.length === 0 && { title: text.slice(0, 45) }),
      });
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === aiDocRef.id);
        if (idx === -1) return prev;
        const updated = [...prev];
        updated[idx] = { ...updated[idx], text: full, streaming: false };
        return updated;
      });
    } catch {
      await updateDoc(doc(db, "aiChats", user.uid, "sessions", sid, "messages", aiDocRef.id), {
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setStreaming(false);
    }
  }, [user, tasks, messages, streaming, activeSessionId, createSession]);

  const generateBriefing = useCallback(async () => {
    if (!user?.uid || briefingLoading) return;
    setBriefingLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const overdue = tasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== "done");
      const dueToday = tasks.filter((t) => t.dueDate === today && t.status !== "done");
      const inProgress = tasks.filter((t) => t.status === "inprogress");
      const prompt = `Give a 2-sentence daily briefing. Overdue: ${overdue.length}, Due today: ${dueToday.length}, In progress: ${inProgress.length}. Be direct and motivating.`;
      const result = await getModel().generateContent(prompt);
      setBriefing(result.response.text());
    } catch {
      setBriefing(null);
    } finally {
      setBriefingLoading(false);
    }
  }, [user?.uid, tasks, briefingLoading]);

  const generateWeeklyReport = useCallback(async () => {
    const prompt = `Generate a brief weekly productivity report based on these tasks:\n${buildSystemContext(tasks, user)}\nFormat: 3-4 bullet points covering completed work, in-progress items, and recommendations.`;
    const result = await getModel().generateContent(prompt);
    return result.response.text();
  }, [tasks, user]);

  const suggestDueDate = useCallback(async (title, priority, category) => {
    const today = new Date().toISOString().split("T")[0];
    const workload = tasks.filter((t) => t.status !== "done").length;
    const prompt = `Suggest a due date for this task: "${title}" (priority: ${priority}, category: ${category}). Today is ${today}. User has ${workload} active tasks. Reply with ONLY a date in YYYY-MM-DD format, nothing else.`;
    const result = await getModel().generateContent(prompt);
    return result.response.text().trim();
  }, [tasks]);

  const explainTask = useCallback(async (task) => {
    const prompt = `Explain this task and suggest how to approach it: "${task.title}". Description: "${task.description || "none"}". Priority: ${task.priority}, Category: ${task.category}, Due: ${task.dueDate || "no due date"}. Keep it to 3-4 sentences.`;
    const result = await getModel().generateContent(prompt);
    return result.response.text();
  }, []);

  return (
    <AIContext.Provider value={{
      sessions, activeSessionId, setActiveSessionId,
      messages, streaming,
      briefing, briefingLoading,
      createSession, deleteSession, sendMessage,
      generateBriefing, generateWeeklyReport, suggestDueDate, explainTask,
    }}>
      {children}
    </AIContext.Provider>
  );
}

export const useAI = () => useContext(AIContext);
