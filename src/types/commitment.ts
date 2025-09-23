export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Not Started' | 'In Progress' | 'Completed';


export interface Commitment {
id: string;
title: string;
dueDate: string; // ISO
assigneeId?: string | null;
assignee?: { id: string; name: string } | null;
linkedTaskId?: string | null;
priority: Priority;
status: Status;
createdAt: string;
updatedAt: string;
archived?: boolean;
}