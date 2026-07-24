'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageFormSchema, PageFormValues } from '@/validators/pageSchema';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { fetchPageById, updatePage } from '@/store/slices/pageSlice';
import BlockEditor from '@/components/cms/BlockEditor';
import { ContentBlock } from '@/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EditPageCMS() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const dispatch = useAppDispatch();
  const { currentPage, isLoading, isSubmitting } = useAppSelector((state) => state.pages);

  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPageById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentPage) {
      reset({
        title: currentPage.title,
        slug: currentPage.slug,
        description: currentPage.description || '',
        status: currentPage.status,
      });
      setBlocks(currentPage.blocks || []);
    }
  }, [currentPage, reset]);

  const onSubmit = async (values: PageFormValues) => {
    const payload = {
      ...values,
      blocks,
    };

    const result = await dispatch(updatePage({ id, pageData: payload }));
    if (updatePage.fulfilled.match(result)) {
      toast.success('CMS Page updated successfully!');
      router.push('/dashboard/pages');
    } else {
      toast.error('Failed to update page');
    }
  };

  if (isLoading || !currentPage) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Bar */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/pages"
          className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Edit CMS Page</h2>
          <p className="text-xs text-slate-500 mt-0.5">Editing &quot;{currentPage.title}&quot;</p>
        </div>
      </div>

      {/* Main Page Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Page Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              URL Slug *
            </label>
            <input
              {...register('slug')}
              type="text"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Status *
            </label>
            <select
              {...register('status')}
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Block Builder Component */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-lg">Page Content Blocks</h3>
          <BlockEditor blocks={blocks} setBlocks={setBlocks} />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/dashboard/pages"
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
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save CMS Page</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
