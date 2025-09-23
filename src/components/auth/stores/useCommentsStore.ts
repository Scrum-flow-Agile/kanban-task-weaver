import { create } from "zustand";

export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
}

interface CommentsState {
  comments: Comment[];
  addComment: (content: string, author?: string) => void;
  clearComments: () => void;
}

export const useCommentsStore = create<CommentsState>((set) => ({
  comments: [],
  addComment: (content, author = "You") =>
    set((state) => ({
      comments: [
        ...state.comments,
        {
          id: state.comments.length + 1,
          author,
          content,
          timestamp: new Date().toISOString(),
        },
      ],
    })),
  clearComments: () => set({ comments: [] }),
}));
