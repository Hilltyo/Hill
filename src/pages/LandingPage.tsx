import { Link } from 'react-router-dom';
import { 
  Monitor, 
  Camera, 
  Calculator, 
  Radio, 
  Briefcase, 
  ShoppingBag,
  ChevronRight,
  School
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const majors = [
    { name: 'TKJ', desc: 'Teknik Komputer dan Jaringan', icon: Monitor, color: 'bg-blue-500' },
    { name: 'DKV', desc: 'Desain Komunikasi Visual', icon: Camera, color: 'bg-purple-500' },
    { name: 'AK', desc: 'Akuntansi', icon: Calculator, color: 'bg-green-500' },
    { name: 'BC', desc: 'Broadcasting', icon: Radio, color: 'bg-red-500' },
    { name: 'MPLB', desc: 'Manajemen Perkantoran & Layanan Bisnis', icon: Briefcase, color: 'bg-orange-500' },
    { name: 'BD', desc: 'Bisnis Digital', icon: ShoppingBag, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
            S
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">SMK Prima Unggul</span>
        </div>
        <Link 
          to="/login" 
          className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-red-100"
        >
          Masuk Sistem
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-6">
            Membangun <span className="text-primary">Masa Depan</span> Digital.
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-lg">
            SMK Prima Unggul adalah institusi pendidikan kejuruan yang berfokus pada pengembangan talenta industri kreatif dan teknologi.
          </p>
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-2 group"
            >
              Mulai Absensi <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="aspect-square rounded-[40px] bg-red-50 overflow-hidden relative">
            <img 
              src="https://picsum.photos/seed/school/800/800" 
              alt="SMK Prima Unggul" 
              className="w-full h-full object-cover mix-blend-multiply opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent"></div>
          </div>
          {/* Floating Stats */}
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-primary">
                <School className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Terakreditasi</p>
                <p className="text-2xl font-bold text-slate-900">Grade A</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Majors Section */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Program Keahlian</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
              Kami menawarkan 6 jurusan unggulan yang dirancang untuk memenuhi kebutuhan industri modern.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {majors.map((major, idx) => (
              <motion.div 
                key={major.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[32px] border border-slate-100 hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 ${major.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                  <major.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{major.name}</h3>
                <p className="text-slate-500 font-medium">{major.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">SMK Prima Unggul</span>
          </div>
          <p className="text-slate-400 text-sm">
            © 2024 SMK Prima Unggul. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
