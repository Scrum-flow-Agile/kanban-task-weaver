import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Subtask {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  color: string;
  subtasks: Subtask[];
  createdBy: string;
  workspaceId: number;
}

interface TaskState {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
  setTasks: (tasks: Task[]) => void;
}

export const useTasksStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, ...updates } : t
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),
      setTasks: (tasks) => set({ tasks }),
    }),
    {
      name: "tasks-storage",
    }
  )
);
