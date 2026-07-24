'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookFormSchema, BookFormValues } from '@/validators/bookSchema';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { createBook } from '@/store/slices/bookSlice';
import { ArrowLeft, Upload, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateBookPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.books);

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      description: '',
      author: '',
      publisher: '',
      isbn: '',
      language: 'English',
      category: 'Finance',
      price: 0,
      discountPrice: 0,
      status: 'published',
      isFeatured: false,
    },
  });

  const onSubmit = async (values: BookFormValues) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      formData.append(key, String(val));
    });

    if (coverImageFile) {
      formData.append('coverImage', coverImageFile);
    }

    if (pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    const result = await dispatch(createBook(formData));
    if (createBook.fulfilled.match(result)) {
      toast.success('Book created successfully!');
      router.push('/dashboard/books');
    } else {
      toast.error('Failed to create book');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/books"
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Add New Book</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in metadata and upload cover image & PDF document.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-2xl bg-white p-8 border border-slate-200 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Book Title *
            </label>
            <input
              {...register('title')}
              type="text"
              placeholder="e.g. Decentralized Credit Mechanics"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
          </div>

          {/* Subtitle */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Subtitle
            </label>
            <input
              {...register('subtitle')}
              type="text"
              placeholder="e.g. Actuarial Risk Models and Liquidity Vaults"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Author Name *
            </label>
            <input
              {...register('author')}
              type="text"
              placeholder="e.g. Dr. Alan Vance"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.author && <p className="mt-1 text-xs text-rose-500">{errors.author.message}</p>}
          </div>

          {/* Publisher */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Publisher *
            </label>
            <input
              {...register('publisher')}
              type="text"
              placeholder="e.g. RenewCred Academic Press"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.publisher && (
              <p className="mt-1 text-xs text-rose-500">{errors.publisher.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Category *
            </label>
            <select
              {...register('category')}
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
            >
              <option value="Finance">Finance</option>
              <option value="Economics">Economics</option>
              <option value="Risk Management">Risk Management</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              ISBN
            </label>
            <input
              {...register('isbn')}
              type="text"
              placeholder="e.g. 978-3-16-148410-0"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Price (₹ INR) *
            </label>
            <input
              {...register('price')}
              type="number"
              step="1"
              placeholder="499"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.price && <p className="mt-1 text-xs text-rose-500">{errors.price.message}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Publication Status *
            </label>
            <select
              {...register('status')}
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Write a detailed summary of the book content..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-500">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* File Upload Section */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cover Image Upload */}
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center bg-slate-50/50">
            <ImageIcon className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <span className="block text-xs font-bold text-slate-700">Cover Artwork (Image)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files?.[0] || null)}
              className="mt-2 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {coverImageFile && (
              <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                Selected: {coverImageFile.name}
              </p>
            )}
          </div>

          {/* PDF Document Upload */}
          <div className="rounded-xl border border-dashed border-slate-300 p-4 text-center bg-slate-50/50">
            <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
            <span className="block text-xs font-bold text-slate-700">PDF Document</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
              className="mt-2 text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
            {pdfFile && (
              <p className="mt-2 text-[11px] font-semibold text-emerald-600">
                Selected: {pdfFile.name}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Link
            href="/dashboard/books"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading & Creating...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Create Book Entry</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
