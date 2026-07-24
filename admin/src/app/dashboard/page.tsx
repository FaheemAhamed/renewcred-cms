'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  ExternalLink,
} from 'lucide-react';
import apiClient from '@/lib/axios';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalPages: 0,
    publishedPages: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, pagesRes] = await Promise.all([
          apiClient.get('/books?limit=1'),
          apiClient.get('/pages?limit=1'),
        ]);

        setStats({
          totalBooks: booksRes.data.pagination?.total || 0,
          totalPages: pagesRes.data.pagination?.total || 0,
          publishedPages: pagesRes.data.pagination?.total || 0,
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Books in Catalog',
      value: stats.loading ? '...' : stats.totalBooks,
      change: '+12% this month',
      icon: BookOpen,
      color: 'bg-blue-500/10 text-blue-600',
      border: 'border-blue-100',
    },
    {
      title: 'Dynamic CMS Pages',
      value: stats.loading ? '...' : stats.totalPages,
      change: '100% Published',
      icon: FileText,
      color: 'bg-purple-500/10 text-purple-600',
      border: 'border-purple-100',
    },
    {
      title: 'Media Assets (Cloudinary)',
      value: '24 Assets',
      change: 'Images & PDFs',
      icon: ImageIcon,
      color: 'bg-emerald-500/10 text-emerald-600',
      border: 'border-emerald-100',
    },
    {
      title: 'System & API Health',
      value: '99.9%',
      change: 'Express v5 & MongoDB',
      icon: CheckCircle2,
      color: 'bg-amber-500/10 text-amber-600',
      border: 'border-amber-100',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20 mb-3">
            Production Management Console
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            RenewCred Headless CMS & Content Engine
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Manage dynamic rich-text pages, LaTeX actuarial models, multi-column credit tables, and catalog books seamlessly across all consumer platforms.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link
              href="/dashboard/pages/new"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Create New CMS Page</span>
            </Link>
            <Link
              href="/dashboard/books/new"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Add Book Entry</span>
            </Link>
            <a
              href="http://localhost:3001"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors ml-auto"
            >
              <span>View Live Website</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`rounded-2xl bg-white p-6 border ${card.border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-3 ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="flex items-center text-[11px] font-medium text-slate-500">
                  <TrendingUp className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                  {card.change}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">System Quick Management</h3>
              <p className="text-xs text-slate-500">Fast access to key content modules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/dashboard/pages"
              className="group rounded-xl border border-slate-200 p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <FileText className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mt-3">Dynamic CMS Pages</h4>
              <p className="text-xs text-slate-500 mt-1">
                Edit LaTeX formulas, tables, and nested lists.
              </p>
            </Link>

            <Link
              href="/dashboard/books"
              className="group rounded-xl border border-slate-200 p-4 hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <BookOpen className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm mt-3">Book Catalog CRUD</h4>
              <p className="text-xs text-slate-500 mt-1">
                Manage titles, prices, covers, and PDF files.
              </p>
            </Link>
          </div>
        </div>

        {/* System Activity */}
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-lg border-b border-slate-100 pb-4">
            Recent System Activity
          </h3>
          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-emerald-50 p-1.5 text-emerald-600 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Content Seeder Executed</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> Seeded /home, /math-specifications
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-50 p-1.5 text-blue-600 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Admin Account Verified</p>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock className="h-3 w-3" /> JWT Bearer session active
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
