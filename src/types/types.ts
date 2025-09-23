// types.ts
export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

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
  status: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  color: string;
  subtasks: Subtask[];
  createdBy: string;
  workspaceId: number;
  comments?: Comment[];
}

export interface Column {
  id: string;
  title: string;
  color: string;
}