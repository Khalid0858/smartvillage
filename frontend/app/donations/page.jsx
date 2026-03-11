'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { ProgressBar, Modal, Spinner, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function DonationsPage() {
  const { dbUser } = useAuth();
  const [campaigns,  setCampaigns]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [amount,     setAmount]     = useState('');
  const [message,    setMessage]    = useState('');
  const [anonymous,  setAnonymous]  = useState(false);
  const [donating,   setDonating]   = useState(false);

  useEffect(() => {
    api.get('/donations').then(r => setCampaigns(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleDonate = async () => {
    if (!dbUser) return toast.error('Login to donate');
    if (!amount || Number(amount) < 1) return toast.error('Enter a valid amount');
    setDonating(true);
    try {
      const { data } = await api.post(`/donations/${selected._id}/donate`, { amount: Number(amount), message, anonymous });
      toast.success(`৳${amount} donated! Thank you!`);
      setSelected(null); setAmount(''); setMessage('');
      setCampaigns(prev => prev.map(c => c._id === selected._id ? { ...c, raisedAmount: data.raisedAmount } : c));
    } catch (err) { toast.error(err.message); }
    finally { setDonating(false); }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <h1 className="section-title mb-1">💝 Donation Campaigns</h1>
        <p className="text-gray-500 text-sm mb-8">Support village development and help those in need</p>

        {loading ? <div className="flex justify-center py-12"><Spinner size={32} /></div>
          : campaigns.length === 0 ? <EmptyState icon="💝" title="No campaigns yet" />
          : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map(c => (
              <div key={c._id} className="card overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-green-400 to-emerald-500 relative">
                  {c.image
                    ? <img src={c.image} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-5xl">💝</div>
                  }
                  <span className="absolute top-3 left-3 badge bg-white text-green-700 capitalize">{c.category}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{c.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">{c.description}</p>
                  <ProgressBar current={c.raisedAmount} goal={c.goalAmount} />
                  {c.deadline && (
                    <p className="text-xs text-gray-400 mt-2">⏰ Deadline: {formatDate(c.deadline)}</p>
                  )}
                  <button onClick={() => setSelected(c)} className="btn-primary w-full mt-4">
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Donate Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Donate to: ${selected?.title}`}>
        <div className="space-y-4">
          <ProgressBar current={selected?.raisedAmount || 0} goal={selected?.goalAmount || 1} />
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Amount (৳) *</label>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="Enter amount" min="1" className="input" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[100, 200, 500, 1000].map(a => (
              <button key={a} onClick={() => setAmount(String(a))}
                className="px-3 py-1 rounded-full border border-gray-200 text-sm hover:bg-green-50 hover:border-green-300 transition-colors">
                ৳{a}
              </button>
            ))}
          </div>
          <input type="text" value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Leave a message (optional)" className="input" />
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)}
              className="w-4 h-4 rounded" />
            Donate anonymously
          </label>
          <button onClick={handleDonate} disabled={donating} className="btn-primary w-full">
            {donating ? 'Processing...' : `Donate ৳${amount || '0'}`}
          </button>
        </div>
      </Modal>
    </MainLayout>
  );
}
