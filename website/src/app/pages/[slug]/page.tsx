'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlockRenderer from '@/components/cms/BlockRenderer';
import apiClient from '@/lib/axios';
import { PageItem } from '@/types';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DynamicCMSPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();

  const [page, setPage] = useState<PageItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchPage = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get(`/pages/slug/${slug}`);
        setPage(response.data.data);
        setError(false);
      } catch {
        setError(true);
        setPage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-mono text-blue-600">/{slug}</span>
        </div>

        {/* Dynamic Block Renderer */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : error || !page ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-900">Page Not Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              The requested page slug <code className="font-mono text-blue-600">/{slug}</code> is either draft status or does not exist.
            </p>
            <Link
              href="/"
              className="inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 mt-2"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <BlockRenderer blocks={page.blocks} />
        )}
      </main>

      <Footer />
    </div>
  );
}
