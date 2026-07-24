'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import apiClient from '@/lib/axios';
import { Book, Pagination } from '@/types';
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowRight,
} from 'lucide-react';

export default function PublicBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/books', {
          params: {
            page,
            limit: 8,
            search,
            category,
            status: 'published',
          },
        });
        setBooks(response.data.data);
        setPagination(response.data.pagination);
      } catch {
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCatalog();
  }, [page, search, category]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Academic & Financial Book Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Explore peer-reviewed publications, credit engineering manuals, and downloadable research PDFs.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:border-blue-600 focus:outline-none w-full sm:w-auto"
            >
              <option value="">All Categories</option>
              <option value="Finance">Finance</option>
              <option value="Economics">Economics</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
        </div>

        {/* Books Grid */}
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white border border-slate-200">
            <BookOpen className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No books found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search query or selected category filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book._id}
                className="group flex flex-col rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-56 w-full bg-slate-100 border-b border-slate-100 overflow-hidden">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-300">
                      <BookOpen className="h-12 w-12" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                    {book.category}
                  </span>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-5 justify-between space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">By {book.author}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-slate-900">${book.price}</span>
                      {book.discountPrice ? (
                        <span className="ml-1 text-[11px] text-slate-400 line-through">
                          ${book.discountPrice}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {book.pdfUrl && (
                        <a
                          href={book.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                          title="Download PDF Document"
                        >
                          <FileText className="h-4 w-4" />
                        </a>
                      )}
                      <Link
                        href={`/books/${book._id}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                      >
                        <span>Details</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-500">
              Page <span className="font-bold">{pagination.page}</span> of{' '}
              <span className="font-bold">{pagination.totalPages}</span> ({pagination.total} Total)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
