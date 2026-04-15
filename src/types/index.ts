export type UserRole = 'admin' | 'guru' | 'staff';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  created_at: string;
}

export interface Student {
  id: string;
  nis: string;
  name: string;
  class: string;
  created_at: string;
}

export interface EmployeeAttendance {
  id: string;
  user_id: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  date: string;
  time: string;
  created_at: string;
  profile?: Profile;
}

export interface StudentAttendance {
  id: string;
  student_id: string;
  teacher_id: string;
  status: 'hadir' | 'izin' | 'sakit' | 'alpha';
  date: string;
  created_at: string;
  student?: Student;
  teacher?: Profile;
}
