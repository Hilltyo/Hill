import { Profile } from '../types';
import { 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface DashboardProps {
  profile: Profile | null;
}

export default function Dashboard({ profile }: DashboardProps) {
  const stats = [
    { label: 'Total Siswa', value: '1,240', icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Guru & Staff', value: '86', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Hadir Hari Ini', value: '94%', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Terlambat', value: '12', icon: Clock, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Halo, {profile?.full_name} 👋</h1>
          <p className="text-slate-500 font-medium">Selamat datang di Dashboard Absensi SMK Prima Unggul.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="font-bold text-slate-700">
            {format(new Date(), 'EEEE, dd MMMM yyyy', { locale: id })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                <span>+2.4%</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Aktivitas Terbaru</h2>
            <button className="text-primary font-bold text-sm hover:underline">Lihat Semua</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                  {i}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Absensi Siswa Kelas XII TKJ 1</p>
                  <p className="text-sm text-slate-500 font-medium">Oleh Guru: Budi Santoso • 10 menit yang lalu</p>
                </div>
                <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  Selesai
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-primary rounded-[40px] p-8 text-white shadow-xl shadow-red-100">
          <h2 className="text-2xl font-bold mb-6">Aksi Cepat</h2>
          <div className="space-y-4">
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all text-left px-6 flex items-center justify-between group">
              <span>Absen Mandiri</span>
              <CheckCircle2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all text-left px-6 flex items-center justify-between group">
              <span>Input Absensi Siswa</span>
              <GraduationCap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl font-bold transition-all text-left px-6 flex items-center justify-between group">
              <span>Cetak Rekap Bulanan</span>
              <FileText className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="mt-12 p-6 bg-white/10 rounded-3xl border border-white/10">
            <p className="text-sm font-medium opacity-80 mb-2">Pengumuman</p>
            <p className="font-bold leading-tight">Rapat koordinasi guru akan dilaksanakan besok jam 08:00 WIB.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for cn
import { cn } from '../lib/utils';
import { FileText } from 'lucide-react';
