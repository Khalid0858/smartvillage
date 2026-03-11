'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, StarRating, Spinner, EmptyState } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Phone } from 'lucide-react';

const CATEGORIES = ['all','electrician','plumber','mason','tutor','doctor','carpenter','mechanic','tailor','farmer','other'];

export default function ServicesPage() {
  const { dbUser } = useAuth();
  const [services,  setServices]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [category,  setCategory]  = useState('all');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'all') params.category = category;
      const { data } = await api.get('/services', { params });
      setServices(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category]);

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">🔧 Local Services</h1>
            <p className="text-gray-500 text-sm">Find skilled workers in your village</p>
          </div>
          {dbUser?.role === 'service_provider' && (
            <Link href="/services/new" className="btn-primary">+ List Service</Link>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors
                ${category === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

        {loading ? <div className="flex justify-center py-12"><Spinner size={32} /></div>
          : services.length === 0 ? <EmptyState icon="🔧" title="No services found" />
          : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map(s => (
              <Link key={s._id} href={`/services/${s._id}`} className="card p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar user={s.provider} size="lg" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                    <span className="badge bg-blue-100 text-blue-700 capitalize mt-0.5">{s.category}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{s.description}</p>
                <div className="flex items-center justify-between">
                  <StarRating rating={s.avgRating} readonly />
                  <span className="text-xs text-gray-500">({s.totalReviews})</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 flex items-center gap-1"><Phone size={12}/>{s.phone}</span>
                  {s.priceMin > 0 && (
                    <span className="text-sm font-bold text-green-600">৳{s.priceMin}+</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
