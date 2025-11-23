// src/lib/data.ts
import { supabase } from '@/integrations/supabase/client';
import type { Notice } from '@/types/notice';

// Fetch all active notices
export const fetchNotices = async (): Promise<Notice[]> => {
  const { data, error } = await supabase
    .from('notices')
    .select(`
      id,
      title,
      content,
      author_id,
      department_id,
      office_id,
      priority,
      is_active,
      created_at,
      updated_at,
      expire_at,
      profiles (full_name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notices:', error.message);
    return [];
  }

  // Map department_id and office_id to names
  const mappedData = data.map((notice: any) => ({
    ...notice,
    authorName: notice.profiles?.full_name ?? 'Unknown',
  }));

  return mappedData;
};

// Fetch all departments
export const fetchDepartments = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('departments')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching departments:', error.message);
    return [];
  }

  return data.map((d: any) => d.name);
};

// Fetch all offices
export const fetchOffices = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from('offices')
    .select('name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching offices:', error.message);
    return [];
  }

  return data.map((o: any) => o.name);
};
