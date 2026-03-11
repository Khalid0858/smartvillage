'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { StatusBadge, Avatar, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { timeAgo } from '@/lib/utils';
import api from '@/lib/api';

export default function DashboardPage() {
  const { dbUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myProblems, setMyProblems] = useState([]);
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !dbUser) router.push('/login');
  }, [dbUser, authLoading]);

  useEffect(() => {
    if (!dbUser) return;
    Promise.all([
      api.get('/problems/my'),
      api.get('/products/my'),
    ]).then(([p, pr]) => {
      setMyProblems(p.data.data.slice(0, 5));
      setMyProducts(pr.data.data.slice(0, 5));
    }).finally(() => setLoading(false));
  }, [dbUser]);

  if (authLoading || !dbUser) return <MainLayout><div className="flex justify-center py-20"><Spinner size={32} /></div></MainLayout>;

  return (
    <MainLayout>
      <div className="page-container">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4">
            <Avatar user={dbUser} size="lg" />
            <div>
              <h1 className="text-xl font-extrabold">Welcome, {dbUser.name}! 👋</h1>
              <p className="text-green-100 text-sm">{dbUser.email}</p>
              <span className="inline-block mt-1 bg-white/20 rounded-full px-3 py-0.5 text-xs font-semibold capitalize">
                {dbUser.role.replace('_', ' ')}
              </span>
            </div>
            <Link href="/profile" className="ml-auto bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { href: '/problems/new', emoji: '⚠️', label: 'Report Problem' },
            { href: '/marketplace/new', emoji: '🛒', label: 'Sell Product' },
            { href: '/jobs', emoji: '💼', label: 'Find Jobs' },
            { href: '/emergency', emoji: '🚨', label: 'Emergency' },
          ].map(a => (
            <Link key={a.href} href={a.href}
              className="card p-4 text-center hover:shadow-md transition-shadow hover:-translate-y-0.5">
              <div className="text-2xl mb-1">{a.emoji}</div>
              <div className="text-sm font-semibold text-gray-700">{a.label}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* My Problems */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">My Reported Problems</h2>
              <Link href="/problems" className="text-xs text-green-600 hover:underline">View all</Link>
            </div>
            {loading ? <Spinner /> : myProblems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No problems reported yet</p>
            ) : myProblems.map(p => (
              <Link key={p._id} href={`/problems/${p._id}`} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-5 px-5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                  <p className="text-xs text-gray-400">{timeAgo(p.createdAt)}</p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>

          {/* My Products */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">My Listings</h2>
              <Link href="/marketplace" className="text-xs text-green-600 hover:underline">View all</Link>
            </div>
            {loading ? <Spinner /> : myProducts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No products listed yet</p>
            ) : myProducts.map(p => (
              <Link key={p._id} href={`/marketplace/${p._id}`} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 -mx-5 px-5">
                {p.images?.[0]
                  ? <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  : <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg shrink-0">🛒</div>
                }
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                  <p className="text-xs text-green-600 font-semibold">৳{p.price}/{p.unit}</p>
                </div>
                <span className={`text-xs font-semibold ${p.isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                  {p.isAvailable ? 'Active' : 'Inactive'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
