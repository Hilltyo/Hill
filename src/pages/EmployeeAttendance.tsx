import { useState, useEffect } from 'react';
import { Profile, EmployeeAttendance as IEmployeeAttendance } from '../types';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface EmployeeAttendanceProps {
  profile: Profile | null;
}

export default function EmployeeAttendance({ profile }: EmployeeAttendanceProps) {
  const [attendance, setAttendance] = useState<IEmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState<IEmployeeAttendance | null>(null);

  useEffect(() => {
    if (profile) {
      fetchAttendance();
    }
  }, [profile]);

  async function fetchAttendance() {
    try {
      const { data, error } = await supabase
        .from('attendance_employees')
        .select('*')
        .eq('user_id', profile?.id)
        .order('date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAttendance(data || []);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const found = data?.find(a => a.date === today);
      setTodayAttendance(found || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleCheckIn = async (status: IEmployeeAttendance['status']) => {
    if (!profile) return;
    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('attendance_employees')
        .insert([{
          user_id: profile.id,
          status,
          date: format(new Date(), 'yyyy-MM-dd'),
          time: format(new Date(), 'HH:mm:ss'),
        }])
        .select()
        .single();

      if (error) throw error;
      setTodayAttendance(data);
      fetchAttendance();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Gagal mengirim absensi. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Absensi Mandiri</h1>
          <p className="text-slate-500 font-medium">Lakukan absensi harian Anda di sini.</p>
        </div>
      </div>

      {/* Check-in Card */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-red-50/50 p-10 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Clock className="w-32 h-32 text-primary" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-primary">
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900">{format(new Date(), 'HH:mm')}</p>
              <p className="text-slate-500 font-bold">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}</p>
            </div>
          </div>

          {todayAttendance ? (
            <div className="bg-green-50 border border-green-100 rounded-[32px] p-8 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-green-900 mb-2">Absensi Berhasil!</h3>
              <p className="text-green-700 font-medium mb-4">
                Anda telah melakukan absensi pada pukul <span className="font-bold">{todayAttendance.time.substring(0, 5)}</span>
              </p>
              <div className="px-6 py-2 bg-green-500 text-white rounded-full font-bold text-sm uppercase tracking-widest">
                {todayAttendance.status}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(['hadir', 'izin', 'sakit', 'alpha'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleCheckIn(status)}
                    disabled={submitting}
                    className={cn(
                      "group p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3",
                      status === 'hadir' ? "border-green-100 bg-green-50 hover:bg-green-100 text-green-700" :
                      status === 'izin' ? "border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-700" :
                      status === 'sakit' ? "border-orange-100 bg-orange-50 hover:bg-orange-100 text-orange-700" :
                      "border-red-100 bg-red-50 hover:bg-red-100 text-red-700"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110",
                      status === 'hadir' ? "bg-green-500 text-white" :
                      status === 'izin' ? "bg-blue-500 text-white" :
                      status === 'sakit' ? "bg-orange-500 text-white" :
                      "bg-red-500 text-white"
                    )}>
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold capitalize">{status}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-slate-500 text-sm font-medium">
                <AlertCircle className="w-5 h-5" />
                <p>Pastikan Anda berada di lingkungan sekolah saat melakukan absensi.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Riwayat 10 Hari Terakhir</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Tanggal</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Waktu</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-medium italic">Memuat data...</td>
                </tr>
              ) : attendance.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-slate-400 font-medium italic">Belum ada riwayat absensi.</td>
                </tr>
              ) : (
                attendance.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-700">
                      {format(new Date(item.date), 'dd MMMM yyyy', { locale: id })}
                    </td>
                    <td className="px-8 py-5 font-medium text-slate-500">{item.time.substring(0, 5)} WIB</td>
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
