'use client';
import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Spinner, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

const CATEGORY_EMOJI = { mosque: '🕌', school: '🏫', event: '🎉', meeting: '🤝', health: '💊', general: '📋' };

export default function NoticesPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices').then(r => setNotices(r.data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="page-container max-w-3xl mx-auto">
        <h1 className="section-title mb-1">📋 Village Notice Board</h1>
        <p className="text-gray-500 text-sm mb-8">Official announcements and community news</p>

        {loading ? <div className="flex justify-center py-12"><Spinner size={32} /></div>
          : notices.length === 0 ? <EmptyState icon="📋" title="No notices yet" />
          : (
          <div className="space-y-4">
            {notices.map(n => (
              <div key={n._id} className={`card p-5 ${n.isPinned ? 'border-l-4 border-l-green-500' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{CATEGORY_EMOJI[n.category] || '📋'}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <h3 className="font-bold text-gray-900">{n.title}</h3>
                      {n.isPinned && <span className="badge bg-green-100 text-green-700">📌 Pinned</span>}
                      <span className="badge bg-gray-100 text-gray-600 capitalize ml-auto">{n.category}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mt-1">{n.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      By {n.publishedBy?.name} · {formatDate(n.createdAt)}
                      {n.expiresAt && ` · Expires ${formatDate(n.expiresAt)}`}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
