'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Spinner, ImageUploadPreview } from '@/components/ui';
import { uploadImages } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['road','water','electricity','drainage','garbage','other'];
const PRIORITIES  = ['low','medium','high'];

export default function NewProblemPage() {
  const { dbUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', category: 'road', priority: 'medium', address: '' });
  const [files,   setFiles]   = useState([]);
  const [loading, setLoading] = useState(false);

  if (!dbUser) return (
    <MainLayout>
      <div className="page-container text-center py-20">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-xl font-bold mb-2">Login Required</h2>
        <Link href="/login" className="btn-primary inline-block">Login to Report</Link>
      </div>
    </MainLayout>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images = [];
      if (files.length > 0) {
        toast.loading('Uploading images...');
        images = await uploadImages(files, 'problems');
        toast.dismiss();
      }
      await api.post('/problems', { ...form, images, location: { address: form.address } });
      toast.success('Problem reported successfully!');
      router.push('/problems');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <div className="page-container max-w-2xl mx-auto">
        <Link href="/problems" className="text-sm text-gray-500 hover:text-green-600 mb-4 block">← Back to Problems</Link>
        <h1 className="section-title mb-6">📝 Report a Problem</h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Problem Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              placeholder="e.g. Broken road near mosque" required className="input" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="input">
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description *</label>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Describe the problem in detail..." rows={4} required className="input resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Location / Address</label>
            <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})}
              placeholder="e.g. Near the main market, North side" className="input" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Photos (up to 5)</label>
            <ImageUploadPreview files={files} onChange={e => setFiles(Array.from(e.target.files).slice(0,5))} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Spinner size={16} /> Submitting...</> : '🚀 Submit Report'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
