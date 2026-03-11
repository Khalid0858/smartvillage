'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Spinner, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Search, Plus } from 'lucide-react';

const CATEGORIES = ['all','rice','vegetables','fish','cattle','poultry','fruits','dairy','spices','used_items','other'];

export default function MarketplacePage() {
  const { dbUser } = useAuth();
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [category,  setCategory]  = useState('all');
  const [search,    setSearch]    = useState('');
  const [searchQ,   setSearchQ]   = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = { limit: 20 };
      if (category !== 'all') params.category = category;
      if (searchQ) params.search = searchQ;
      const { data } = await api.get('/products', { params });
      setProducts(data.data);
    } catch (err) { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [category, searchQ]);

  return (
    <MainLayout>
      <div className="page-container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">🛒 Village Marketplace</h1>
            <p className="text-gray-500 text-sm">Buy and sell local products</p>
          </div>
          {dbUser && <Link href="/marketplace/new" className="btn-primary flex items-center gap-2"><Plus size={16} /> Sell Item</Link>}
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setSearchQ(search)}
              placeholder="Search products..." className="input pl-9" />
          </div>
          <button onClick={() => setSearchQ(search)} className="btn-primary px-4">Search</button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${category === c ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {c === 'all' ? 'All' : c.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size={32} /></div>
        ) : products.length === 0 ? (
          <EmptyState icon="🛒" title="No products found"
            action={dbUser && <Link href="/marketplace/new" className="btn-primary">List a Product</Link>} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <Link key={p._id} href={`/marketplace/${p._id}`} className="card hover:shadow-md transition-shadow">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  {p.images?.[0]
                    ? <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🛒</div>
                  }
                </div>
                <div className="p-3">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{p.title}</h3>
                  <p className="text-green-600 font-extrabold text-lg mt-0.5">৳{p.price} <span className="text-xs text-gray-400 font-normal">/{p.unit}</span></p>
                  <p className="text-xs text-gray-400 mt-1">{p.location || 'Village'}</p>
                  <p className="text-xs text-gray-400">{p.seller?.name}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
