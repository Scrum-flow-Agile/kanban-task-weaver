import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWorkspaceStore } from '@/components/auth/stores/useWorkspace.store';
import { useUIStore } from '@/components/auth/stores/useUIStore';

interface WorkspaceModalProps {
  onSave: (workspace: any) => void;
}



const WorkspaceModal: React.FC<WorkspaceModalProps> = ({ onSave }) => {
  const { editingItem, setEditingItem } = useWorkspaceStore();
  const { modals, closeModal } = useUIStore();
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || '',
        description: editingItem.description || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
      });
    }
  }, [editingItem, modals.workspace]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    closeModal('workspace');
    setEditingItem(null);
  };

  const handleClose = () => {
    closeModal('workspace');
    setEditingItem(null);
  };

  return (
    <Dialog open={modals.workspace} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingItem ? 'Edit Workspace' : 'Create New Workspace'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter workspace name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter workspace description"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingItem ? 'Update' : 'Create'} Workspace
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WorkspaceModal;