// src/pages/NoticeDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Calendar, Building2, User, FileText, Send } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Comment {
  id: string;
  notice_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user_name?: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  department: string | null;
  office: string | null;
  attachments?: string[];
  is_active: boolean;
  created_at: string;
  expire_at: string | null;
}

const NoticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [notice, setNotice] = useState<Notice | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!id) return;

    // Fetch notice
    const fetchNotice = async () => {
      const { data, error } = await supabase
        .from('notices')
        .select(`
          *,
          profiles:author_id (full_name)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        toast.error('Notice not found');
        console.error(error);
        return;
      }

      setNotice({
        id: data.id,
        title: data.title,
        content: data.content,
        author_id: data.author_id,
        author_name: data.profiles.full_name,
        department: data.department_id,
        office: data.office_id,
        attachments: data.attachments,
        is_active: data.is_active,
        created_at: data.created_at,
        expire_at: data.expire_at,
      });
    };

    // Fetch comments
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .eq('notice_id', id)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error('Failed to load comments');
        console.error(error);
        return;
      }

      const formattedComments = (data || []).map((c: any) => ({
        id: c.id,
        notice_id: c.notice_id,
        user_id: c.user_id,
        content: c.content,
        created_at: c.created_at,
        user_name: c.profiles.full_name,
      }));

      setComments(formattedComments);
    };

    fetchNotice();
    fetchComments();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to comment');
    if (!newComment.trim()) return;

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          notice_id: id,
          user_id: user.id,
          content: newComment,
        },
      ])
      .select(`
        *,
        profiles:user_id (full_name)
      `);

    if (error || !data) {
      toast.error('Failed to add comment');
      console.error(error);
      return;
    }

    const addedComment = {
      id: data[0].id,
      notice_id: data[0].notice_id,
      user_id: data[0].user_id,
      content: data[0].content,
      created_at: data[0].created_at,
      user_name: data[0].profiles.full_name,
    };

    setComments([...comments, addedComment]);
    setNewComment('');
    toast.success('Comment added');
  };

  if (!notice) return <div>Loading...</div>;

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
              {notice.office && (
                <Badge variant="secondary" className="shrink-0">
                  {notice.office}
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {notice.author_name}
              </div>
              {notice.department && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {notice.department}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(notice.created_at), 'PPP')}
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
                      <span className="font-medium text-sm">{comment.user_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(comment.created_at), 'PPp')}
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
