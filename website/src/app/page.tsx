'use client';

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BlockRenderer from '@/components/cms/BlockRenderer';
import apiClient from '@/lib/axios';
import { PageItem } from '@/types';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [page, setPage] = useState<PageItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomePage = async () => {
      try {
        const response = await apiClient.get('/pages/slug/home');
        setPage(response.data.data);
      } catch {
        setPage(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomePage();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Banner Quick Links */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white shadow-xl">
          <div>
            <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20 mb-1">
              Dynamic Headless CMS
            </span>
            <h2 className="text-xl font-bold">RenewCred Dynamic Platform Overview</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-colors"
            >
              <span>Explore Book Catalog</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Content Renderer */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : page ? (
          <BlockRenderer blocks={page.blocks} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-800">Welcome to RenewCred Platform</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No custom home page blocks seeded yet. Run <code className="font-mono text-blue-600 bg-slate-100 px-1.5 py-0.5 rounded">npm run seed:content</code> in the backend directory to seed demo blocks.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
