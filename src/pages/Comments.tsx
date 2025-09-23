// components/Comments.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { useCommentsStore } from "@/components/auth/stores/useCommentsStore";

const Comments: React.FC = () => {
  const { comments, addComment } = useCommentsStore();
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(newComment); // author defaults to "You" in store
      setNewComment("");
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div>
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map((comment) => {
            const { date, time } = formatDateTime(comment.timestamp);
            return (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{comment.author}</span>
                    <span className="text-xs text-gray-500">
                      {date} at {time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm">
            Post Comment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
