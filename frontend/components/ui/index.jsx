'use client';
import { STATUS_COLORS, STATUS_LABELS } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function Avatar({ user, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-sm', md: 'w-10 h-10 text-base', lg: 'w-14 h-14 text-xl' };
  return (
    <div className={`${sizes[size]} rounded-full bg-green-100 flex items-center justify-center overflow-hidden shrink-0`}>
      {user?.avatar
        ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
        : <span className="text-green-700 font-bold">{user?.name?.[0] || '?'}</span>
      }
    </div>
  );
}

export function Spinner({ size = 20 }) {
  return <Loader2 size={size} className="animate-spin text-green-600" />;
}

export function EmptyState({ icon = '📭', title, desc, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {desc && <p className="text-sm text-gray-500 mb-4">{desc}</p>}
      {action}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function ImageUploadPreview({ files, onChange, folder }) {
  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={onChange}
        className="input text-sm" />
      {files.length > 0 && (
        <div className="flex gap-2 mt-2 flex-wrap">
          {files.map((f, i) => (
            <img key={i} src={URL.createObjectURL(f)} alt=""
              className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
          ))}
        </div>
      )}
    </div>
  );
}

export function StarRating({ rating, onRate, readonly = false }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} onClick={() => !readonly && onRate?.(s)}
          className={`text-xl transition-transform ${!readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}
            ${s <= Math.round(rating) ? 'text-amber-400' : 'text-gray-300'}`}>
          ★
        </button>
      ))}
    </div>
  );
}

export function ProgressBar({ current, goal }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>৳{current?.toLocaleString()} raised</span>
        <span>{pct}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">Goal: ৳{goal?.toLocaleString()}</p>
    </div>
  );
}
