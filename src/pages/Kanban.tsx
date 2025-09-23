import { useState } from 'react';
import { useAuthStore } from '@/components/auth/stores/auth.store';
import { useWorkspaceStore } from '@/components/auth/stores/useWorkspace.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calendar, User, Settings, Trash2, Edit3, GripVertical } from 'lucide-react';
import { TaskModal } from '@/components/TaskModal';
import ManageTaskModal from '@/components/ManageTaskModal';
import { toast } from '@/hooks/use-toast';
import { useTasksStore } from '@/components/auth/stores/useTasksStore';

interface Column {
  id: string;
  title: string;
  color: string;
}

const Kanban = () => {
  const { selectedWorkspace } = useWorkspaceStore();
  const { user } = useAuthStore();

  // ✅ Use task store instead of local state
  const { tasks, addTask, updateTask, deleteTask } = useTasksStore();

  const [columns, setColumns] = useState<Column[]>([
    { id: 'todo', title: 'To Do', color: 'bg-gray-100' },
    { id: 'inprogress', title: 'In Progress', color: 'bg-blue-100' },
    { id: 'qa', title: 'QA', color: 'bg-yellow-100' },
    { id: 'blocked', title: 'Blocked', color: 'bg-red-100' },
    { id: 'done', title: 'Done', color: 'bg-green-100' },
  ]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isManageTaskModalOpen, setIsManageTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [columnTitle, setColumnTitle] = useState('');

  const canEditTasks = true;

  const handleTaskClick = (task: any) => {
    if (canEditTasks || task.createdBy === user?.name) {
      setEditingTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
      toast({
        title: 'Task Updated',
        description: 'Task has been successfully updated.',
      });
    } else {
      const newTask = {
        id: Date.now(),
        title: taskData.title || '',
        description: taskData.description || '',
        status: taskData.status || 'todo',
        assignee: taskData.assignee || '',
        dueDate: taskData.dueDate || '',
        priority: taskData.priority || 'medium',
        tags: taskData.tags || [],
        color: taskData.color || '#6b7280',
        subtasks: taskData.subtasks || [],
        createdBy: user?.name || 'Unknown',
        workspaceId: selectedWorkspace?.id || 0,
      };
      addTask(newTask);
      toast({
        title: 'Task Created',
        description: 'New task has been successfully created.',
      });
    }
    setIsTaskModalOpen(false);
  };

  const handleDeleteTask = (taskId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canEditTasks) {
      toast({
        title: 'Access Denied',
        description: 'Only Scrum Masters and Product Managers can delete tasks.',
        variant: 'destructive',
      });
      return;
    }
    deleteTask(taskId);
    toast({
      title: 'Task Deleted',
      description: 'Task has been successfully deleted.',
    });
  };

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== newStatus) {
      updateTask(draggedTask.id, { status: newStatus });
      toast({
        title: 'Task Moved',
        description: `Task moved to ${columns.find((col) => col.id === newStatus)?.title}`,
      });
    }
    setDraggedTask(null);
  };

  const handleColumnEdit = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (column && canEditTasks) {
      setEditingColumn(columnId);
      setColumnTitle(column.title);
    }
  };

  const handleColumnSave = (columnId: string) => {
    if (columnTitle.trim()) {
      setColumns((prev) =>
        prev.map((col) => (col.id === columnId ? { ...col, title: columnTitle } : col))
      );
      toast({
        title: 'Column Updated',
        description: 'Column title has been updated.',
      });
    }
    setEditingColumn(null);
    setColumnTitle('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!selectedWorkspace) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Workspace Selected</h1>
          <p className="text-gray-600">Please select a workspace to view the Kanban board.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kanban Board</h1>
          <p className="text-gray-600">Workspace: {selectedWorkspace.name}</p>
        </div>
        <div className="flex gap-2">
          {canEditTasks && (
            <Button onClick={() => setIsManageTaskModalOpen(true)} variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Manage Columns
            </Button>
          )}
          <Button onClick={handleCreateTask}>
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
        {columns.map((column) => (
          <div
            key={column.id}
            className="space-y-4"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`p-4 rounded-lg ${column.color} relative group`}>
              {editingColumn === column.id ? (
                <Input
                  value={columnTitle}
                  onChange={(e) => setColumnTitle(e.target.value)}
                  onBlur={() => handleColumnSave(column.id)}
                  onKeyPress={(e) => e.key === 'Enter' && handleColumnSave(column.id)}
                  className="text-sm font-semibold"
                />
              ) : (
                <div className="flex items-center justify-between">
                  <h3
                    className="font-semibold text-gray-900 cursor-pointer"
                    onClick={() => handleColumnEdit(column.id)}
                  >
                    {column.title}
                  </h3>
                  {canEditTasks && (
                    <Edit3
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 cursor-pointer"
                      onClick={() => handleColumnEdit(column.id)}
                    />
                  )}
                </div>
              )}
              <span className="text-sm text-gray-600">
                {tasks.filter((task) => task.status === column.id).length} tasks
              </span>
            </div>

            <div className="space-y-3 min-h-[400px]">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onClick={() => handleTaskClick(task)}
                    style={{ borderLeft: `4px solid ${task.color}` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex-1">{task.title}</h4>
                        <div className="flex items-center gap-1">
                          <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                          {canEditTasks && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskClick(task);
                                }}
                                className="opacity-0 group-hover:opacity-100"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => handleDeleteTask(task.id, e)}
                                className="opacity-0 group-hover:opacity-100"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-200 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          {task.assignee}
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {task.dueDate}
                        </div>
                        <div className="flex items-center text-xs text-gray-400">
                          <span>Created by: {task.createdBy}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        task={editingTask}
      />

      <ManageTaskModal
        isOpen={isManageTaskModalOpen}
        onClose={() => setIsManageTaskModalOpen(false)}
        columns={columns}
        onSaveColumns={setColumns}
      />
    </div>
  );
};

export default Kanban;
