import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { AutoScrollBoard } from '@/components/AutoScrollBoard';
import { NoticeFilters } from '@/components/NoticeFilters';
import { mockNotices } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { NoticeCard } from '@/components/NoticeCard';

const Home = () => {
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedOffice, setSelectedOffice] = useState('All Offices');
  const [viewMode, setViewMode] = useState<'scroll' | 'grid'>('scroll');

  const filteredNotices = useMemo(() => {
    return mockNotices.filter((notice) => {
      const matchesSearch =
        search === '' ||
        notice.title.toLowerCase().includes(search.toLowerCase()) ||
        notice.content.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        selectedDepartment === 'All Departments' ||
        notice.department === selectedDepartment ||
        notice.department === 'All Departments';

      const matchesOffice =
        selectedOffice === 'All Offices' || notice.office === selectedOffice;

      return matchesSearch && matchesDepartment && matchesOffice && notice.isActive;
    });
  }, [search, selectedDepartment, selectedOffice]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">
            UCU Digital Notice Board
          </h1>
          <p className="text-muted-foreground">
            Stay updated with the latest announcements and notices from Uganda Christian University
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <NoticeFilters
            search={search}
            setSearch={setSearch}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            selectedOffice={selectedOffice}
            setSelectedOffice={setSelectedOffice}
          />
        </div>

        <div className="mb-4 flex justify-end">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'scroll' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('scroll')}
            >
              <List className="h-4 w-4 mr-2" />
              Auto-Scroll
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4 mr-2" />
              Grid View
            </Button>
          </div>
        </div>

        {viewMode === 'scroll' ? (
          <AutoScrollBoard notices={filteredNotices} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotices.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}

        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notices found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
