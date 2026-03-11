'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, Spinner } from '@/components/ui';
import { timeAgo } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Heart, Send } from 'lucide-react';

export default function PostDetailPage() {
  const { id } = useParams();
  const { dbUser } = useAuth();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => api.get(`/posts/${id}`).then(r => setPost(r.data.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, [id]);

  const handleLike = async () => {
    if (!dbUser) return toast.error('Login to like');
    await api.post(`/posts/${id}/like`);
    load();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      await api.post(`/posts/${id}/comments`, { content: comment });
      setComment('');
      load();
    } catch (err) { toast.error(err.message); }
    finally { setSending(false); }
  };

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size={32} /></div></MainLayout>;
  if (!post) return <MainLayout><div className="page-container text-center py-20">Post not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="page-container max-w-2xl mx-auto">
        <Link href="/forum" className="text-sm text-gray-500 hover:text-green-600 mb-4 block">← Forum</Link>
        <div className="card p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar user={post.author} />
            <div>
              <p className="font-semibold text-sm">{post.author?.name}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.createdAt)} · {post.category}</p>
            </div>
          </div>
          <h1 className="text-xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

          <div className="flex items-center gap-4 mt-5 pt-4 border-t border-gray-100">
            <button onClick={handleLike}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors font-medium">
              <Heart size={16} /> {post.likes?.length || 0} Likes
            </button>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-gray-900 mb-4">Comments ({post.comments?.length || 0})</h3>
          {post.comments?.map(c => (
            <div key={c._id} className="flex gap-3 mb-4">
              <Avatar user={c.author} size="sm" />
              <div className="flex-1">
                <div className="bg-gray-50 rounded-xl px-4 py-2.5">
                  <p className="text-xs font-semibold text-gray-700 mb-0.5">{c.author?.name}</p>
                  <p className="text-sm text-gray-600">{c.content}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1 ml-2">{timeAgo(c.createdAt)}</p>
              </div>
            </div>
          ))}
          {dbUser && (
            <form onSubmit={handleComment} className="flex gap-2 mt-4">
              <Avatar user={dbUser} size="sm" />
              <input value={comment} onChange={e => setComment(e.target.value)}
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
