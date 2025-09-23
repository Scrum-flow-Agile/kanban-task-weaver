import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitCommit, Calendar as CalendarIcon, User, Clock, Edit, Trash, Plus, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useCommitmentStore } from '@/components/auth/stores/commitment.store';

interface Commitment {
  id: number;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
  createdBy: string;
  createdAt: string;
}

type FilterType = 'all' | 'upcoming' | 'dueToday' | 'completed' | 'archived';

const Commitments = () => {
  const [commitments, setCommitments] = useState<Commitment[]>([
    {
      id: 1,
      title: 'Complete user authentication testing',
      description: 'Ensure all authentication flows are properly tested before release',
      assignee: 'John Doe',
      dueDate: '2024-01-20',
      priority: 'high',
      status: 'in-progress',
      createdBy: 'Sarah Connor',
      createdAt: '2024-01-10'
    },
    {
      id: 2,
      title: 'Review API documentation',
      description: 'Update and review all API documentation for accuracy',
      assignee: 'Jane Smith',
      dueDate: '2024-01-25',
      priority: 'medium',
      status: 'pending',
      createdBy: 'Mike Johnson',
      createdAt: '2024-01-12'
    },
    {
      id: 3,
      title: 'Database backup implementation',
      description: 'Implement automated daily backup system for production database',
      assignee: 'Mike Johnson',
      dueDate: '2024-01-18',
      priority: 'high',
      status: 'completed',
      createdBy: 'Sarah Connor',
      createdAt: '2024-01-08'
    }
    // You may add commitments with status: 'archived' if needed
  ]);

  const [filter, setFilter] = useState<FilterType>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<Commitment | null>(null);

  const [newCommitment, setNewCommitment] = useState({
    title: '',
    description: '',
    assignee: '',
    dueDate: new Date(),
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const handleCreateCommitment = () => {
    if (newCommitment.title.trim() && newCommitment.assignee.trim()) {
      const commitment: Commitment = {
        id: Date.now(),
        title: newCommitment.title,
        description: newCommitment.description,
        assignee: newCommitment.assignee,
        dueDate: format(newCommitment.dueDate, 'yyyy-MM-dd'),
        priority: newCommitment.priority,
        status: 'pending',
        createdBy: 'Current User',
        createdAt: format(new Date(), 'yyyy-MM-dd')
      };
      setCommitments([commitment, ...commitments]);
      setNewCommitment({
        title: '',
        description: '',
        assignee: '',
        dueDate: new Date(),
        priority: 'medium'
      });
      setIsCreating(false);
      toast({ title: "Commitment Created", description: "New commitment has been created successfully" });
    }
  };

  const handleStatusChange = (id: number, newStatus: 'pending' | 'in-progress' | 'completed') => {
    setCommitments(commitments.map(commitment =>
      commitment.id === id ? { ...commitment, status: newStatus } : commitment
    ));
    toast({ title: "Status Updated", description: "Commitment status has been updated" });
  };

  const handleDeleteCommitment = (id: number) => {
    setCommitments(commitments.filter(commitment => commitment.id !== id));
    toast({ title: "Commitment Deleted", description: "Commitment has been deleted successfully" });
  };

  const handleSaveEdit = () => {
    if (editing) {
      setCommitments(commitments.map(c => c.id === editing.id ? editing : c));
      setEditing(null);
      toast({ title: "Commitment Updated", description: "Commitment has been updated successfully",
      className: "bg-white text-black",});
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const filteredCommitments = commitments.filter(commitment => {
    switch (filter) {
      case 'upcoming':
        return commitment.dueDate > today;
      case 'dueToday':
        return commitment.dueDate === today;
      case 'completed':
        return commitment.status === 'completed';
      case 'archived':
        return commitment.status === 'archived';
      default:
        return true;
    }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commitments</h1>
          <p className="text-gray-600">Track and manage team commitments and deadlines</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Commitment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4 mb-6">
        {(['all', 'upcoming', 'dueToday', 'completed', 'archived'] as FilterType[]).map((tab) => (
          <Button
            key={tab}
            variant={filter === tab ? "default" : "outline"}
            onClick={() => setFilter(tab)}
          >
            {tab === 'all' && 'All'}
            {tab === 'upcoming' && 'Upcoming'}
            {tab === 'dueToday' && 'Due Today'}
            {tab === 'completed' && 'Completed'}
            {tab === 'archived' && 'Archived'}
          </Button>
        ))}
      </div>

      {/* Create new commitment form */}
      {isCreating && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Create New Commitment</CardTitle>
            <CardDescription>Add a new commitment for your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Commitment title..." value={newCommitment.title}
                onChange={(e) => setNewCommitment({ ...newCommitment, title: e.target.value })} />
              <Textarea placeholder="Description..." value={newCommitment.description}
                onChange={(e) => setNewCommitment({ ...newCommitment, description: e.target.value })} rows={3} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input placeholder="Assignee..." value={newCommitment.assignee}
                  onChange={(e) => setNewCommitment({ ...newCommitment, assignee: e.target.value })} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {format(newCommitment.dueDate, 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={newCommitment.dueDate}
                      onSelect={(date) => date && setNewCommitment({ ...newCommitment, dueDate: date })}
                      initialFocus />
                  </PopoverContent>
                </Popover>
                <Select value={newCommitment.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => setNewCommitment({ ...newCommitment, priority: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleCreateCommitment}>Create Commitment</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* List of commitments */}
      <div className="space-y-4">
        {filteredCommitments.map((commitment) => (
          <Card key={commitment.id}>
            <CardContent className="p-6">
              {editing?.id === commitment.id ? (
                <div className="space-y-4">
                  <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                  <Textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
                  <Input value={editing.assignee} onChange={(e) => setEditing({ ...editing, assignee: e.target.value })} />
                  <div className="flex space-x-2">
                    <Button onClick={handleSaveEdit}><Save className="w-4 h-4 mr-2" /> Save</Button>
                    <Button variant="outline" onClick={() => setEditing(null)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <GitCommit className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{commitment.title}</h3>
                      <Badge className={getPriorityColor(commitment.priority)}>{commitment.priority}</Badge>
                      <Badge className={getStatusColor(commitment.status)}>{commitment.status}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{commitment.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1"><User className="w-4 h-4" /><span>Assigned to: {commitment.assignee}</span></div>
                      <div className="flex items-center space-x-1"><CalendarIcon className="w-4 h-4" /><span>Due: {commitment.dueDate}</span></div>
                      <div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>Created: {commitment.createdAt}</span></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Created by: {commitment.createdBy}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={commitment.status}
                      onValueChange={(value: 'pending' | 'in-progress' | 'completed') => handleStatusChange(commitment.id, value)}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(commitment)}><Edit className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteCommitment(commitment.id)}><Trash className="w-4 h-4" /></Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Commitments;