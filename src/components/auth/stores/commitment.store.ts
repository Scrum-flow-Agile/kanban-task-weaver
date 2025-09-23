import { create } from "zustand";

export type CommitmentStatus = "all" | "upcoming" | "dueToday" | "completed" | "archived";

export interface Commitment {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  status: CommitmentStatus;
  createdAt: string;
  updatedAt: string;
}

interface CommitmentState {
  commitments: Commitment[];
  filter: CommitmentStatus;
  addCommitment: (commitment: Omit<Commitment, "id" | "createdAt" | "updatedAt">) => void;
  updateCommitment: (id: string, updated: Partial<Commitment>) => void;
  deleteCommitment: (id: string) => void;
  setFilter: (filter: CommitmentStatus) => void;
  getFilteredCommitments: () => Commitment[];
}

export const useCommitmentStore = create<CommitmentState>((set, get) => ({
  commitments: [],
  filter: "all",

  addCommitment: (commitment) =>
    set((state) => {
      const newCommitment: Commitment = {
        ...commitment,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return { commitments: [...state.commitments, newCommitment] };
    }),

  updateCommitment: (id, updated) =>
    set((state) => ({
      commitments: state.commitments.map((c) =>
        c.id === id ? { ...c, ...updated, updatedAt: new Date().toISOString() } : c
      ),
    })),

  deleteCommitment: (id) =>
    set((state) => ({
      commitments: state.commitments.filter((c) => c.id !== id),
    })),

  setFilter: (filter) => set({ filter }),

  getFilteredCommitments: () => {
    const { commitments, filter } = get();
    const today = new Date().toISOString().split("T")[0];

    switch (filter) {
      case "upcoming":
        return commitments.filter((c) => c.dueDate && c.dueDate > today);
      case "dueToday":
        return commitments.filter((c) => c.dueDate && c.dueDate.startsWith(today));
      case "completed":
        return commitments.filter((c) => c.status === "completed");
      case "archived":
        return commitments.filter((c) => c.status === "archived");
      default:
        return commitments;
    }
  },
}));