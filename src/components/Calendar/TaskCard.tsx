import React from 'react';
import { Task } from '../auth/stores/useCalendarStore';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id.toString());
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onTaskClick(task)}
      className="cursor-pointer p-2 rounded text-xs border-l-4 hover:shadow-md transition-shadow"
      style={{ borderLeftColor: task.color }}
    >
      <div className="font-medium truncate">{task.title}</div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-gray-500 text-xs">{task.assignee}</span>
        <span className={`px-1 py-0.5 rounded text-xs ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>
    </div>
  );
};