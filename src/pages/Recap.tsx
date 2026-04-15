import { useState, useEffect } from 'react';
import { Profile, EmployeeAttendance, StudentAttendance, Student } from '../types';
import { supabase } from '../lib/supabase';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText, Download, Calendar, Users, GraduationCap, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface RecapProps {
  profile: Profile | null;
}

export default function Recap({ profile }: RecapProps) {
  const [activeTab, setActiveTab] = useState<'employee' | 'student'>('employee');
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [employeeData, setEmployeeData] = useState<EmployeeAttendance[]>([]);
  const [studentData, setStudentData] = useState<StudentAttendance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'employee') fetchEmployeeRecap();
    else fetchStudentRecap();
  }, [activeTab, month]);

  async function fetchEmployeeRecap() {
    setLoading(true);
    try {
      const start = startOfMonth(new Date(month)).toISOString();
      const end = endOfMonth(new Date(month)).toISOString();

      const { data, error } = await supabase
        .from('attendance_employees')
        .select('*, profiles(*)')
        .gte('date', start.split('T')[0])
        .lte('date', end.split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setEmployeeData(data || []);
    } catch (error) {
      console.error('Error fetching employee recap:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStudentRecap() {
    setLoading(true);
    try {
      const start = startOfMonth(new Date(month)).toISOString();
      const end = endOfMonth(new Date(month)).toISOString();

      const { data, error } = await supabase
        .from('attendance_students')
        .select('*, students(*), profiles:teacher_id(*)')
        .gte('date', start.split('T')[0])
        .lte('date', end.split('T')[0])
        .order('date', { ascending: false });

      if (error) throw error;
      setStudentData(data || []);
    } catch (error) {
      console.error('Error fetching student recap:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Rekap Absensi</h1>
          <p className="text-slate-500 font-medium">Laporan kehadiran bulanan siswa dan karyawan.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="month" 
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-700 shadow-sm"
          />
          <button className="p-2.5 bg-white border border-slate-200 rounded-2xl text-slate-500 hover:text-primary hover:border-primary transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1.5 bg-slate-200/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('employee')}
          className={cn(
            "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
            activeTab === 'employee' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Users className="w-4 h-4" />
          <span>Karyawan</span>
        </button>
        {profile?.role !== 'staff' && (
          <button 
            onClick={() => setActiveTab('student')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
              activeTab === 'student' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Siswa</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {activeTab === 'employee' ? 'Nama Karyawan' : 'Nama Siswa'}
                </th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {activeTab === 'employee' ? 'Role' : 'Kelas'}
                </th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                {activeTab === 'student' && <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Guru Pengabsen</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium italic">Memuat data rekap...</td>
                </tr>
              ) : (activeTab === 'employee' ? employeeData : studentData).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-400 font-medium italic">Tidak ada data untuk periode ini.</td>
                </tr>
              ) : (
                (activeTab === 'employee' ? employeeData : studentData).map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-700">
                      {format(new Date(item.date), 'dd MMM yyyy', { locale: id })}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                          {(activeTab === 'employee' ? item.profiles?.full_name : item.students?.name)?.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900">
                          {activeTab === 'employee' ? item.profiles?.full_name : item.students?.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-slate-500 capitalize">
                        {activeTab === 'employee' ? item.profiles?.role : item.students?.class}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest",
                        item.status === 'hadir' ? "bg-green-100 text-green-700" :
                        item.status === 'izin' ? "bg-blue-100 text-blue-700" :
                        item.status === 'sakit' ? "bg-orange-100 text-orange-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    {activeTab === 'student' && (
                      <td className="px-8 py-5 text-sm font-medium text-slate-500">
                        {item.profiles?.full_name || 'System'}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
