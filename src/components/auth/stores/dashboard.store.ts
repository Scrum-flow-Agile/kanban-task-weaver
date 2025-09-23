import { create } from 'zustand';
import { apiRequest } from '@/lib/queryClient';

interface DashboardMetrics {
  completedTasks: number;
  inProgressTasks: number;
  teamMembers: number;
  activeWorkspaces?: number;
  totalWorkspaces?: number;
}

interface Meeting {
  id: string;
  title: string;
  description: string;
  dateTime: Date;
  link: string;
  createdAt: Date;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

interface DashboardStore {
  metrics: DashboardMetrics;
  meetings: Meeting[];
  loading: boolean;
  error: string | null;
  fetchMetrics: () => Promise<void>;
  fetchMeetings: () => Promise<void>;
  createMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => Promise<void>;
  deleteMeeting: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  metrics: {
    completedTasks: 0,
    inProgressTasks: 0,
    teamMembers: 0,
    activeWorkspaces: 0,
    totalWorkspaces: 0
  },
  meetings: [],
  loading: false,
  error: null,

  fetchMetrics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiRequest('GET', '/dashboard/metrics');
      set({ metrics: response.data });
    } catch (error: any) {
      console.error('Failed to fetch metrics:', error);
      set({ error: error.message || 'Failed to load metrics' });
    } finally {
      set({ loading: false });
    }
  },

  fetchMeetings: async () => {
    set({ loading: true, error: null });
    try {
      const response = await apiRequest('GET', '/dashboard/meetings');
      set({ meetings: response.data });
    } catch (error: any) {
      console.error('Failed to fetch meetings:', error);
      set({ error: error.message || 'Failed to load meetings' });
    } finally {
      set({ loading: false });
    }
  },

  createMeeting: async (meetingData) => {
    try {
      const response = await apiRequest('POST', '/dashboard/meetings', meetingData);
      const newMeeting = response.data;
      set(state => ({ meetings: [...state.meetings, newMeeting] }));
      return newMeeting;
    } catch (error: any) {
      console.error('Failed to create meeting:', error);
      throw new Error(error.message || 'Failed to create meeting');
    }
  },

  deleteMeeting: async (id) => {
    try {
      await apiRequest('DELETE', `/dashboard/meetings/${id}`);
      set(state => ({ 
        meetings: state.meetings.filter(meeting => meeting.id !== id) 
      }));
    } catch (error: any) {
      console.error('Failed to delete meeting:', error);
      throw new Error(error.message || 'Failed to delete meeting');
    }
  },

  clearError: () => set({ error: null })
}));