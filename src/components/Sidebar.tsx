import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './auth/stores/auth.store'; 
import { 
  Home, 
  Folder, 
  Calendar, 
  Users, 
  LogOut,
  User,
  CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useWorkspaceStore } from './auth/stores/useWorkspace.store';
import TeamCard from './Teamlist';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const { selectedWorkspace, selectWorkspace } = useWorkspaceStore();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/app', icon: Home }, 
    { name: 'Workspaces', href: '/app/workspaces', icon: Folder }, 
    { name: 'Calendar', href: '/app/calendar', icon: Calendar },
    { name: 'Teams', href: '/app/teamlist', icon: Users},
    { name: 'Commitments', href: '/app/commitments', icon: CheckCircle },

  ];

  const handleLogout = () => {
    logout();
    navigate('/auth'); 
  };

  const handleSwitchWorkspace = () => {
    selectWorkspace(null as any);
    navigate('/app/workspaces'); 
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center px-6 py-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">ScrumFlow</span>
          </div>
        </div>

        {selectedWorkspace && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedWorkspace.name}</p>
                <p className="text-xs text-gray-500">{selectedWorkspace.members.length} members</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSwitchWorkspace}
                className="text-xs"
              >
                Switch
              </Button>
            </div>
          </div>
        )}

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">Team Member</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
