'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { StatusBadge, Spinner, EmptyState } from '@/components/ui';
import { timeAgo, CATEGORY_ICONS } from '@/lib/utils';
import api from '@/lib/api';
import { Plus, Filter, ThumbsUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = ['all','road','water','electricity','drainage','garbage','other'];
const STATUSES   = ['all','pending','under_review','in_progress','solved'];

export default function ProblemsPage() {
  const { dbUser } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState('all');
  const [status,   setStatus]   = useState('all');
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (category !== 'all') params.category = category;
      if (status   !== 'all') params.status   = status;
      const { data } = await api.get('/problems', { params });
      setProblems(data.data);
      setPages(data.pagination.pages);
    } catch (err) { toast.error('Failed to load problems'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category, status, page]);

  const handleUpvote = async (id) => {
    if (!dbUser) return toast.error('Login to upvote');
    try {
      await api.post(`/problems/${id}/upvote`);
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">🛣️ Village Problems</h1>
            <p className="text-gray-500 text-sm">Report and track infrastructure issues</p>
          </div>
          {dbUser && (
            <Link href="/problems/new" className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Report Issue
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCategory(c); setPage(1); }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${category === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {c === 'all' ? 'All Categories' : `${CATEGORY_ICONS[c]} ${c}`}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map(s => (
            <button key={s} onClick={() => { setStatus(s); setPage(1); }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${status === s ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s === 'all' ? 'All Status' : s.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size={32} /></div>
        ) : problems.length === 0 ? (
          <EmptyState icon="🛣️" title="No problems found"
            desc="Be the first to report an issue in your village"
            action={dbUser && <Link href="/problems/new" className="btn-primary">Report Problem</Link>} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.map(p => (
              <Link key={p._id} href={`/problems/${p._id}`} className="card hover:shadow-md transition-shadow">
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-2xl">{CATEGORY_ICONS[p.category]}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{p.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>📍 {p.location?.address || 'Village'}</span>
                    <span>{timeAgo(p.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={e => { e.preventDefault(); handleUpvote(p._id); }}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-green-600 transition-colors">
                      <ThumbsUp size={12} /> {p.upvotes?.length || 0}
                    </button>
                    <span className="text-xs text-gray-400">💬 {p.comments?.length || 0}</span>
                    <span className="ml-auto text-xs text-gray-400">{p.reportedBy?.name}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors
                  ${page === p ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
