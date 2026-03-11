'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home, AlertTriangle, ShoppingBag, Briefcase, MessageSquare,
  Heart, Sprout, Bell, Menu, X, ChevronDown, User, LogOut, Settings
} from 'lucide-react';

const NAV = [
  { href: '/',             label: 'Home',       icon: Home },
  { href: '/problems',     label: 'Problems',   icon: AlertTriangle },
  { href: '/services',     label: 'Services',   icon: Settings },
  { href: '/marketplace',  label: 'Market',     icon: ShoppingBag },
  { href: '/jobs',         label: 'Jobs',       icon: Briefcase },
  { href: '/forum',        label: 'Forum',      icon: MessageSquare },
  { href: '/donations',    label: 'Donate',     icon: Heart },
  { href: '/agriculture',  label: 'Agri',       icon: Sprout },
];

export default function Navbar() {
  const { dbUser, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl">🏡</span>
          <span className="font-extrabold text-green-700 text-lg tracking-tight">SmartVillage</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                ${pathname === href ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <Link href="/emergency"
            className="hidden sm:flex items-center gap-1.5 bg-red-600 hover:bg-red-700
                       text-white text-sm font-bold px-3 py-1.5 rounded-xl transition-colors">
            <AlertTriangle size={14} /> SOS
          </Link>

          {dbUser ? (
            <div className="relative">
              <button onClick={() => setDropOpen(!dropOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                  {dbUser.avatar
                    ? <img src={dbUser.avatar} alt="" className="w-full h-full object-cover" />
                    : <span className="text-green-700 font-bold text-sm">{dbUser.name?.[0]}</span>
                  }
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[100px] truncate">{dbUser.name}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <Link href="/dashboard" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <User size={14} /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings size={14} /> Profile
                  </Link>
                  {dbUser.role === 'admin' && (
                    <Link href="/admin" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-green-700 hover:bg-green-50">
                      ⚙️ Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button onClick={() => { logout(); setDropOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn-primary text-sm py-2 px-4">Login</Link>
          )}

          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${pathname === href ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <Link href="/emergency" onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50">
            <AlertTriangle size={16} /> Emergency SOS
          </Link>
        </div>
      )}
    </nav>
  );
}
