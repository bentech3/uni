export type UserRole = 'admin' | 'staff' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  office?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  office: string;
  department: string;
  datePosted: string;
  expiryDate: string;
  attachments?: string[];
  isActive: boolean;
}

export interface Comment {
  id: string;
  noticeId: string;
  userId: string;
  userName: string;
  content: string;
  datePosted: string;
}
