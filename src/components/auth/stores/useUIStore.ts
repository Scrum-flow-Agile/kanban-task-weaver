import { create } from 'zustand';

interface UIState {
  modals: {
    workspace: boolean;
    task: boolean;
    user: boolean;
    manageTasks: boolean;
  };
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
}

export const useUIStore = create<UIState>((set) => ({
  modals: {
    workspace: false,
    task: false,
    user: false,
    manageTasks: false,
  },
  
  openModal: (modal) => set((state) => ({
    modals: { ...state.modals, [modal]: true }
  })),
  
  closeModal: (modal) => set((state) => ({
    modals: { ...state.modals, [modal]: false }
  })),
}));