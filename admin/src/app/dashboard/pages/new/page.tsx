'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pageFormSchema, PageFormValues } from '@/validators/pageSchema';
import { useAppDispatch, useAppSelector } from '@/hooks/storeHooks';
import { createPage } from '@/store/slices/pageSlice';
import BlockEditor from '@/components/cms/BlockEditor';
import { ContentBlock } from '@/types';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CreatePageCMS() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isSubmitting } = useAppSelector((state) => state.pages);

  const [blocks, setBlocks] = useState<ContentBlock[]>([
    {
      blockId: `block_${Date.now()}`,
      type: 'header',
      data: {
        text: 'New Platform Page Header',
        level: 1,
        subtitle: 'Dynamic block-based CMS content',
      },
      order: 0,
    },
    {
      blockId: `block_${Date.now() + 1}`,
      type: 'paragraph',
      data: {
        text: 'This page is stored in MongoDB as structured JSON blocks and parsed dynamically by the public frontend.',
      },
      order: 1,
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      status: 'published',
    },
  });

  const onSubmit = async (values: PageFormValues) => {
    const payload = {
      ...values,
      blocks,
    };

    const result = await dispatch(createPage(payload));
    if (createPage.fulfilled.match(result)) {
      toast.success('CMS Page created successfully!');
      router.push('/dashboard/pages');
    } else {
      toast.error('Failed to create page');
    }
  };

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
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create CMS Page</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Compose rich layout blocks, LaTeX equations, and tables.
          </p>
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
              placeholder="e.g. Risk Assessment Protocols"
              className="mt-1.5 w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              URL Slug (Optional)
            </label>
            <input
              {...register('slug')}
              type="text"
              placeholder="e.g. risk-protocols"
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
                <span>Saving Page...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Publish CMS Page</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
