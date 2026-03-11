'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm]     = useState({ name: '', email: '', password: '', village: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, { phone: form.phone, village: form.village });
      toast.success('Account created! Welcome!');
      router.push('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏡</div>
          <h1 className="text-2xl font-extrabold text-gray-900">Join SmartVillage</h1>
          <p className="text-gray-500 text-sm mt-1">Create your free account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            placeholder="Full name" required className="input" />
          <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            placeholder="Email address" required className="input" />
          <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})}
            placeholder="Password (min 6 chars)" required className="input" />
          <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
            placeholder="Phone number (optional)" className="input" />
          <input type="text" value={form.village} onChange={e => setForm({...form, village: e.target.value})}
            placeholder="Village name (optional)" className="input" />

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Spinner size={16} /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Have an account?{' '}
          <Link href="/login" className="text-green-600 font-semibold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
