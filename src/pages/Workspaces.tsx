import React from 'react';
import { useWorkspaceStore } from '@/components/auth/stores/useWorkspace.store';
import { useUIStore } from '@/components/auth/stores/useUIStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Folder, Users, Calendar, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import WorkspaceModal from '@/components/WorkspaceModal';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Workspace } from '@/components/auth/stores/useWorkspace.store';

const Workspaces = () => {
  const { 
    workspaces, 
    selectedWorkspace, 
    selectWorkspace, 
    addWorkspace, 
    deleteWorkspace, 
    updateWorkspace, 
    editingItem,
    setEditingItem 
  } = useWorkspaceStore();
  
  const { openModal } = useUIStore();
  const navigate = useNavigate();

  const handleWorkspaceSave = (workspaceData: any) => {
    if (editingItem) {
      updateWorkspace(editingItem.id, workspaceData);
      toast({
        title: "Workspace Updated",
        description: "Workspace has been updated successfully",
      });
    } else {
      addWorkspace(workspaceData);
      toast({
        title: "Workspace Created",
        description: "New workspace has been created successfully",
      });
    }
    setEditingItem(null);
  };

  const handleEdit = (workspace: Workspace) => {
    setEditingItem(workspace); 
    openModal('workspace');
  };

  const handleDelete = (workspaceId: number) => {
    deleteWorkspace(workspaceId);
    toast({
      title: "Workspace Deleted",
      description: "Workspace has been deleted successfully",
    });
  };

  const handleCreateWorkspace = () => {
    setEditingItem(null); // Clear editing item
    openModal('workspace');
  };

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0;
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workspaces</h1>
          <p className="text-gray-600">Organize your projects and collaborate with your team</p>
        </div>
        <Button onClick={handleCreateWorkspace}>
          Create Workspace
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {workspaces.map((workspace) => {
          const totalTasks = 24; // Mock data
          const completedTasks = Math.floor(Math.random() * totalTasks);
          const progressPercentage = getProgressPercentage(completedTasks, totalTasks);

  
          
          return (
            <Card 
              key={workspace.id} 
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => {
                selectWorkspace(workspace);
                navigate('/app/kanban/${workspace.id}');
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Folder className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{workspace.name}</CardTitle>
                      <CardDescription className="text-sm">{workspace.description}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(workspace); }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); handleDelete(workspace.id); }}
                        className="text-red-600"
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <Users className="w-4 h-4 mr-1" />
                      {workspace.members.length} members
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {completedTasks}/{totalTasks} tasks
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span>Progress</span>
                        <span className="font-semibold">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-500">
                    Owner: {workspace.owner || 'Sarah Connor'} • 2 hours ago
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        <Card className="border-dashed border-2 hover:border-blue-300 transition-colors">
          <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-12 h-12 bg-grey -100 rounded-lg flex items-center justify-center mb-4">
              <Folder className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Create New Workspace</h3>
            <p className="text-sm text-gray-500 mb-4">Set up a new project workspace for your team</p>
            <Button onClick={handleCreateWorkspace}>
              Create Workspace
            </Button>
          </CardContent>
        </Card>
      </div>

      <WorkspaceModal onSave={handleWorkspaceSave} />
    </div>
  );
};

export default Workspaces;