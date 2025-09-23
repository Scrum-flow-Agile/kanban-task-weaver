// src/components/Calendar/Calendar.tsx
import { useState, useEffect } from 'react';
import { useWorkspaceStore } from '@/components/auth/stores/useWorkspace.store';
import { useCalendarStore, Task } from '@/components/auth/stores/useCalendarStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { TaskModal } from '@/components/TaskModal';
import { toast } from '@/hooks/use-toast';
import { CalendarView } from './CalendarView';
import { WeekView } from './WeekView';
import { DayView } from './DayView';
import { UpcomingTasks } from './UpcomingTasks';
import { DueTodayTasks } from './DueTodayTasks';

const Calendar = () => {
  const { selectedWorkspace } = useWorkspaceStore();
  const {
    tasks,
    currentView,
    currentDate,
    filters,
    setTasks,
    setView,
    setCurrentDate,
    setFilter,
    getFilteredTasks,
    subscribeToUpdates,
    unsubscribeFromUpdates
  } = useCalendarStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    if (!selectedWorkspace) return;

    // Load initial tasks
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);

    const initialTasks: Task[] = [
      { 
        id: 1, 
        title: 'User Authentication', 
        description: 'Implement user login and registration',
        dueDate: today.toISOString().split('T')[0], 
        priority: 'high', 
        status: 'inprogress',
        assignee: 'John Doe',
        tags: ['backend', 'security'],
        color: '#ef4444',
        subtasks: [],
        createdBy: 'John Doe',
        workspaceId: selectedWorkspace.id
      },
      // ... other initial tasks
    ];

    setTasks(initialTasks);
    subscribeToUpdates(selectedWorkspace.id);

    return () => unsubscribeFromUpdates();
  }, [selectedWorkspace, setTasks, subscribeToUpdates, unsubscribeFromUpdates]);

  const handleTaskSave = (taskData: Partial<Task>) => {
    if (!selectedWorkspace) return;

    if (selectedTask && selectedTask.id) {
      useCalendarStore.getState().updateTask(selectedTask.id, taskData);
      toast({
        title: "Task Updated",
        description: "Task has been successfully updated",
      });
    } else {
      const newTask: Task = {
        id: Date.now(),
        title: taskData.title || '',
        description: taskData.description || '',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        assignee: taskData.assignee || '',
        tags: taskData.tags || [],
        color: taskData.color || '#6b7280',
        subtasks: taskData.subtasks || [],
        createdBy: 'Current User', // Replace with actual user
        workspaceId: selectedWorkspace.id
      };
      useCalendarStore.getState().addTask(newTask);
      toast({
        title: "Task Created",
        description: "New task has been created successfully",
      });
    }
    setSelectedTask(null);
    setIsTaskModalOpen(false);
  };

  const handleCreateTask = (prefilledDate?: string) => {
    if (!selectedWorkspace) return;

    const newTask: Partial<Task> = {
      dueDate: prefilledDate || new Date().toISOString().split('T')[0],
      status: 'todo',
      priority: 'medium',
      workspaceId: selectedWorkspace.id
    };

    setSelectedTask(newTask as Task);
    setIsTaskModalOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskDrop = (taskId: number, newDate: string) => {
    useCalendarStore.getState().moveTask(taskId, newDate);
    toast({
      title: "Task Rescheduled",
      description: "Task due date has been updated",
    });
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="p-8 m-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
        <p className="text-gray-600">Manage your tasks and schedule</p>
      </div>

      <Tabs defaultValue="calendar" className="mb-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Tasks</TabsTrigger>
          <TabsTrigger value="dueToday">Due Today</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <Input
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => setFilter('search', e.target.value)}
                    className="w-64"
                  />
                </div>
                
                <Select value={filters.status} onValueChange={(v) => setFilter('status', v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="qa">QA</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.assignee} onValueChange={(v) => setFilter('assignee', v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all assignee</SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={currentView} onValueChange={(v: any) => setView(v)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={() => handleCreateTask()} className="ml-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  New Task
                </Button>
              </div>
            </CardContent>
          </Card>

          {currentView === 'month' && (
            <CalendarView
              currentDate={currentDate}
              tasks={filteredTasks}
              onDateClick={handleCreateTask}
              onTaskClick={handleTaskClick}
              onTaskDrop={handleTaskDrop}
              onDateChange={setCurrentDate}
            />
          )}
          {currentView === 'week' && (
            <WeekView
              currentDate={currentDate}
              tasks={filteredTasks}
              onDateClick={handleCreateTask}
              onTaskClick={handleTaskClick}
              onTaskDrop={handleTaskDrop}
              onDateChange={setCurrentDate}
            />
          )}
          {currentView === 'day' && (
            <DayView
              currentDate={currentDate}
              tasks={filteredTasks}
              onDateClick={handleCreateTask}
              onTaskClick={handleTaskClick}
              onTaskDrop={handleTaskDrop}
              onDateChange={setCurrentDate}
            />
          )}
        </TabsContent>

        <TabsContent value="upcoming">
          <UpcomingTasks tasks={filteredTasks} onTaskClick={handleTaskClick} />
        </TabsContent>

        <TabsContent value="dueToday">
          <DueTodayTasks tasks={filteredTasks} onTaskClick={handleTaskClick} />
        </TabsContent>
      </Tabs>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleTaskSave}
        task={selectedTask}
      />
    </div>
  );
};

export default Calendar;