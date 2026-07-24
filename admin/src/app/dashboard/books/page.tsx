'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  FileText,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { fetchBooks, deleteBook } from '@/store/slices/bookSlice';
import { toast } from 'sonner';

export default function BooksListPage() {
  const dispatch = useAppDispatch();
  const { books, pagination, isLoading } = useAppSelector((state) => state.books);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(
      fetchBooks({
        page,
        limit: 8,
        search,
        category,
        status,
      })
    );
  }, [dispatch, page, search, category, status]);

  const handleDelete = async (id: string) => {
    const result = await dispatch(deleteBook(id));
    if (deleteBook.fulfilled.match(result)) {
      toast.success('Book deleted successfully');
      setDeleteId(null);
      dispatch(fetchBooks({ page, limit: 8, search, category, status }));
    } else {
      toast.error('Failed to delete book');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Book Catalog</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage titles, dynamic pricing, cover artwork, and PDF documents.
          </p>
        </div>
        <Link
          href="/dashboard/books/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Book</span>
        </Link>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="">All Categories</option>
              <option value="Finance">Finance</option>
              <option value="Economics">Economics</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 bg-white focus:border-blue-600 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <BookOpen className="h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No books found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Try refining your search terms or add a new book to the catalog.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Book
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Author & Publisher
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </th>
                  <th className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-xs">
                {books.map((book) => (
                  <tr key={book._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-slate-100 border border-slate-200">
                          {book.coverImage ? (
                            <Image
                              src={book.coverImage}
                              alt={book.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                              <BookOpen className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{book.title}</p>
                          {book.isbn && (
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              ISBN: {book.isbn}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{book.author}</p>
                      <p className="text-[11px] text-slate-400">{book.publisher}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-900">₹{book.price?.toLocaleString('en-IN')}</span>
                      {book.discountPrice && book.discountPrice > 0 ? (
                        <span className="ml-1 text-[10px] text-slate-400 line-through">
                          ₹{book.discountPrice?.toLocaleString('en-IN')}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                          book.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {book.pdfUrl && (
                          <a
                            href={book.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="View PDF Document"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/dashboard/books/${book._id}/edit`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          title="Edit Book"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteId(book._id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing page <span className="font-bold">{pagination.page}</span> of{' '}
              <span className="font-bold">{pagination.totalPages}</span> ({pagination.total} total)
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Are you sure you want to delete this book? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700"
              >
                Delete Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
