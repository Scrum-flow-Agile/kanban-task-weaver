
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Mail, Shield, User, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import UserModal from '@/components/UserModal';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'developer' | 'scrum_master' | 'product_manager' | 'designer' | 'qa_tester' | 'business_analyst';
  status: 'active' | 'inactive';
  joinDate: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'admin@example.com',
      role: 'scrum_master',
      status: 'active',
      joinDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'dev@example.com',
      role: 'developer',
      status: 'active',
      joinDate: '2024-02-01'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'developer',
      status: 'active',
      joinDate: '2024-02-15'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'developer',
      status: 'active',
      joinDate: '2024-03-01'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'scrum_master':
        return 'bg-purple-100 text-purple-800';
      case 'product_manager':
        return 'bg-green-100 text-green-800';
      case 'designer':
        return 'bg-pink-100 text-pink-800';
      case 'qa_tester':
        return 'bg-yellow-100 text-yellow-800';
      case 'business_analyst':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleUserSave = (userData: Partial<User>) => {
    if (selectedUser) {
      // Update existing user
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userData }
          : user
      ));
      toast({
        title: "User Updated",
        description: "User information has been updated successfully",
      });
    } else {
      // Add new user
      const newUser: User = {
        id: Date.now(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'developer',
        status: userData.status || 'active',
        joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "User Added",
        description: "New user has been added successfully",
      });
    }
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been deleted successfully",
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage team members and their permissions</p>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-500">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-500">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'developer').length}
                </p>
                <p className="text-sm text-gray-600">Developers</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-500">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'scrum_master').length}
                </p>
                <p className="text-sm text-gray-600">Scrum Masters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Team Members</CardTitle>
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">User</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleUserSave}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
