import { useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '@/components/auth/stores/useWorkspace.store';
import { useUIStore } from '@/components/auth/stores/useUIStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Folder, Users, ArrowRight, Plus, ArrowLeftRight } from 'lucide-react';
import WorkspaceModal from '@/components/WorkspaceModal';
import { toast } from '@/hooks/use-toast';

const WorkspaceSelector = () => {
  const { 
    workspaces, 
    selectedWorkspace, 
    selectWorkspace, 
    addWorkspace,
    setEditingItem
  } = useWorkspaceStore();
  
  const { openModal, closeModal, modals } = useUIStore(); 
  
  const navigate = useNavigate();

  const handleWorkspaceSave = (workspaceData: any) => {
    addWorkspace(workspaceData);
    closeModal('workspace');
    toast({
      title: "Workspace Created",
      description: "New workspace has been created successfully",
    });
  };

  const handleWorkspaceSelect = (workspace: any) => {
    selectWorkspace(workspace);
    navigate('/kanban');
  };

  const handleSwitchWorkspace = () => {
    selectWorkspace(null);
    toast({
      title: "Workspace Switched",
      description: "You can now select a different workspace",
    });
  };

  const handleOpenWorkspaceModal = () => {
    setEditingItem(null); // Clear any editing item
    openModal('workspace');
  };

  if (selectedWorkspace) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Folder className="w-5 h-5 mr-2" />
              Current Workspace: {selectedWorkspace.name}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSwitchWorkspace}
              >
                <ArrowLeftRight className="w-4 h-4 mr-2" />
                Switch Workspace
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleOpenWorkspaceModal}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Workspace
              </Button>
            </div>
          </CardTitle>
          <CardDescription>{selectedWorkspace.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              {selectedWorkspace.members.length} members
            </div>
            <Button
              onClick={() => navigate('/kanban')}
            >
              Go to Kanban Board
            </Button>
          </div>
        </CardContent>
        
        <WorkspaceModal onSave={handleWorkspaceSave} />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Select a Workspace</CardTitle>
            <CardDescription>
              Choose a workspace to view your tasks and collaborate with your team
            </CardDescription>
          </div>
          <Button onClick={handleOpenWorkspaceModal}>
            <Plus className="w-4 h-4 mr-2" />
            New Workspace
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workspaces.map((workspace) => (
            <Card
              key={workspace.id}
              className="cursor-pointer hover:shadow-md transition-all hover:scale-105 border-2 hover:border-blue-200"
              onClick={() => handleWorkspaceSelect(workspace)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{workspace.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{workspace.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-400">
                        <Users className="w-3 h-3 mr-1" />
                        {workspace.members.length} members
                      </div>
                      <ArrowRight className="w-4 h-4 text-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      
      <WorkspaceModal onSave={handleWorkspaceSave} />
    </Card>
  );
};

export default WorkspaceSelector;