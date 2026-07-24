'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import apiClient from '@/lib/axios';
import { Book } from '@/types';
import { ArrowLeft, BookOpen, FileText, CheckCircle2, Loader2, Download } from 'lucide-react';

export default function BookDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchBook = async () => {
      try {
        const response = await apiClient.get(`/books/${id}`);
        setBook(response.data.data);
      } catch {
        setBook(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
        {/* Back Link */}
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Book Catalog</span>
        </Link>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : !book ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-3">
            <h3 className="text-lg font-bold text-slate-900">Book Not Found</h3>
            <p className="text-xs text-slate-500">
              The requested publication could not be retrieved from the catalog.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Cover Artwork */}
            <div className="space-y-4">
              <div className="relative h-80 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-md">
                {book.coverImage ? (
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <BookOpen className="h-16 w-16" />
                  </div>
                )}
              </div>

              {book.pdfUrl && (
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Complete PDF</span>
                </a>
              )}
            </div>

            {/* Right Details */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                  {book.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {book.title}
                </h1>
                {book.subtitle && (
                  <p className="mt-1 text-sm font-medium text-slate-600">{book.subtitle}</p>
                )}
              </div>

              <div className="flex items-center gap-6 py-4 border-y border-slate-100">
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">Author</p>
                  <p className="text-sm font-bold text-slate-900">{book.author}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">Publisher</p>
                  <p className="text-sm font-bold text-slate-900">{book.publisher}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase text-slate-400">Price</p>
                  <p className="text-base font-extrabold text-blue-600">${book.price}</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Overview & Summary
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {book.description}
                </p>
              </div>

              {book.isbn && (
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <span>Standard Book Number (ISBN)</span>
                  <span className="font-mono font-bold text-slate-900">{book.isbn}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
