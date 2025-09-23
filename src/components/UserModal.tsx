
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'developer' | 'scrum_master' | 'product_manager' | 'designer' | 'qa_tester' | 'business_analyst';
  status: 'active' | 'inactive';
  joinDate: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
  user?: User | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, onSave, user }) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: 'developer' | 'scrum_master' | 'product_manager' | 'designer' | 'qa_tester' | 'business_analyst';
    status: 'active' | 'inactive';
  }>({
    name: '',
    email: '',
    role: 'developer',
    status: 'active',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'developer',
        status: 'active',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = {
      ...formData,
      joinDate: user?.joinDate || new Date().toISOString().split('T')[0],
    };
    onSave(userData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter full name"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
            />
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value: 'developer' | 'scrum_master' | 'product_manager' | 'designer' | 'qa_tester' | 'business_analyst') => 
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="scrum_master">Scrum Master</SelectItem>
                <SelectItem value="product_manager">Product Manager</SelectItem>
                <SelectItem value="designer">Designer</SelectItem>
                <SelectItem value="qa_tester">QA Tester</SelectItem>
                <SelectItem value="business_analyst">Business Analyst</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {user ? 'Update' : 'Add'} User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
