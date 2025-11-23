import { Notice, User, Comment } from '@/types/notice';

export const mockUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@university.edu', role: 'admin' },
  { id: '2', name: 'Dr. Jane Smith', email: 'jane.smith@university.edu', role: 'staff', department: 'Computer Science', office: 'Dean of Students' },
  { id: '3', name: 'John Doe', email: 'john.doe@student.university.edu', role: 'student', department: 'Computer Science' },
];

export const departments = [
  'All Departments',
  'Computer Science',
  'Engineering',
  'Business Administration',
  'Natural Sciences',
  'Arts & Humanities',
  'Medicine',
  'Law',
];

export const offices = [
  'All Offices',
  'Vice Chancellor',
  'Academic Registrar',
  'Dean of Students',
  'Library',
  'ICT Department',
  'Admissions Office',
  'Finance Office',
  'Hostel Administration',
];

export const mockNotices: Notice[] = [
  {
    id: '1',
    title: 'Semester Registration Deadline Extended',
    content: 'The deadline for semester registration has been extended to December 15, 2025. All students are required to complete their registration before this date to avoid late fees. Visit the Academic Registrar\'s office for assistance.',
    authorId: '2',
    authorName: 'Dr. Jane Smith',
    office: 'Academic Registrar',
    department: 'All Departments',
    datePosted: '2025-11-15T10:00:00Z',
    expiryDate: '2025-12-15T23:59:59Z',
    isActive: true,
    attachments: ['registration_form.pdf'],
  },
  {
    id: '2',
    title: 'Library Hours During Examination Period',
    content: 'The university library will be open 24/7 during the examination period from December 1-20, 2025. Study rooms are available on a first-come, first-served basis. Please bring your student ID for entry.',
    authorId: '2',
    authorName: 'Dr. Jane Smith',
    office: 'Library',
    department: 'All Departments',
    datePosted: '2025-11-18T09:00:00Z',
    expiryDate: '2025-12-20T23:59:59Z',
    isActive: true,
  },
  {
    id: '3',
    title: 'Computer Science Department Seminar',
    content: 'Join us for an exciting seminar on "Artificial Intelligence in Modern Applications" by Prof. Michael Chen. Date: November 25, 2025, Time: 2:00 PM, Venue: CS Building, Room 301. All students and faculty are welcome!',
    authorId: '2',
    authorName: 'Dr. Jane Smith',
    office: 'Dean of Students',
    department: 'Computer Science',
    datePosted: '2025-11-19T11:30:00Z',
    expiryDate: '2025-11-25T18:00:00Z',
    isActive: true,
  },
  {
    id: '4',
    title: 'Hostel Fee Payment Reminder',
    content: 'This is a reminder that all hostel fees for the current semester must be paid by November 30, 2025. Late payments will incur a 10% penalty. Payment can be made at the Finance Office or through the online portal.',
    authorId: '2',
    authorName: 'Dr. Jane Smith',
    office: 'Hostel Administration',
    department: 'All Departments',
    datePosted: '2025-11-19T08:00:00Z',
    expiryDate: '2025-11-30T23:59:59Z',
    isActive: true,
  },
  {
    id: '5',
    title: 'Career Fair 2025',
    content: 'The annual Career Fair will be held on December 5, 2025, at the University Sports Complex. Over 50 companies will be present. Bring your CV and dress professionally. This is a great opportunity to network and explore job opportunities!',
    authorId: '2',
    authorName: 'Dr. Jane Smith',
    office: 'Dean of Students',
    department: 'All Departments',
    datePosted: '2025-11-19T14:00:00Z',
    expiryDate: '2025-12-05T18:00:00Z',
    isActive: true,
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    noticeId: '1',
    userId: '3',
    userName: 'John Doe',
    content: 'Thank you for the extension! This is very helpful.',
    datePosted: '2025-11-15T12:00:00Z',
  },
  {
    id: '2',
    noticeId: '3',
    userId: '3',
    userName: 'John Doe',
    content: 'Excited for this seminar! Will there be Q&A session?',
    datePosted: '2025-11-19T13:00:00Z',
  },
];
