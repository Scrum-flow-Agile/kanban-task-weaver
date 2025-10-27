
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Column {
  id: string;
  title: string;
  color: string;
}

interface ManageTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: Column[];
  onSaveColumns: (columns: Column[]) => void;
}

const ManageTaskModal: React.FC<ManageTaskModalProps> = ({ 
  isOpen, 
  onClose, 
  columns, 
  onSaveColumns 
}) => {
  const [localColumns, setLocalColumns] = useState<Column[]>([]);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  useEffect(() => {
    setLocalColumns([...columns]);
  }, [columns, isOpen]);

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: Column = {
        id: newColumnTitle.toLowerCase().replace(/\s+/g, ''),
        title: newColumnTitle,
        color: 'bg-purple-100'
      };
      setLocalColumns([...localColumns, newColumn]);
      setNewColumnTitle('');
      toast({
        title: "Column Added",
        description: "New task status column has been added.",
        className: "bg-white text-black",
      });
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    setLocalColumns(localColumns.filter(col => col.id !== columnId));
    toast({
      title: "Column Deleted",
      description: "Task status column has been deleted.",
    });
  };

  const handleEditColumn = (columnId: string, newTitle: string) => {
    setLocalColumns(localColumns.map(col => 
      col.id === columnId ? { ...col, title: newTitle } : col
    ));
    setEditingColumn(null);
  };

  const handleSave = () => {
    onSaveColumns(localColumns);
    onClose();
    toast({
      title: "Task Statuses Updated",
      description: "Task status columns have been updated successfully.",
    });
  };

  const colorOptions = [
    'bg-gray-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-red-100',
    'bg-purple-100',
    'bg-pink-100',
    'bg-indigo-100'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[600px] h-auto">
        <DialogHeader>
          <DialogTitle>Manage Task Statuses</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label>Add New Status</Label>
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Enter status name..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddColumn()}
              />
              <Button onClick={handleAddColumn}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label>Current Statuses</Label>
            <div className="space-y-3 mt-2 max-h-[4/00px] overflow-y-scroll">
              {localColumns.map((column) => (
                <div key={column.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-4 h-4 rounded ${column.color}`}></div>
                  
                  {editingColumn === column.id ? (
                    <Input
                      defaultValue={column.title}
                      onBlur={(e) => handleEditColumn(column.id, e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleEditColumn(column.id, (e.target as HTMLInputElement).value);
                        }
                      }}
                      autoFocus
                      className="flex-1"
                    />
                  ) : (
                    <span className="flex-1 font-medium">{column.title}</span>
                  )}

                  <select
                    value={column.color}
                    onChange={(e) => setLocalColumns(localColumns.map(col => 
                      col.id === column.id ? { ...col, color: e.target.value } : col
                    ))}
                    className="px-2 py-1 border rounded"
                  >
                    {colorOptions.map((color) => (
                      <option key={color} value={color}>
                        {color.replace('bg-', '').replace('-100', '')}
                      </option>
                    ))}
                  </select>

                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingColumn(column.id)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteColumn(column.id)}
                      disabled={localColumns.length <= 2}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageTaskModal;
