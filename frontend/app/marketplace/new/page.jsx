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

const CATEGORIES = ['rice','vegetables','fish','cattle','poultry','fruits','dairy','spices','used_items','other'];

export default function NewProductPage() {
  const { dbUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', category: 'vegetables', price: '', unit: 'kg', quantity: 1, location: '', contactPhone: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  if (!dbUser) return <MainLayout><div className="page-container text-center py-20"><Link href="/login" className="btn-primary">Login to Sell</Link></div></MainLayout>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let images = [];
      if (files.length > 0) {
        toast.loading('Uploading images...');
        images = await uploadImages(files, 'products');
        toast.dismiss();
      }
      await api.post('/products', { ...form, price: Number(form.price), images });
      toast.success('Product listed!');
      router.push('/marketplace');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <div className="page-container max-w-2xl mx-auto">
        <Link href="/marketplace" className="text-sm text-gray-500 hover:text-green-600 mb-4 block">← Back</Link>
        <h1 className="section-title mb-6">🛒 List a Product for Sale</h1>
        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            placeholder="Product title e.g. Fresh Hilsa Fish" required className="input" />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace('_',' ')}</option>)}
            </select>
            <div className="flex gap-2">
              <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})}
                placeholder="Price ৳" required min="0" className="input flex-1" />
              <input type="text" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})}
                placeholder="unit" className="input w-20" />
            </div>
          </div>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})}
            placeholder="Describe your product..." rows={3} required className="input resize-none" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
              placeholder="Location" className="input" />
            <input type="tel" value={form.contactPhone} onChange={e => setForm({...form, contactPhone: e.target.value})}
              placeholder="Contact phone" className="input" />
          </div>
          <ImageUploadPreview files={files} onChange={e => setFiles(Array.from(e.target.files).slice(0,5))} />
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Spinner size={16} /> Listing...</> : '✅ List Product'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
