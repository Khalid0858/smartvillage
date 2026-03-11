'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, Spinner, EmptyState } from '@/components/ui';
import { timeAgo } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, Heart, MessageCircle } from 'lucide-react';

const CATEGORIES = ['all','general','agriculture','health','education','infrastructure','religion','entertainment'];

export default function ForumPage() {
  const { dbUser } = useAuth();
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title: '', content: '', category: 'general' });
  const [posting,  setPosting]  = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (category !== 'all') params.category = category;
      const { data } = await api.get('/posts', { params });
      setPosts(data.data);
    } catch (err) { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category]);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post('/posts', form);
      toast.success('Post created!');
      setShowForm(false);
      setForm({ title: '', content: '', category: 'general' });
      load();
    } catch (err) { toast.error(err.message); }
    finally { setPosting(false); }
  };

  const handleLike = async (id) => {
    if (!dbUser) return toast.error('Login to like');
    await api.post(`/posts/${id}/like`);
    load();
  };

  return (
    <MainLayout>
      <div className="page-container max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">💬 Community Forum</h1>
            <p className="text-gray-500 text-sm">Discuss village matters</p>
          </div>
          {dbUser && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> New Post
            </button>
          )}
        </div>

        {/* Create post form */}
        {showForm && (
          <form onSubmit={handlePost} className="card p-5 mb-6 space-y-3">
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="Post title" required className="input" />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
              {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              placeholder="What's on your mind?" rows={3} required className="input resize-none" />
            <div className="flex gap-2">
              <button type="submit" disabled={posting} className="btn-primary">
                {posting ? 'Posting...' : 'Post'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${category === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size={32} /></div>
        ) : posts.length === 0 ? (
          <EmptyState icon="💬" title="No posts yet" desc="Start the conversation!" />
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <Link key={post._id} href={`/forum/${post._id}`} className="card p-5 block hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <Avatar user={post.author} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900">{post.author?.name}</span>
                      <span className="badge bg-gray-100 text-gray-500 text-xs">{post.category}</span>
                      <span className="text-xs text-gray-400 ml-auto">{timeAgo(post.createdAt)}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={e => { e.preventDefault(); handleLike(post._id); }}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors">
                        <Heart size={12} /> {post.likes?.length || 0}
                      </button>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MessageCircle size={12} /> {post.comments?.length || 0}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">👁 {post.views}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
