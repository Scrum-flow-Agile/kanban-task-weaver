import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; 
import { Task } from '../auth/stores/useCalendarStore';
import { TaskCard } from './TaskCard';

interface DueTodayTasksProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const DueTodayTasks: React.FC<DueTodayTasksProps> = ({ tasks, onTaskClick }) => {
  const dueTodayTasks = tasks.filter(task => 
    new Date(task.dueDate).toDateString() === new Date().toDateString()
  );

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Due Today ({new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })})
        </h2>
        {dueTodayTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No tasks due today</p>
        ) : (
          <div className="space-y-2">
            {dueTodayTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onTaskClick={onTaskClick}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};