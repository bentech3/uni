import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { NoticeFilters } from '@/components/NoticeFilters';
import { NoticeCard } from '@/components/NoticeCard';
import { fetchNotices, fetchDepartments, fetchOffices } from '@/lib/data';

const Home = () => {
  const [notices, setNotices] = useState([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [offices, setOffices] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedOffice, setSelectedOffice] = useState('All Offices');

  useEffect(() => {
    fetchNotices().then(setNotices);
    fetchDepartments().then((d) => setDepartments(['All Departments', ...d]));
    fetchOffices().then((o) => setOffices(['All Offices', ...o]));
  }, []);

  const filteredNotices = useMemo(() => {
    return notices.filter((notice: any) => {
      const matchesSearch =
        search === '' ||
        notice.title.toLowerCase().includes(search.toLowerCase()) ||
        notice.content.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        selectedDepartment === 'All Departments' ||
        notice.department_id === selectedDepartment;

      const matchesOffice =
        selectedOffice === 'All Offices' ||
        notice.office_id === selectedOffice;

      return matchesSearch && matchesDepartment && matchesOffice && notice.is_active;
    });
  }, [search, selectedDepartment, selectedOffice, notices]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <NoticeFilters
          search={search}
          setSearch={setSearch}
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedOffice={selectedOffice}
          setSelectedOffice={setSelectedOffice}
          departments={departments}
          offices={offices}
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.map((notice: any) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
          {filteredNotices.length === 0 && (
            <p className="text-center col-span-full text-muted-foreground">No notices found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
