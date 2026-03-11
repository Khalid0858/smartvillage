'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { Avatar, Spinner } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState(0);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setProduct(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <MainLayout><div className="flex justify-center py-20"><Spinner size={32} /></div></MainLayout>;
  if (!product) return <MainLayout><div className="page-container text-center py-20">Product not found</div></MainLayout>;

  return (
    <MainLayout>
      <div className="page-container max-w-4xl mx-auto">
        <Link href="/marketplace" className="text-sm text-gray-500 hover:text-green-600 mb-4 block">← Marketplace</Link>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-3">
              {product.images?.[img]
                ? <img src={product.images[img]} alt={product.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-7xl">🛒</div>
              }
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((src, i) => (
                  <button key={i} onClick={() => setImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${img === i ? 'border-green-500' : 'border-transparent'}`}>
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="badge bg-green-100 text-green-700 mb-2 capitalize">{product.category.replace('_',' ')}</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{product.title}</h1>
            <p className="text-3xl font-black text-green-600 mb-1">৳{product.price} <span className="text-base font-normal text-gray-400">/{product.unit}</span></p>
            <p className="text-sm text-gray-500 mb-4">Quantity: {product.quantity}</p>
            <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

            <div className="space-y-3 text-sm">
              {product.location && <p className="flex items-center gap-2 text-gray-600">📍 {product.location}</p>}
              <p className="flex items-center gap-2 text-gray-600">📅 Listed {formatDate(product.createdAt)}</p>
              <p className="flex items-center gap-2 text-gray-600">👁️ {product.views} views</p>
            </div>

            {/* Seller */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">Seller</p>
              <div className="flex items-center gap-3">
                <Avatar user={product.seller} />
                <div>
                  <p className="font-semibold text-gray-900">{product.seller?.name}</p>
                  {product.contactPhone && <p className="text-sm text-green-600 font-semibold">📞 {product.contactPhone}</p>}
                </div>
              </div>
              {product.contactPhone && (
                <a href={`tel:${product.contactPhone}`} className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
                  📞 Call Seller
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
