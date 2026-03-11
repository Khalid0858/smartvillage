'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { StatusBadge, Avatar, Spinner } from '@/components/ui';
import { timeAgo, CATEGORY_ICONS } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { ThumbsUp, Send } from 'lucide-react';

export default function ProblemDetailPage() {
  const { id } = useParams();
  const { dbUser } = useAuth();
  const [problem,  setProblem]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [comment,  setComment]  = useState('');
  const [sending,  setSending]  = useState(false);

  useEffect(() => {
    api.get(`/problems/${id}`).then(r => setProblem(r.data.data)).catch(() => toast.error('Failed to load'))
       .finally(() => setLoading(false));
  }, [id]);

  const handleUpvote = async () => {
    if (!dbUser) return toast.error('Login to upvote');
    const { data } = await api.post(`/problems/${id}/upvote`);
    setProblem(p => ({ ...p, upvotes: Array(data.upvotes).fill(null) }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      const { data } = await api.post(`/problems/${id}/comments`, { text: comment });
      setProblem(p => ({ ...p, comments: data.data }));
      setComment('');
    } catch (err) { toast.error(err.message); }
    finally { setSending(false); }
  };

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size={32} /></div></MainLayout>;
  if (!problem) return <MainLayout><div className="page-container text-center py-20">Problem not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="page-container max-w-3xl mx-auto">
        <Link href="/problems" className="text-sm text-gray-500 hover:text-green-600 mb-4 block">← Back</Link>

        <div className="card p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{CATEGORY_ICONS[problem.category]}</span>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900">{problem.title}</h1>
                <p className="text-sm text-gray-500 capitalize">{problem.category} problem</p>
              </div>
            </div>
            <StatusBadge status={problem.status} />
          </div>

          {problem.images?.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {problem.images.map((img, i) => (
                <img key={i} src={img} alt="" className="w-48 h-32 object-cover rounded-xl shrink-0" />
              ))}
            </div>
          )}

          <p className="text-gray-700 leading-relaxed mb-4">{problem.description}</p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
            {problem.location?.address && <span>📍 {problem.location.address}</span>}
            <span>📅 {timeAgo(problem.createdAt)}</span>
            {problem.priority && <span className={`capitalize font-semibold ${problem.priority === 'high' ? 'text-red-600' : problem.priority === 'medium' ? 'text-amber-600' : 'text-green-600'}`}>⚡ {problem.priority} priority</span>}
          </div>

          <div className="flex items-center gap-4">
            <Avatar user={problem.reportedBy} size="sm" />
            <span className="text-sm text-gray-600">Reported by <strong>{problem.reportedBy?.name}</strong></span>
            <button onClick={handleUpvote}
              className="ml-auto flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors">
              <ThumbsUp size={14} /> {problem.upvotes?.length || 0} upvotes
            </button>
          </div>

          {problem.adminNote && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800"><strong>Admin Note:</strong> {problem.adminNote}</p>
            </div>
          )}
        </div>

        {/* Comments */}
        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">💬 Comments ({problem.comments?.length || 0})</h3>

          {problem.comments?.map(c => (
            <div key={c._id} className="flex gap-3 mb-4">
              <Avatar user={c.user} size="sm" />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">{c.user?.name}</p>
                  <p className="text-sm text-gray-600">{c.text}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-2">{timeAgo(c.createdAt)}</p>
              </div>
            </div>
          ))}

          {dbUser && (
            <form onSubmit={handleComment} className="flex gap-2 mt-4">
              <Avatar user={dbUser} size="sm" />
              <input type="text" value={comment} onChange={e => setComment(e.target.value)}
                placeholder="Write a comment..." className="input flex-1" />
              <button type="submit" disabled={sending} className="btn-primary px-3">
                {sending ? <Spinner size={14} /> : <Send size={14} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
