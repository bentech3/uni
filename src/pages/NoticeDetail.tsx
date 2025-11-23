import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { mockNotices, mockComments } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Calendar, Building2, User, FileText, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(mockComments.filter(c => c.noticeId === id));

  const notice = mockNotices.find(n => n.id === id);

  if (!notice) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <p className="text-center text-muted-foreground">Notice not found</p>
        </div>
      </div>
    );
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }
    if (!newComment.trim()) return;

    const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    
    const comment = {
      id: Date.now().toString(),
      noticeId: id!,
      userId: user.id,
      userName,
      content: newComment,
      datePosted: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment('');
    toast.success('Comment added');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notices
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{notice.title}</h1>
              <Badge variant="secondary" className="shrink-0">
                {notice.office}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {notice.authorName}
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {notice.department}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(notice.datePosted), 'PPP')}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed">{notice.content}</p>
            </div>

            {notice.attachments && notice.attachments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Attachments
                  </h3>
                  <div className="space-y-2">
                    {notice.attachments.map((attachment, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => toast.info('Download functionality available with backend')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {attachment}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Comments ({comments.length})</h3>
              
              {user && (
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.datePosted), 'PPp')}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-8">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default NoticeDetail;
