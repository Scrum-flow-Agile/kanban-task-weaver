import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellRing, Clock, CheckCircle, AlertCircle, MessageCircle, Calendar, Trash2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api'; 

interface Notification {
  id: string; 
  type: 'mention' | 'assignment' | 'due-soon' | 'status-change'; 
  message: string;
  link?: string;
  isRead: boolean; 
  createdAt: string; 
  isValid?: boolean; 
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/notifications?limit=50'); 
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      toast({
        title: "Error",
        description: "Could not load notifications.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast({
        title: "Error",
        description: "Could not mark notification as read.",
        variant: "destructive",
      });
      fetchNotifications();
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/unread`);
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          notification.id === id ? { ...notification, isRead: false } : notification
        )
      );
      toast({
        title: "Notification marked as unread",
      });
    } catch (error) {
      console.error('Failed to mark notification as unread:', error);
      toast({
        title: "Error",
        description: "Could not mark notification as unread.",
        variant: "destructive",
      });
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(prevNotifications =>
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast({
        title: "Error",
        description: "Could not mark all notifications as read.",
        variant: "destructive",
      });
      fetchNotifications();
    }
  };

  const handleDeleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prevNotifications =>
        prevNotifications.filter(notification => notification.id !== id)
      );
      toast({
        title: "Notification deleted",
      });
    } catch (error) {
      console.error('Failed to delete notification:', error);
      toast({
        title: "Error",
        description: "Could not delete notification.",
        variant: "destructive",
      });
      fetchNotifications();
    }
  };

  const handleRestoreNotification = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/restore`);
      toast({
        title: "Notification restored",
      });
      fetchNotifications();
    } catch (error) {
      console.error('Failed to restore notification:', error);
      toast({
        title: "Error",
        description: "Could not restore notification.",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'due-soon': return <Calendar className="w-5 h-5 text-orange-600" />;
      case 'mention': return <MessageCircle className="w-5 h-5 text-purple-600" />;
      case 'status-change': return <AlertCircle className="w-5 h-5 text-green-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationPriority = (type: string): 'low' | 'medium' | 'high' => {
    switch (type) {
      case 'due-soon': return 'high';
      case 'assignment': return 'medium';
      case 'mention': return 'medium';
      case 'status-change': return 'low';
      default: return 'low';
    }
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center py-12">
          <p>Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <BellRing className="w-8 h-8 mr-3 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-3 bg-red-500 text-white">
                {unreadCount} unread
              </Badge>
            )}
          </h1>
          <p className="text-gray-600">Stay updated with your team activities</p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => {
          const priority = getNotificationPriority(notification.type);
          return (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.isRead ? 'border-blue-200 bg-blue-50/30' : ''
              } ${notification.isValid === false ? 'opacity-60' : ''}`} 
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`text-sm font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                        <Badge className={getPriorityColor(priority)}>
                          {priority}
                        </Badge>
                        {notification.isValid === false && (
                          <Badge variant="outline" className="text-gray-500">
                            Link Expired
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                    <div className="flex space-x-2">
                      {notification.isRead ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsUnread(notification.id)}
                        >
                          <EyeOff className="w-4 h-4 mr-1" /> Mark Unread
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" /> Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteNotification(notification.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                      {/* Optional: Add a restore button if you soft delete and want to restore from this UI */}
                      {/* <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRestoreNotification(notification.id)}
                      >
                        <RotateCcw className="w-4 h-4 mr-1" /> Restore
                      </Button> */}
                      {notification.link && notification.isValid !== false && (
                        <Button
                          size="sm"
                          variant="ghost" asChild
                        >
                          <a href={notification.link} onClick={(e) => {
                            // Optional: Mark as read when clicking the link?
                            // handleMarkAsRead(notification.id);
                          }}>
                            View
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {notifications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500 text-center">You're all caught up! No new notifications to show.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Notifications;