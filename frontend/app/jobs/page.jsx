'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, Spinner, EmptyState } from '@/components/ui';
import { timeAgo, formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Plus, MapPin, Clock, DollarSign } from 'lucide-react';

const CATEGORIES = ['all','farming','construction','shop_helper','driver','domestic','part_time','skilled','teaching','other'];

export default function JobsPage() {
  const { dbUser } = useAuth();
  const [jobs,     setJobs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [category, setCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', category: 'farming', salaryAmount: '', salaryPeriod: 'per day', location: '', requirements: '' });
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = { isOpen: true };
      if (category !== 'all') params.category = category;
      const { data } = await api.get('/jobs', { params });
      setJobs(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category]);

  const handlePost = async (e) => {
    e.preventDefault();
    setPosting(true);
    try {
      await api.post('/jobs', { ...form, salaryAmount: Number(form.salaryAmount) });
      toast.success('Job posted!');
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.message); }
    finally { setPosting(false); }
  };

  const apply = async (id) => {
    if (!dbUser) return toast.error('Login to apply');
    try { await api.post(`/jobs/${id}/apply`); toast.success('Applied!'); }
    catch (err) { toast.error(err.message); }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">💼 Job Board</h1>
            <p className="text-gray-500 text-sm">Find local work opportunities</p>
          </div>
          {dbUser && <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Post Job</button>}
        </div>

        {showForm && (
          <form onSubmit={handlePost} className="card p-5 mb-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Job title" required className="input" />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                {CATEGORIES.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
              </select>
            </div>
            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Job description" rows={2} required className="input resize-none" />
            <div className="grid grid-cols-3 gap-3">
              <input type="number" value={form.salaryAmount} onChange={e => setForm({...form, salaryAmount: e.target.value})} placeholder="Salary ৳" className="input" />
              <select value={form.salaryPeriod} onChange={e => setForm({...form, salaryPeriod: e.target.value})} className="input">
                {['per day','per week','per month','per job','negotiable'].map(p => <option key={p}>{p}</option>)}
              </select>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Location" required className="input" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={posting} className="btn-primary">{posting ? 'Posting...' : 'Post Job'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${category === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {c === 'all' ? 'All' : c.replace('_',' ')}
            </button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-12"><Spinner size={32} /></div>
          : jobs.length === 0 ? <EmptyState icon="💼" title="No jobs found" />
          : (
          <div className="grid md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <div key={job._id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <span className="badge bg-blue-100 text-blue-700 mt-1 capitalize">{job.category.replace('_',' ')}</span>
                  </div>
                  <span className="text-green-600 font-bold text-sm">
                    {job.salaryAmount > 0 ? `৳${job.salaryAmount} ${job.salaryPeriod}` : 'Negotiable'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><MapPin size={10}/>{job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={10}/>{timeAgo(job.createdAt)}</span>
                  <span>{job.applicants?.length || 0} applicants</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar user={job.postedBy} size="sm" />
                    <span className="text-xs text-gray-500">{job.postedBy?.name}</span>
                  </div>
                  <button onClick={() => apply(job._id)} className="btn-primary text-sm py-1.5 px-4">Apply</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
