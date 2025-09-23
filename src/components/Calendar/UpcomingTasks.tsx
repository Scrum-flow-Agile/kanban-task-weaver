// src/components/Calendar/UpcomingTasks.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // Add this import
import { Task } from '../auth/stores/useCalendarStore';
import { TaskCard } from './TaskCard';

interface UpcomingTasksProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export const UpcomingTasks: React.FC<UpcomingTasksProps> = ({ tasks, onTaskClick }) => {
  const upcomingTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const fiveDaysLater = new Date(today);
    fiveDaysLater.setDate(today.getDate() + 5);
    return dueDate > today && dueDate <= fiveDaysLater;
  });

  const groupByDate = upcomingTasks.reduce((acc, task) => {
    const date = task.dueDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Tasks (Next 5 Days)</h2>
        {Object.keys(groupByDate).length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming tasks</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupByDate).map(([date, dateTasks]) => (
              <div key={date}>
                <h3 className="font-medium text-gray-900 mb-2">
                  {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  })}
                </h3>
                <div className="space-y-2">
                  {dateTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onTaskClick={onTaskClick}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};