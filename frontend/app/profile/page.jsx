'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, Spinner } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { uploadImage } from '@/lib/utils';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { dbUser, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', phone: '', bio: '', village: '', district: '' });
  const [uploading, setUploading] = useState(false);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (!authLoading && !dbUser) router.push('/login');
    if (dbUser) setForm({
      name: dbUser.name || '',
      phone: dbUser.phone || '',
      bio: dbUser.bio || '',
      village: dbUser.address?.village || '',
      district: dbUser.address?.district || '',
    });
  }, [dbUser, authLoading]);

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'avatars');
      await api.put('/auth/profile', { avatar: url });
      await refreshUser();
      toast.success('Photo updated!');
    } catch (err) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', {
        name: form.name, phone: form.phone, bio: form.bio,
        address: { village: form.village, district: form.district },
      });
      await refreshUser();
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  if (authLoading || !dbUser) return <MainLayout><div className="flex justify-center py-20"><Spinner size={32} /></div></MainLayout>;

  return (
    <MainLayout>
      <div className="page-container max-w-xl mx-auto">
        <h1 className="section-title mb-6">👤 My Profile</h1>

        {/* Avatar */}
        <div className="card p-6 mb-5">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar user={dbUser} size="lg" />
              {uploading && <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-full"><Spinner size={16} /></div>}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg">{dbUser.name}</p>
              <p className="text-sm text-gray-500">{dbUser.email}</p>
              <span className="badge bg-green-100 text-green-700 capitalize mt-1">{dbUser.role.replace('_',' ')}</span>
            </div>
            <label className="ml-auto btn-secondary text-sm cursor-pointer">
              📷 Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>
          </div>
        </div>

        {/* Edit form */}
        <form onSubmit={handleSave} className="card p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
            <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" placeholder="01XXXXXXXXX" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Village</label>
              <input type="text" value={form.village} onChange={e => setForm({...form, village: e.target.value})} className="input" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">District</label>
              <input type="text" value={form.district} onChange={e => setForm({...form, district: e.target.value})} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3} className="input resize-none" placeholder="Tell your village about yourself..." />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : '✅ Save Changes'}
          </button>
        </form>
      </div>
    </MainLayout>
  );
}
