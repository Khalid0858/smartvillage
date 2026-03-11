'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setSent(true);
      toast.success('Reset email sent!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">{sent ? '📧' : '🔑'}</div>
        {sent ? (
          <>
            <h1 className="text-xl font-bold mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm mb-4">We sent a password reset link to <strong>{email}</strong></p>
            <Link href="/login" className="btn-primary inline-block">Back to Login</Link>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold mb-1">Forgot Password?</h1>
            <p className="text-gray-500 text-sm mb-6">Enter your email to receive a reset link</p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="Email address" required className="input" />
              <button type="submit" className="btn-primary w-full">Send Reset Email</button>
            </form>
            <Link href="/login" className="text-sm text-gray-500 hover:underline mt-4 block">← Back to login</Link>
          </>
        )}
      </div>
    </div>
  );
}
