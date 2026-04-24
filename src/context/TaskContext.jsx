import { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "./AuthContext";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setTasks([]);
      setTasksLoading(false);
      return;
    }

    // Real-time listener — updates tasks whenever Firestore changes
    const q = query(
      collection(db, "tasks"),
      where("uid", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate
          ? d.data().createdAt.toDate().toISOString().split("T")[0]
          : d.data().createdAt || "",
      }));
      // Sort client-side by createdAt descending — no composite index needed
      fetched.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setTasks(fetched);
      setTasksLoading(false);
    }, (error) => {
      console.error("Firestore tasks error:", error.message);
      setTasksLoading(false);
    });

    return unsub;
  }, [user?.uid]);

  const addTask = async (task) => {
    await addDoc(collection(db, "tasks"), {
      uid:         user.uid,
      title:       task.title       || "",
      description: task.description || "",
      status:      task.status      || "todo",
      priority:    task.priority    || "medium",
      category:    task.category    || "Engineering",
      tags:        task.tags        || [],
      dueDate:     task.dueDate     || "",
      createdAt:   serverTimestamp(),
    });
  };

  const updateTask = async (id, updates) => {
    const ref = doc(db, "tasks", id);
    await updateDoc(ref, {
      ...(updates.title       !== undefined && { title:       updates.title }),
      ...(updates.description !== undefined && { description: updates.description }),
      ...(updates.status      !== undefined && { status:      updates.status }),
      ...(updates.priority    !== undefined && { priority:    updates.priority }),
      ...(updates.category    !== undefined && { category:    updates.category }),
      ...(updates.tags        !== undefined && { tags:        updates.tags }),
      ...(updates.dueDate     !== undefined && { dueDate:     updates.dueDate }),
    });
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  return (
    <TaskContext.Provider value={{ tasks, tasksLoading, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
