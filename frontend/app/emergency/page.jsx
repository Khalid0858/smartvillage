'use client';
import { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { AlertTriangle } from 'lucide-react';

const TYPES = [
  { id: 'medical',  emoji: '🏥', label: 'Medical Emergency' },
  { id: 'fire',     emoji: '🔥', label: 'Fire' },
  { id: 'accident', emoji: '🚗', label: 'Accident' },
  { id: 'flood',    emoji: '🌊', label: 'Flood' },
  { id: 'crime',    emoji: '🚨', label: 'Crime / Theft' },
  { id: 'other',    emoji: '⚠️', label: 'Other Emergency' },
];

export default function EmergencyPage() {
  const { dbUser } = useAuth();
  const [type,        setType]       = useState('medical');
  const [description, setDescription]= useState('');
  const [address,     setAddress]    = useState('');
  const [loading,     setLoading]    = useState(false);
  const [sent,        setSent]       = useState(false);

  const sendSOS = async () => {
    if (!dbUser) return toast.error('Please login first!');
    setLoading(true);

    const doSend = async (coords = null) => {
      try {
        await api.post('/emergency', {
          type,
          description: description || `${type} emergency`,
          location: {
            address,
            coordinates: coords || undefined,
          },
        });
        setSent(true);
        toast.success('Emergency alert sent! Volunteers notified.');
      } catch (err) {
        toast.error(err.message);
      } finally { setLoading(false); }
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => doSend({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()    => doSend()
    );
  };

  if (sent) return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-3xl font-extrabold text-green-700 mb-2">Help is Coming!</h2>
        <p className="text-gray-600 mb-2">Your emergency alert has been sent to all volunteers.</p>
        <p className="text-gray-500 text-sm mb-8">Stay calm. Help is on the way.</p>
        <div className="flex gap-3">
          <button onClick={() => setSent(false)} className="btn-secondary">Send Another Alert</button>
          <Link href="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-red-50 px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <AlertTriangle size={48} className="text-red-600 mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold text-red-700">Emergency Help</h1>
            <p className="text-gray-600 mt-1">Select emergency type and press SOS</p>
          </div>

          {/* Type selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`p-3 rounded-xl border-2 text-center transition-all
                  ${type === t.id ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                <div className="text-2xl mb-1">{t.emoji}</div>
                <div className="text-xs font-semibold text-gray-700 leading-tight">{t.label}</div>
              </button>
            ))}
          </div>

          <textarea value={description} onChange={e => setDescription(e.target.value)}
            placeholder="Describe the emergency (optional but helpful)..."
            rows={2} className="input mb-3 resize-none" />

          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder="Your location / address (optional)" className="input mb-6" />

          {/* BIG SOS Button */}
          <button onClick={sendSOS} disabled={loading || !dbUser}
            className="w-full py-6 bg-red-600 hover:bg-red-700 text-white text-4xl font-black rounded-3xl
                       shadow-2xl transition-all active:scale-95 disabled:opacity-50
                       flex flex-col items-center justify-center gap-1">
            <span>{loading ? '⏳' : '🆘'}</span>
            <span className="text-2xl">{loading ? 'Sending...' : 'SOS'}</span>
            <span className="text-sm font-normal opacity-80">Press for Emergency Help</span>
          </button>

          {!dbUser && (
            <p className="text-center text-sm text-red-600 mt-4">
              <Link href="/login" className="font-semibold underline">Login required</Link> to send emergency alerts
            </p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
