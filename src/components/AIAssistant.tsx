
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, Send, Lightbulb, Calendar, Users, Target, X, MessageSquare, CheckCircle2, Clock, Trophy, TrendingUp, Star } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export interface AIAssistantProps {
  onTaskSuggestion: (taskData: any) => void;
  tasks: any[];
  currentUser: any;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onTaskSuggestion, tasks, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [standupSummary, setStandupSummary] = useState<string>('');
  const [teamRankings, setTeamRankings] = useState<any[]>([]);

  const features = [
    {
      id: 'create-task',
      title: 'Create Task from Prompt',
      description: 'Convert natural language into structured tasks',
      icon: Target,
      color: 'bg-blue-50 border-blue-200 text-blue-700'
    },
    {
      id: 'upcoming-tasks',
      title: 'Show My Upcoming Tasks',
      description: 'View your tasks due in the next 5 days',
      icon: Calendar,
      color: 'bg-green-50 border-green-200 text-green-700'
    },
    {
      id: 'suggest-next',
      title: 'Suggest Next Steps',
      description: 'Get AI recommendations for your workflow',
      icon: Lightbulb,
      color: 'bg-yellow-50 border-yellow-200 text-yellow-700'
    },
    {
      id: 'standup-summary',
      title: 'Generate Stand-Up Summary',
      description: 'Create a summary of recent team activity',
      icon: Users,
      color: 'bg-purple-50 border-purple-200 text-purple-700'
    },
    {
      id: 'rank-team',
      title: 'Rank Team Members',
      description: 'See top contributors and team performance',
      icon: Trophy,
      color: 'bg-orange-50 border-orange-200 text-orange-700'
    }
  ];

  const getUpcomingTasks = () => {
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
    
    return tasks.filter(task => {
      if (!task.dueDate || task.assignee !== currentUser?.name) return false;
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate >= today && dueDate <= fiveDaysFromNow;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
    
    if (featureId === 'upcoming-tasks') {
      // Show upcoming tasks immediately
      return;
    }
    
    if (featureId === 'suggest-next') {
      generateNextStepSuggestions();
    }
    
    if (featureId === 'standup-summary') {
      generateStandupSummary();
    }
    
    if (featureId === 'rank-team') {
      generateTeamRankings();
    }
  };

  const handleCreateTaskFromPrompt = async () => {
    if (!message.trim()) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate AI processing - in real implementation, this would call AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Parse the prompt and create structured task data
      const taskData = parsePromptToTask(message);
      
      onTaskSuggestion(taskData);
      
      toast({
        title: "Task Created Successfully",
        description: "Your task has been created from the AI prompt.",
      });
      
      setMessage('');
      setActiveFeature(null);
    } catch (error) {
      toast({
        title: "Error Creating Task",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateNextStepSuggestions = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const suggestions = generateSmartSuggestions();
      setSuggestions(suggestions);
      
      toast({
        title: "AI Suggestions Ready",
        description: "Generated personalized recommendations for your workflow.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const parsePromptToTask = (prompt: string) => {
    // Simple AI-like parsing logic
    const isHighPriority = /urgent|asap|high|critical|important/i.test(prompt);
    const isLowPriority = /low|nice to have|when possible/i.test(prompt);
    
    const title = prompt.length > 50 
      ? prompt.substring(0, 47) + "..."
      : prompt;
    
    const priority = isHighPriority ? 'high' : isLowPriority ? 'low' : 'medium';
    
    // Extract potential tags
    const tags = [];
    if (/api|endpoint|backend/i.test(prompt)) tags.push('api');
    if (/ui|frontend|design/i.test(prompt)) tags.push('ui');
    if (/test|testing/i.test(prompt)) tags.push('testing');
    if (/bug|fix|issue/i.test(prompt)) tags.push('bug');
    if (/refactor|clean|optimize/i.test(prompt)) tags.push('refactor');
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (isHighPriority ? 3 : 7));
    
    return {
      title: title.charAt(0).toUpperCase() + title.slice(1),
      description: prompt,
      priority,
      tags,
      assignee: currentUser?.name || 'Unassigned',
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'todo'
    };
  };

  const generateSmartSuggestions = () => {
    const userTasks = tasks.filter(task => task.assignee === currentUser?.name);
    const inProgressTasks = userTasks.filter(task => task.status === 'inprogress');
    const blockedTasks = userTasks.filter(task => task.status === 'blocked');
    const overdueTasks = userTasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < new Date() && task.status !== 'done';
    });

    const suggestions = [];
    
    if (blockedTasks.length > 0) {
      suggestions.push(`You have ${blockedTasks.length} blocked task(s). Consider reaching out to stakeholders to unblock "${blockedTasks[0].title}".`);
    }
    
    if (inProgressTasks.length > 3) {
      suggestions.push("You have many tasks in progress. Consider focusing on completing 1-2 tasks before starting new ones.");
    }
    
    if (overdueTasks.length > 0) {
      suggestions.push(`You have ${overdueTasks.length} overdue task(s). Prioritize completing "${overdueTasks[0].title}" first.`);
    }
    
    const highPriorityTasks = userTasks.filter(task => task.priority === 'high' && task.status !== 'done');
    if (highPriorityTasks.length > 0) {
      suggestions.push(`Focus on your high-priority task: "${highPriorityTasks[0].title}".`);
    }
    
    if (suggestions.length === 0) {
      suggestions.push("Great work! Your tasks are well-organized. Consider reviewing upcoming deadlines or helping teammates with blocked tasks.");
    }
    
    return suggestions;
  };

  const generateStandupSummary = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const completedTasks = tasks.filter(task => task.status === 'done');
      const inProgressTasks = tasks.filter(task => task.status === 'inprogress');
      const blockedTasks = tasks.filter(task => task.status === 'blocked');
      
      const summary = `## Daily Stand-Up Summary - ${new Date().toLocaleDateString()}

**Yesterday's Accomplishments:**
${completedTasks.slice(0, 5).map(task => `• ${task.title} (${task.assignee})`).join('\n') || '• No completed tasks'}

**Today's Focus:**
${inProgressTasks.slice(0, 5).map(task => `• ${task.title} (${task.assignee})`).join('\n') || '• No tasks in progress'}

**Blockers & Issues:**
${blockedTasks.map(task => `• ${task.title} - ${task.assignee} needs assistance`).join('\n') || '• No blockers reported'}

**Team Velocity:**
• Total tasks completed: ${completedTasks.length}
• Active tasks: ${inProgressTasks.length}
• Blocked tasks: ${blockedTasks.length}

**Action Items:**
${blockedTasks.length > 0 ? '• Resolve blocked tasks to maintain momentum' : '• Continue current sprint progress'}
• Review upcoming deadlines for next planning session`;

      setStandupSummary(summary);
      
      toast({
        title: "Stand-Up Summary Generated",
        description: "AI has analyzed recent team activity and created a summary.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate stand-up summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTeamRankings = async () => {
    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Analyze team performance
      const teamMembers = [...new Set(tasks.map(task => task.assignee))].filter(Boolean);
      
      const rankings = teamMembers.map(member => {
        const memberTasks = tasks.filter(task => task.assignee === member);
        const completedTasks = memberTasks.filter(task => task.status === 'done');
        const highPriorityCompleted = completedTasks.filter(task => task.priority === 'high');
        const onTimeCompleted = completedTasks.filter(task => {
          if (!task.dueDate) return true;
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return dueDate >= today;
        });
        
        const score = (completedTasks.length * 10) + 
                     (highPriorityCompleted.length * 15) + 
                     (onTimeCompleted.length * 5) + 
                     (memberTasks.filter(task => task.status === 'inprogress').length * 3);
        
        return {
          name: member,
          completedTasks: completedTasks.length,
          highPriorityCompleted: highPriorityCompleted.length,
          totalTasks: memberTasks.length,
          score,
          completionRate: memberTasks.length > 0 ? Math.round((completedTasks.length / memberTasks.length) * 100) : 0
        };
      }).sort((a, b) => b.score - a.score);
      
      setTeamRankings(rankings);
      
      toast({
        title: "Team Rankings Generated",
        description: "AI has analyzed team performance and created rankings.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate team rankings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="mt-8 border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
      <CardHeader>
        <CardTitle 
          className="flex items-center justify-between cursor-pointer group" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center">
            <Bot className="w-6 h-6 mr-2 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Assistant
            </span>
          </div>
          <Badge variant="secondary" className="text-xs">
            Phase 2
          </Badge>
        </CardTitle>
      </CardHeader>
      
      {isOpen && (
        <CardContent>
          <div className="space-y-6">
            {!activeFeature ? (
              // Feature Selection Screen
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    Choose an AI-powered feature to enhance your productivity
                  </p>
                </div>
                
                <div className="grid gap-3">
                  {features.map((feature) => (
                    <Card 
                      key={feature.id}
                      className={`cursor-pointer hover:shadow-md transition-all border ${feature.color} hover:scale-[1.02]`}
                      onClick={() => handleFeatureClick(feature.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <feature.icon className="w-5 h-5" />
                          <div className="flex-1">
                            <h4 className="font-medium">{feature.title}</h4>
                            <p className="text-xs opacity-75">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              // Active Feature Screen
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">
                    {features.find(f => f.id === activeFeature)?.title}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setActiveFeature(null);
                      setSuggestions([]);
                      setMessage('');
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {activeFeature === 'create-task' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Describe your task in natural language:
                      </label>
                      <Textarea
                        placeholder="e.g., 'Create a login API endpoint with JWT authentication'"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>
                    <Button 
                      onClick={handleCreateTaskFromPrompt}
                      disabled={!message.trim() || isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Target className="w-4 h-4 mr-2" />
                          Create Task
                        </>
                      )}
                    </Button>
                  </div>
                )}
                
                {activeFeature === 'upcoming-tasks' && (
                  <div className="space-y-4">
                    {(() => {
                      const upcomingTasks = getUpcomingTasks();
                      return upcomingTasks.length > 0 ? (
                        <div className="space-y-3">
                          <p className="text-sm text-gray-600">
                            You have {upcomingTasks.length} task(s) due in the next 5 days:
                          </p>
                          {upcomingTasks.map((task) => (
                            <Card key={task.id} className="p-3 border-l-4" style={{ borderLeftColor: task.color }}>
                              <div className="space-y-2">
                                <div className="flex items-start justify-between">
                                  <h4 className="font-medium text-sm">{task.title}</h4>
                                  <Badge className={getPriorityColor(task.priority)} variant="outline">
                                    {task.priority}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {task.dueDate}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {getDaysUntilDue(task.dueDate) === 0 
                                      ? 'Due today'
                                      : `${getDaysUntilDue(task.dueDate)} days left`
                                    }
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <CheckCircle2 className="w-12 h-12 mx-auto text-green-500 mb-2" />
                          <p className="text-gray-600">No upcoming tasks in the next 5 days!</p>
                          <p className="text-sm text-gray-500">You're all caught up.</p>
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {activeFeature === 'suggest-next' && (
                  <div className="space-y-4">
                    {!suggestions.length ? (
                      <div className="text-center py-4">
                        <Button 
                          onClick={generateNextStepSuggestions}
                          disabled={isProcessing}
                          variant="outline"
                          className="w-full"
                        >
                          {isProcessing ? (
                            <>
                              <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full" />
                              Analyzing your workflow...
                            </>
                          ) : (
                            <>
                              <Lightbulb className="w-4 h-4 mr-2" />
                              Generate Suggestions
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 flex items-center">
                          <Lightbulb className="w-4 h-4 mr-2 text-yellow-500" />
                          AI Recommendations
                        </h4>
                        {suggestions.map((suggestion, index) => (
                          <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-800">{suggestion}</p>
                          </div>
                        ))}
                        <Button 
                          onClick={generateNextStepSuggestions}
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Refresh Suggestions
                        </Button>
                      </div>
                     )}
                   </div>
                 )}
                 
                 {activeFeature === 'standup-summary' && (
                   <div className="space-y-4">
                     {!standupSummary ? (
                       <div className="text-center py-4">
                         <Button 
                           onClick={generateStandupSummary}
                           disabled={isProcessing}
                           variant="outline"
                           className="w-full"
                         >
                           {isProcessing ? (
                             <>
                               <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full" />
                               Analyzing team activity...
                             </>
                           ) : (
                             <>
                               <Users className="w-4 h-4 mr-2" />
                               Generate Summary
                             </>
                           )}
                         </Button>
                       </div>
                     ) : (
                       <div className="space-y-3">
                         <div className="flex items-center justify-between">
                           <h4 className="font-medium text-gray-900 flex items-center">
                             <Users className="w-4 h-4 mr-2 text-purple-500" />
                             Stand-Up Summary
                           </h4>
                           <Button 
                             onClick={() => navigator.clipboard.writeText(standupSummary)}
                             variant="ghost"
                             size="sm"
                           >
                             Copy
                           </Button>
                         </div>
                         <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                           <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                             {standupSummary}
                           </pre>
                         </div>
                         <Button 
                           onClick={generateStandupSummary}
                           variant="outline"
                           size="sm"
                           className="w-full"
                         >
                           <TrendingUp className="w-4 h-4 mr-2" />
                           Refresh Summary
                         </Button>
                       </div>
                     )}
                   </div>
                 )}
                 
                 {activeFeature === 'rank-team' && (
                   <div className="space-y-4">
                     {teamRankings.length === 0 ? (
                       <div className="text-center py-4">
                         <Button 
                           onClick={generateTeamRankings}
                           disabled={isProcessing}
                           variant="outline"
                           className="w-full"
                         >
                           {isProcessing ? (
                             <>
                               <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full" />
                               Analyzing team performance...
                             </>
                           ) : (
                             <>
                               <Trophy className="w-4 h-4 mr-2" />
                               Generate Rankings
                             </>
                           )}
                         </Button>
                       </div>
                     ) : (
                       <div className="space-y-3">
                         <h4 className="font-medium text-gray-900 flex items-center">
                           <Trophy className="w-4 h-4 mr-2 text-orange-500" />
                           Team Performance Rankings
                         </h4>
                         <div className="space-y-2">
                           {teamRankings.map((member, index) => (
                             <Card key={member.name} className={`p-3 ${index === 0 ? 'border-yellow-300 bg-yellow-50' : index === 1 ? 'border-gray-300 bg-gray-50' : index === 2 ? 'border-orange-300 bg-orange-50' : ''}`}>
                               <div className="flex items-center justify-between">
                                 <div className="flex items-center space-x-3">
                                   {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                                   {index === 1 && <Star className="w-5 h-5 text-gray-500" />}
                                   {index === 2 && <Star className="w-5 h-5 text-orange-500" />}
                                   {index > 2 && <span className="text-gray-400 font-medium">#{index + 1}</span>}
                                   <div>
                                     <p className="font-medium text-sm">{member.name}</p>
                                     <p className="text-xs text-gray-500">
                                       {member.completedTasks} completed • {member.completionRate}% rate
                                     </p>
                                   </div>
                                 </div>
                                 <div className="text-right">
                                   <p className="font-bold text-sm">{member.score}</p>
                                   <p className="text-xs text-gray-500">points</p>
                                 </div>
                               </div>
                             </Card>
                           ))}
                         </div>
                         <Button 
                           onClick={generateTeamRankings}
                           variant="outline"
                           size="sm"
                           className="w-full"
                         >
                           <TrendingUp className="w-4 h-4 mr-2" />
                           Refresh Rankings
                         </Button>
                       </div>
                     )}
                   </div>
                 )}
               </div>
             )}
           </div>
         </CardContent>
       )}
     </Card>
   );
 };

export default AIAssistant;
