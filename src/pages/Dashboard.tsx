// src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from 'sonner';
import { NoticeCard } from '@/components/NoticeCard';
import { supabase } from '@/integrations/supabase/client';
import type { Notice } from '@/types/notice';

const Dashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('notices');
  const [userNotices, setUserNotices] = useState<Notice[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState('');
  const [office, setOffice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const [departments, setDepartments] = useState<string[]>([]);
  const [offices, setOffices] = useState<string[]>([]);

  if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
    return <Navigate to="/auth" />;
  }

  // Fetch user notices
  useEffect(() => {
    const loadNotices = async () => {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load notices');
        console.error(error);
        return;
      }

      setUserNotices(data as Notice[]);
    };

    loadNotices();
  }, [user.id]);

  // Fetch departments and offices
  useEffect(() => {
    const loadMeta = async () => {
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('name')
        .order('name');

      if (deptError) {
        console.error(deptError);
      } else {
        setDepartments(['All Departments', ...deptData.map((d) => d.name)]);
      }

      const { data: officeData, error: officeError } = await supabase
        .from('offices')
        .select('name')
        .order('name');

      if (officeError) {
        console.error(officeError);
      } else {
        setOffices(['All Offices', ...officeData.map((o) => o.name)]);
      }
    };

    loadMeta();
  }, []);

  // Handle creating a new notice
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from('notices')
      .insert([
        {
          title,
          content,
          department_id: department === 'All Departments' ? null : department,
          office_id: office === 'All Offices' ? null : office,
          expire_at: expiryDate || null,
          author_id: user.id,
          is_active: true,
        },
      ])
      .select();

    if (error) {
      toast.error('Failed to create notice');
      console.error(error);
      return;
    }

    toast.success('Notice created!');
    setUserNotices([...(data as Notice[]), ...userNotices]);

    // Reset form
    setTitle('');
    setContent('');
    setDepartment('');
    setOffice('');
    setExpiryDate('');
    setActiveTab('notices');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {user.role === 'admin' ? 'Admin Dashboard' : 'Staff Dashboard'}
          </h1>
          <p className="text-muted-foreground">Manage notices and view statistics</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="notices">My Notices</TabsTrigger>
            <TabsTrigger value="create">Create Notice</TabsTrigger>
            {user.role === 'admin' && <TabsTrigger value="users">Manage Users</TabsTrigger>}
          </TabsList>

          <TabsContent value="notices">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userNotices.map((notice) => (
                <div key={notice.id} className="relative">
                  <NoticeCard notice={notice} />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => toast.info('Edit requires backend')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => toast.info('Delete requires backend')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {userNotices.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't created any notices yet</p>
                  <Button onClick={() => setActiveTab('create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Notice
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Notice</CardTitle>
                <CardDescription>Post a new notice to the university notice board</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateNotice} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter notice title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter notice content"
                      rows={6}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select value={department} onValueChange={setDepartment} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments
                            .filter((d) => d !== 'All Departments')
                            .map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="office">Office *</Label>
                      <Select value={office} onValueChange={setOffice} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select office" />
                        </SelectTrigger>
                        <SelectContent>
                          {offices
                            .filter((o) => o !== 'All Offices')
                            .map((off) => (
                              <SelectItem key={off} value={off}>
                                {off}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date *</Label>
                    <Input
                      id="expiry"
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex-1">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Notice
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {user.role === 'admin' && (
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      User management requires backend functionality
                    </p>
                    <Button variant="outline">Enable backend</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
