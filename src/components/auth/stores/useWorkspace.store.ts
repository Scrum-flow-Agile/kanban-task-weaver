import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workspace {
  id: number;
  name: string;
  description: string;
  members: number[];
  owner?: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  editingItem: Workspace | null;
  selectWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspaceData: Partial<Workspace>) => void;
  updateWorkspace: (id: number, workspaceData: Partial<Workspace>) => void;
  deleteWorkspace: (id: number) => void;
  setEditingItem: (item: Workspace | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      workspaces: [],
      selectedWorkspace: null,
      editingItem: null,
      
      selectWorkspace: (workspace) => set({ selectedWorkspace: workspace }),
      
      addWorkspace: (workspaceData) => {
        const newWorkspace: Workspace = {
          id: Date.now(),
          name: workspaceData.name || '',
          description: workspaceData.description || '',
          members: [1],
          owner: 'Current User',
        };
        set((state) => ({
          workspaces: [...state.workspaces, newWorkspace],
          selectedWorkspace: newWorkspace
        }));
      },
      
      updateWorkspace: (id, workspaceData) => {
        set((state) => ({
          workspaces: state.workspaces.map(workspace =>
            workspace.id === id ? { ...workspace, ...workspaceData } : workspace
          ),
          selectedWorkspace: state.selectedWorkspace?.id === id
            ? { ...state.selectedWorkspace, ...workspaceData }
            : state.selectedWorkspace
        }));
      },
      
      deleteWorkspace: (id) => {
        set((state) => ({
          workspaces: state.workspaces.filter(workspace => workspace.id !== id),
          selectedWorkspace: state.selectedWorkspace?.id === id ? null : state.selectedWorkspace
        }));
      },
      
      setEditingItem: (item) => set({ editingItem: item }),
    }),
    {
      name: 'workspace-storage',
    }
  )
);