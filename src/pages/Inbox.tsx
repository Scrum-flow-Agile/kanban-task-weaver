
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, MailOpen, Clock, User } from 'lucide-react';

const Inbox = () => {
  const messages = [
    {
      id: 1,
      from: 'Sarah Connor',
      subject: 'Sprint Planning Review',
      preview: 'Hey team, I wanted to follow up on our sprint planning session...',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      from: 'John Doe',
      subject: 'Code Review Request',
      preview: 'Could you please review the authentication module PR?',
      time: '4 hours ago',
      read: true,
      priority: 'medium'
    },
    {
      id: 3,
      from: 'System',
      subject: 'Task Assignment',
      preview: 'You have been assigned a new task: Database optimization',
      time: '1 day ago',
      read: false,
      priority: 'low'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inbox</h1>
        <p className="text-gray-600">Manage your messages and notifications</p>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={`cursor-pointer hover:shadow-md transition-shadow ${!message.read ? 'border-blue-200 bg-blue-50/30' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {message.read ? (
                    <MailOpen className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Mail className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{message.from}</span>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(message.priority)}`}></div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                  </div>
                  <h3 className={`text-sm mb-1 ${!message.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {message.subject}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Inbox;
