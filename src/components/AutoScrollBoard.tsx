import { useState, useEffect } from 'react';
import { Notice } from '@/types/notice';
import { NoticeCard } from './NoticeCard';
import { Button } from '@/components/ui/button';
import { Pause, Play } from 'lucide-react';

interface AutoScrollBoardProps {
  notices: Notice[];
}

export const AutoScrollBoard = ({ notices }: AutoScrollBoardProps) => {
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const scrollContainer = document.getElementById('scroll-container');
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1; // pixels per frame

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        scrollContainer.scrollTop = scrollPosition;

        // Reset to top when reaching the end
        if (scrollPosition >= scrollContainer.scrollHeight - scrollContainer.clientHeight) {
          scrollPosition = 0;
        }
      }
      requestAnimationFrame(scroll);
    };

    const animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsPaused(!isPaused)}
          className="shadow-lg"
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>
      </div>

      <div
        id="scroll-container"
        className="h-[calc(100vh-12rem)] overflow-y-auto scrollbar-hide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="space-y-4 p-1">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
          {/* Duplicate for seamless loop */}
          {notices.map((notice) => (
            <NoticeCard key={`duplicate-${notice.id}`} notice={notice} />
          ))}
        </div>
      </div>
    </div>
  );
};
