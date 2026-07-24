'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Copy,
  Check,
  Search,
  Grid,
  List,
  Trash2,
  Eye,
  ExternalLink,
  RefreshCw,
  Sparkles,
  X,
  FileCode,
} from 'lucide-react';
import apiClient from '@/lib/axios';
import { toast } from 'sonner';

interface MediaAsset {
  id: string;
  url: string;
  name: string;
  type: 'image' | 'pdf' | 'other';
  format?: string;
  bytes?: number;
  source: 'upload' | 'book' | 'page';
  createdAt: string;
}

export default function MediaAssetsPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'image' | 'pdf'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch aggregated media assets from backend APIs (books, pages, & local uploads)
  const fetchAssets = async () => {
    setLoading(true);
    try {
      const [booksRes, pagesRes] = await Promise.allSettled([
        apiClient.get('/books?limit=100'),
        apiClient.get('/pages?limit=100'),
      ]);

      const extractedAssets: MediaAsset[] = [];

      // Extract images & PDFs from books
      if (booksRes.status === 'fulfilled' && booksRes.value.data?.data) {
        booksRes.value.data.data.forEach((book: any) => {
          if (book.coverImage) {
            extractedAssets.push({
              id: `book-cover-${book._id}`,
              url: book.coverImage,
              name: `${book.title} (Cover Image)`,
              type: 'image',
              source: 'book',
              createdAt: book.createdAt || new Date().toISOString(),
            });
          }
          if (book.pdfUrl) {
            extractedAssets.push({
              id: `book-pdf-${book._id}`,
              url: book.pdfUrl,
              name: `${book.title} (PDF Document)`,
              type: 'pdf',
              source: 'book',
              createdAt: book.createdAt || new Date().toISOString(),
            });
          }
        });
      }

      // Extract images from page content blocks
      if (pagesRes.status === 'fulfilled' && pagesRes.value.data?.data) {
        pagesRes.value.data.data.forEach((page: any) => {
          if (Array.isArray(page.content)) {
            page.content.forEach((block: any, idx: number) => {
              if (block.type === 'image' && block.data?.url) {
                extractedAssets.push({
                  id: `page-block-${page._id}-${idx}`,
                  url: block.data.url,
                  name: `${page.title} (Inline Image ${idx + 1})`,
                  type: 'image',
                  source: 'page',
                  createdAt: page.createdAt || new Date().toISOString(),
                });
              }
            });
          }
        });
      }

      // Retrieve any manually uploaded session assets stored in localStorage
      const savedLocalAssets = localStorage.getItem('renewcred_uploaded_media');
      if (savedLocalAssets) {
        try {
          const parsed = JSON.parse(savedLocalAssets);
          if (Array.isArray(parsed)) {
            extractedAssets.unshift(...parsed);
          }
        } catch {
          // Ignore invalid cache
        }
      }

      setAssets(extractedAssets);
    } catch {
      toast.error('Failed to load media asset library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  // Upload file via backend POST /upload endpoint
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 10MB');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success && res.data?.data?.url) {
        const newAsset: MediaAsset = {
          id: `upload-${Date.now()}`,
          url: res.data.data.url,
          name: file.name,
          type: file.type.startsWith('image/')
            ? 'image'
            : file.type.includes('pdf')
            ? 'pdf'
            : 'other',
          format: res.data.data.format || file.name.split('.').pop(),
          bytes: file.size,
          source: 'upload',
          createdAt: new Date().toISOString(),
        };

        const updated = [newAsset, ...assets];
        setAssets(updated);

        // Save uploaded asset to local storage cache
        const savedLocalAssets = localStorage.getItem('renewcred_uploaded_media');
        const existing = savedLocalAssets ? JSON.parse(savedLocalAssets) : [];
        localStorage.setItem(
          'renewcred_uploaded_media',
          JSON.stringify([newAsset, ...existing])
        );

        toast.success('Media asset uploaded successfully!');
      } else {
        toast.error('Upload succeeded but returned unexpected payload');
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to upload media asset';
      toast.error(msg);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('Media asset URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = (id: string) => {
    const updated = assets.filter((a) => a.id !== id);
    setAssets(updated);

    // Update localStorage cache
    const savedLocalAssets = localStorage.getItem('renewcred_uploaded_media');
    if (savedLocalAssets) {
      try {
        const parsed = JSON.parse(savedLocalAssets);
        const filtered = parsed.filter((a: MediaAsset) => a.id !== id);
        localStorage.setItem('renewcred_uploaded_media', JSON.stringify(filtered));
      } catch {
        // ignore error
      }
    }

    toast.success('Asset removed from library view');
  };

  // Filtered Assets list
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || asset.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-xl">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 border border-blue-400/20 mb-2">
            <Sparkles className="h-3.5 w-3.5" /> Cloudinary Media Engine
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Media Asset Library</h2>
          <p className="mt-1 text-sm text-slate-300 max-w-xl">
            Upload, manage, and copy public URLs for images, PDF publications, and media resources across RenewCred CMS.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            <span>{uploading ? 'Uploading...' : 'Upload New Media'}</span>
          </button>
        </div>
      </div>

      {/* Upload Drag & Drop Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/40 transition-all"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
          <Upload className="h-7 w-7" />
        </div>
        <h3 className="mt-3 font-bold text-slate-800 text-base">
          Click or drop files here to upload
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-md">
          Supports PNG, JPG, WEBP, SVG images and PDF documents up to 10MB. Files are streamed directly to Cloudinary.
        </p>
      </div>

      {/* Controls Bar: Search, Category Filter, and View Mode */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search media by filename or URL..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'image', 'pdf'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Assets' : cat === 'image' ? 'Images' : 'PDFs'}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 self-end sm:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`rounded-lg p-1.5 text-slate-600 transition-colors ${
              viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'
            }`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`rounded-lg p-1.5 text-slate-600 transition-colors ${
              viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={fetchAssets}
            className="rounded-lg p-1.5 text-slate-600 hover:text-slate-900 transition-colors ml-1 border-l border-slate-200"
            title="Refresh Assets"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Media Assets Gallery Grid / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="h-8 w-8 text-blue-600 animate-spin mb-3" />
          <p className="text-xs font-semibold text-slate-600">Syncing Media Asset Library...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 text-center px-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <ImageIcon className="h-8 w-8" />
          </div>
          <h4 className="font-bold text-slate-800 text-base">No media assets found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Try adjusting your search query or upload a new image or PDF file.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group relative flex flex-col justify-between rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Media Preview Area */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden flex items-center justify-center">
                {asset.type === 'image' ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                    <FileText className="h-10 w-10 text-rose-500 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      PDF Document
                    </span>
                  </div>
                )}

                {/* Source Badge */}
                <span className="absolute top-2 left-2 rounded-lg bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  {asset.source.toUpperCase()}
                </span>

                {/* Quick Action Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-2 p-3">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="rounded-xl bg-white/90 p-2.5 text-slate-800 hover:bg-white hover:text-blue-600 transition-colors shadow"
                    title="Preview Asset"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => copyToClipboard(asset.url, asset.id)}
                    className="rounded-xl bg-blue-600 p-2.5 text-white hover:bg-blue-500 transition-colors shadow"
                    title="Copy URL"
                  >
                    {copiedId === asset.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="rounded-xl bg-rose-600/90 p-2.5 text-white hover:bg-rose-600 transition-colors shadow"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Asset Info Footer */}
              <div className="p-4">
                <h4 className="font-bold text-slate-800 text-xs truncate" title={asset.name}>
                  {asset.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  {asset.url}
                </p>

                <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                  <button
                    onClick={() => copyToClipboard(asset.url, asset.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Public URL</span>
                      </>
                    )}
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-slate-600"
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 overflow-hidden">
                    {asset.type === 'image' ? (
                      <img src={asset.url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FileText className="h-6 w-6 text-rose-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{asset.name}</p>
                    <p className="text-xs text-slate-400 truncate font-mono mt-0.5">
                      {asset.url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => copyToClipboard(asset.url, asset.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    {copiedId === asset.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-blue-600" />
                    )}
                    <span>{copiedId === asset.id ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal Lightbox */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <FileCode className="h-5 w-5 text-blue-600 shrink-0" />
                <h3 className="font-bold text-slate-800 text-base truncate">
                  {previewAsset.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-xl bg-slate-900 flex items-center justify-center p-4">
              {previewAsset.type === 'image' ? (
                <img src={previewAsset.url} alt="" className="max-h-[50vh] object-contain rounded" />
              ) : (
                <iframe
                  src={previewAsset.url}
                  className="w-full h-[50vh] rounded"
                  title="PDF Preview"
                />
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-500 font-mono truncate max-w-md">
                {previewAsset.url}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(previewAsset.url, previewAsset.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-blue-500"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Public Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
