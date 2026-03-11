'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];
const STATUS_COLORS = { pending: '#f59e0b', under_review: '#3b82f6', in_progress: '#f97316', solved: '#22c55e' };

export default function AdminPage() {
  const { dbUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('overview');

  useEffect(() => {
    if (!authLoading && (!dbUser || dbUser.role !== 'admin')) router.push('/');
  }, [dbUser, authLoading]);

  useEffect(() => {
    if (!dbUser || dbUser.role !== 'admin') return;
    Promise.all([api.get('/admin/stats'), api.get('/admin/users')])
      .then(([s, u]) => { setStats(s.data.data); setUsers(u.data.data); })
      .finally(() => setLoading(false));
  }, [dbUser]);

  const changeRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success('Role updated');
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u));
    } catch (err) { toast.error(err.message); }
  };

  const toggleActive = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/toggle`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.isActive } : u));
      toast.success('Status updated');
    } catch (err) { toast.error(err.message); }
  };

  if (authLoading || loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size={32} /></div></MainLayout>;

  const STAT_CARDS = [
    { emoji: '👥', label: 'Total Users',     val: stats?.users },
    { emoji: '⚠️', label: 'Problems',         val: stats?.problems },
    { emoji: '🛒', label: 'Products',         val: stats?.products },
    { emoji: '🔧', label: 'Services',         val: stats?.services },
    { emoji: '💼', label: 'Open Jobs',        val: stats?.jobs },
    { emoji: '💬', label: 'Forum Posts',      val: stats?.posts },
    { emoji: '🚨', label: 'Active SOS',       val: stats?.emergencies },
    { emoji: '💝', label: 'Total Donated ৳',  val: stats?.totalDonated?.toLocaleString() },
  ];

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="section-title">⚙️ Admin Dashboard</h1>
          <div className="flex gap-2">
            {['overview','users'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors capitalize
                  ${tab === t ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              {STAT_CARDS.map(s => (
                <div key={s.label} className="card p-4">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-2xl font-black text-green-700">{s.val ?? '—'}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-5">
                <h3 className="font-bold mb-4 text-gray-900">Problems by Status</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={stats?.problemsByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={80} label={({ _id }) => _id?.replace('_',' ')}>
                      {stats?.problemsByStatus?.map((_, i) => <Cell key={i} fill={Object.values(STATUS_COLORS)[i] || COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-5">
                <h3 className="font-bold mb-4 text-gray-900">Problems by Category</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats?.problemsByCategory}>
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#22c55e" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="card p-5 md:col-span-2">
                <h3 className="font-bold mb-4 text-gray-900">New Users (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={stats?.recentUsers}>
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {tab === 'users' && (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">
                            {u.name?.[0]}
                          </div>
                          <span className="font-medium text-gray-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <select value={u.role} onChange={e => changeRole(u._id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500">
                          {['user','admin','service_provider','volunteer'].map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {u.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleActive(u._id)}
                          className={`text-xs font-semibold px-2 py-1 rounded-lg transition-colors
                            ${u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}>
                          {u.isActive ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
