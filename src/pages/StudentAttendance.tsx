import { useState, useEffect } from 'react';
import { Profile, Student, StudentAttendance as IStudentAttendance } from '../types';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Search, Filter, Check, X, User, GraduationCap, Save } from 'lucide-react';
import { cn } from '../lib/utils';

interface StudentAttendanceProps {
  profile: Profile | null;
}

export default function StudentAttendance({ profile }: StudentAttendanceProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [attendanceData, setAttendanceData] = useState<Record<string, IStudentAttendance['status']>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudentsByClass();
    }
  }, [selectedClass]);

  async function fetchClasses() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('class')
        .order('class');
      
      if (error) throw error;
      const uniqueClasses = Array.from(new Set(data.map(s => s.class)));
      setClasses(uniqueClasses);
      if (uniqueClasses.length > 0) setSelectedClass(uniqueClasses[0]);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }

  async function fetchStudentsByClass() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('class', selectedClass)
        .order('name');

      if (error) throw error;
      setStudents(data || []);
      
      // Reset attendance data
      const initial: Record<string, IStudentAttendance['status']> = {};
      data?.forEach(s => initial[s.id] = 'hadir');
      setAttendanceData(initial);

      // Check if attendance already exists for today
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: existing } = await supabase
        .from('attendance_students')
        .select('*')
        .eq('date', today)
        .in('student_id', data?.map(s => s.id) || []);

      if (existing && existing.length > 0) {
        const updated = { ...initial };
        existing.forEach(a => updated[a.student_id] = a.status);
        setAttendanceData(updated);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = (studentId: string, status: IStudentAttendance['status']) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      const records = students.map(s => ({
        student_id: s.id,
        teacher_id: profile.id,
        status: attendanceData[s.id],
        date: today
      }));

      // Upsert logic: delete existing for today and insert new
      const { error: deleteError } = await supabase
        .from('attendance_students')
        .delete()
        .eq('date', today)
        .in('student_id', students.map(s => s.id));

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('attendance_students')
        .insert(records);

      if (insertError) throw insertError;

      alert('Absensi berhasil disimpan!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Gagal menyimpan absensi.');
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nis.includes(searchQuery)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Absensi Siswa</h1>
          <p className="text-slate-500 font-medium">Input kehadiran siswa per kelas hari ini.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-bold text-slate-700">{selectedClass || 'Pilih Kelas'}</span>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari nama atau NIS siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="flex-1 md:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-bold text-slate-700"
          >
            {classes.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button 
            onClick={handleSave}
            disabled={saving || loading || students.length === 0}
            className="px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-red-100 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest w-20">NIS</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Siswa</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Status Kehadiran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-medium italic">Memuat data siswa...</td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-medium italic">Tidak ada siswa ditemukan di kelas ini.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 font-mono text-sm text-slate-500">{student.nis}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-900">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        {(['hadir', 'izin', 'sakit', 'alpha'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(student.id, status)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-2",
                              attendanceData[student.id] === status
                                ? status === 'hadir' ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-100" :
                                  status === 'izin' ? "bg-blue-500 border-blue-500 text-white shadow-lg shadow-blue-100" :
                                  status === 'sakit' ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100" :
                                  "bg-red-500 border-red-500 text-white shadow-lg shadow-red-100"
                                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </td>
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
