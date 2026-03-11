import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

const MODULES = [
  { href: '/problems',    emoji: '🛣️', title: 'Report Problems',   desc: 'Road, water, electricity issues',  color: 'from-orange-400 to-red-500' },
  { href: '/services',    emoji: '🔧', title: 'Local Services',    desc: 'Electricians, plumbers, doctors',   color: 'from-blue-400 to-indigo-500' },
  { href: '/marketplace', emoji: '🛒', title: 'Village Market',    desc: 'Buy & sell rice, fish, cattle',     color: 'from-emerald-400 to-teal-500' },
  { href: '/jobs',        emoji: '💼', title: 'Job Board',         desc: 'Farming, construction & more',      color: 'from-violet-400 to-purple-500' },
  { href: '/forum',       emoji: '💬', title: 'Community Forum',   desc: 'Discuss village matters',           color: 'from-pink-400 to-rose-500' },
  { href: '/donations',   emoji: '💝', title: 'Donations',         desc: 'Support village development',       color: 'from-amber-400 to-orange-500' },
  { href: '/agriculture', emoji: '🌾', title: 'Smart Agriculture', desc: 'Weather, tips & crop diseases',     color: 'from-lime-400 to-green-500' },
  { href: '/emergency',   emoji: '🚨', title: 'Emergency SOS',     desc: 'Instant help from volunteers',      color: 'from-red-500 to-rose-600' },
  { href: '/notices',     emoji: '📋', title: 'Notice Board',      desc: 'Mosque, school & community news',   color: 'from-sky-400 to-cyan-500' },
];

export default function HomePage() {
  return (
    <MainLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-emerald-500 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-7xl mb-4">🏡</div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
            Welcome to SmartVillage
          </h1>
          <p className="text-green-100 text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            A digital platform connecting your community — report problems, access services,
            trade goods, find jobs, and build a better village together.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register"
              className="bg-white text-green-700 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors text-lg">
              Join Your Village →
            </Link>
            <Link href="/problems"
              className="bg-green-800/50 hover:bg-green-800/70 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-lg border border-white/20">
              View Problems
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { emoji: '👥', label: 'Community Members', val: '500+' },
            { emoji: '⚠️', label: 'Problems Reported',  val: '120+' },
            { emoji: '🔧', label: 'Service Providers',  val: '45+' },
            { emoji: '💝', label: 'Donation Campaigns', val: '12+' },
          ].map(s => (
            <div key={s.label} className="py-2">
              <div className="text-2xl">{s.emoji}</div>
              <div className="text-xl font-black text-green-700">{s.val}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules grid */}
      <section className="page-container">
        <h2 className="section-title text-center mb-2">Everything Your Village Needs</h2>
        <p className="text-gray-500 text-center mb-8">Access all community services in one place</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(({ href, emoji, title, desc, color }) => (
            <Link key={href} href={href}
              className="card p-6 hover:shadow-md transition-all duration-200 group hover:-translate-y-0.5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {emoji}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12 px-4 mt-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold mb-3">🚨 Need Emergency Help?</h2>
          <p className="text-green-100 mb-6">Press SOS to instantly alert all volunteers in your village.</p>
          <Link href="/emergency"
            className="bg-red-600 hover:bg-red-700 text-white font-black px-12 py-4 rounded-2xl text-xl
                       inline-block transition-all active:scale-95 shadow-lg">
            EMERGENCY SOS
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
