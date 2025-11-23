import { Notice } from '@/types/notice';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Building2, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface NoticeCardProps {
  notice: Notice;
  className?: string;
}

export const NoticeCard = ({ notice, className }: NoticeCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className={`card-hover cursor-pointer ${className}`}
      onClick={() => navigate(`/notice/${notice.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2">
            {notice.title}
          </h3>
          <Badge variant="secondary" className="shrink-0">
            {notice.office}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {notice.content}
        </p>
        
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {notice.department}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(notice.datePosted), { addSuffix: true })}
          </div>
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {notice.attachments.length} attachment{notice.attachments.length > 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          Posted by <span className="font-medium">{notice.authorName}</span>
        </div>
      </CardContent>
    </Card>
  );
};
