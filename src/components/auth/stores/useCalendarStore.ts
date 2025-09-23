import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subtask {
  id: number;
  title: string;
  description: string;
  status: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  completed: boolean;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inprogress' | 'qa' | 'blocked' | 'done';
  assignee: string;
  tags: string[];
  color: string;
  subtasks: Subtask[];
  createdBy: string;
  workspaceId: number;
  startDate?: string;
  endDate?: string;
}

interface CalendarStore {
  tasks: Task[];
  currentView: 'month' | 'week' | 'day';
  currentDate: Date;
  filters: {
    status: string;
    assignee: string;
    search: string;
  };
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: number, updates: Partial<Task>) => void;
  deleteTask: (taskId: number) => void;
  moveTask: (taskId: number, newDate: string) => void;
  setView: (view: 'month' | 'week' | 'day') => void;
  setCurrentDate: (date: Date) => void;
  setFilter: (filter: keyof CalendarStore['filters'], value: string) => void;
  clearFilters: () => void;
  getFilteredTasks: () => Task[];
  getUpcomingTasks: () => Task[];
  getDueTodayTasks: () => Task[];
  subscribeToUpdates: (workspaceId: number) => void;
  unsubscribeFromUpdates: () => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      currentView: 'month',
      currentDate: new Date(),
      filters: {
        status: 'all',
        assignee: 'all',
        search: ''
      },

      setTasks: (tasks) => set({ tasks }),

      addTask: (task) => set((state) => ({ 
        tasks: [...state.tasks, task] 
      })),

      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      })),

      deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== taskId)
      })),

      moveTask: (taskId, newDate) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === taskId ? { ...task, dueDate: newDate } : task
        )
      })),

      setView: (view) => set({ currentView: view }),

      setCurrentDate: (date) => set({ currentDate: date }),

      setFilter: (filter, value) => set((state) => ({
        filters: { ...state.filters, [filter]: value }
      })),

      clearFilters: () => set({ 
        filters: { status: 'all', assignee: 'all', search: '' } 
      }),

      getFilteredTasks: () => {
        const { tasks, filters } = get();
        return tasks.filter(task => {
          const matchesSearch = filters.search === '' || 
            task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            task.description.toLowerCase().includes(filters.search.toLowerCase());
          const matchesStatus = filters.status === 'all' || task.status === filters.status;
          const matchesAssignee = filters.assignee === 'all' || task.assignee === filters.assignee;
          
          return matchesSearch && matchesStatus && matchesAssignee;
        });
      },

      getUpcomingTasks: () => {
        const tasks = get().getFilteredTasks();
        const today = new Date();
        const fiveDaysLater = new Date(today);
        fiveDaysLater.setDate(today.getDate() + 5);
        
        return tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate > today && dueDate <= fiveDaysLater;
        });
      },

      getDueTodayTasks: () => {
        const tasks = get().getFilteredTasks();
        const today = new Date().toDateString();
        
        return tasks.filter(task => 
          new Date(task.dueDate).toDateString() === today
        );
      },

      subscribeToUpdates: (workspaceId) => {
        // Simulate real-time updates - replace with actual WebSocket
        console.log('Subscribed to workspace:', workspaceId);
      },

      unsubscribeFromUpdates: () => {
        console.log('Unsubscribed from updates');
      }
    }),
    {
      name: 'calendar-storage',
      partialize: (state) => ({ 
        tasks: state.tasks,
        currentView: state.currentView,
        currentDate: state.currentDate.toISOString()
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.currentDate = new Date(state.currentDate);
        }
      }
    }
  )
);