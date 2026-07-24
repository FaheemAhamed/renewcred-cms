'use client';

import React, { useState } from 'react';
import { ContentBlock } from '@/types';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Heading,
  AlignLeft,
  Calculator,
  Table as TableIcon,
  List,
  ListTree,
  Code,
} from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex';

interface BlockEditorProps {
  blocks: ContentBlock[];
  setBlocks: (blocks: ContentBlock[]) => void;
}

export default function BlockEditor({ blocks, setBlocks }: BlockEditorProps) {
  const [selectedType, setSelectedType] = useState<ContentBlock['type']>('header');

  const handleAddBlock = () => {
    const defaultMap: Record<ContentBlock['type'], Record<string, any>> = {
      header: { text: 'New Section Header', level: 1, subtitle: '' },
      paragraph: { text: 'Enter structured paragraph text here...' },
      equation: {
        title: 'Sample Formula',
        equation: '\\sigma = \\sqrt{\\frac{1}{N} \\sum_{i=1}^N (x_i - \\mu)^2}',
        displayMode: true,
      },
      table: {
        title: 'Data Matrix',
        headers: ['Column 1', 'Column 2', 'Column 3'],
        rows: [
          ['Value A1', 'Value A2', 'Value A3'],
          ['Value B1', 'Value B2', 'Value B3'],
        ],
      },
      list: {
        title: 'Feature Checklist',
        style: 'bullet',
        items: ['First item', 'Second item', 'Third item'],
      },
      nested_list: {
        title: 'Hierarchy Tree',
        items: [
          { text: 'Parent Layer', children: ['Child Node 1', 'Child Node 2'] },
        ],
      },
      markdown: {
        text: '### Markdown Content\n\nWrite raw markdown content here.',
      },
      image: {
        url: '',
        caption: 'Image caption',
      },
      documentation: {
        section: 'API Reference',
        endpoint: 'GET /api/v1/pages/slug/:slug',
        description: 'Retrieves published page blocks for dynamic frontend parser',
        codeSnippet: 'curl http://localhost:5000/api/v1/pages/slug/home',
      },
    };

    const defaultData = defaultMap[selectedType] || {};

    const newBlock: ContentBlock = {
      blockId: `block_${Date.now()}`,
      type: selectedType,
      data: defaultData,
      order: blocks.length,
    };

    setBlocks([...blocks, newBlock]);
  };

  const handleRemoveBlock = (index: number) => {
    const updated = blocks.filter((_, i) => i !== index);
    setBlocks(updated.map((b, idx) => ({ ...b, order: idx })));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...blocks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setBlocks(updated.map((b, idx) => ({ ...b, order: idx })));
  };

  const handleUpdateBlockData = (index: number, key: string, value: any) => {
    const updated = [...blocks];
    updated[index] = {
      ...updated[index],
      data: {
        ...updated[index].data,
        [key]: value,
      },
    };
    setBlocks(updated);
  };

  return (
    <div className="space-y-6">
      {/* Block Type Selection Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-slate-900 p-4 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2 text-white">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Add Content Block</h4>
            <p className="text-xs text-slate-400">Select block type to append to dynamic layout</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="header">Header Block</option>
            <option value="paragraph">Paragraph Text</option>
            <option value="equation">Mathematical Equation (LaTeX)</option>
            <option value="table">Data Table</option>
            <option value="list">Bullet / Numbered List</option>
            <option value="nested_list">Hierarchical Nested List</option>
            <option value="documentation">API Documentation Block</option>
          </select>

          <button
            type="button"
            onClick={handleAddBlock}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/30"
          >
            <Plus className="h-4 w-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Rendered Block Sequence */}
      {blocks.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-500">
            No content blocks added yet. Click &quot;Add Block&quot; above to compose your dynamic page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map((block, idx) => (
            <div
              key={block.blockId || idx}
              className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-4 relative group"
            >
              {/* Block Controls Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
                    {idx + 1}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700 uppercase">
                    {block.type === 'header' && <Heading className="h-3.5 w-3.5" />}
                    {block.type === 'paragraph' && <AlignLeft className="h-3.5 w-3.5" />}
                    {block.type === 'equation' && <Calculator className="h-3.5 w-3.5" />}
                    {block.type === 'table' && <TableIcon className="h-3.5 w-3.5" />}
                    {block.type === 'list' && <List className="h-3.5 w-3.5" />}
                    {block.type === 'nested_list' && <ListTree className="h-3.5 w-3.5" />}
                    {block.type === 'documentation' && <Code className="h-3.5 w-3.5" />}
                    {block.type}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveBlock(idx, 'up')}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === blocks.length - 1}
                    onClick={() => handleMoveBlock(idx, 'down')}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(idx)}
                    className="rounded p-1 text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Header Block Fields */}
              {block.type === 'header' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Header Text
                    </label>
                    <input
                      type="text"
                      value={block.data.text || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'text', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Subtitle / Caption
                    </label>
                    <input
                      type="text"
                      value={block.data.subtitle || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'subtitle', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Paragraph Block Fields */}
              {block.type === 'paragraph' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase">
                    Paragraph Content
                  </label>
                  <textarea
                    rows={3}
                    value={block.data.text || ''}
                    onChange={(e) => handleUpdateBlockData(idx, 'text', e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Equation Block Fields & KaTeX Preview */}
              {block.type === 'equation' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase">
                        Formula Title
                      </label>
                      <input
                        type="text"
                        value={block.data.title || ''}
                        onChange={(e) => handleUpdateBlockData(idx, 'title', e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 uppercase">
                        Display Mode
                      </label>
                      <select
                        value={block.data.displayMode ? 'true' : 'false'}
                        onChange={(e) =>
                          handleUpdateBlockData(idx, 'displayMode', e.target.value === 'true')
                        }
                        className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none bg-white"
                      >
                        <option value="true">Block / Centered Formula</option>
                        <option value="false">Inline Formula</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Raw LaTeX Code
                    </label>
                    <input
                      type="text"
                      value={block.data.equation || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'equation', e.target.value)}
                      placeholder="\sigma = \sqrt{\frac{1}{N} \sum_{i=1}^N (x_i - \mu)^2}"
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-900 focus:border-blue-600 focus:outline-none bg-slate-50"
                    />
                  </div>

                  {/* KaTeX Live Preview */}
                  {block.data.equation && (
                    <div className="rounded-xl bg-slate-900 p-4 text-white overflow-x-auto">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        KaTeX Live Render Preview:
                      </p>
                      {block.data.displayMode ? (
                        <BlockMath math={block.data.equation} />
                      ) : (
                        <InlineMath math={block.data.equation} />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Table Block Fields */}
              {block.type === 'table' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Table Title
                    </label>
                    <input
                      type="text"
                      value={block.data.title || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'title', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Headers (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={(block.data.headers || []).join(', ')}
                      onChange={(e) =>
                        handleUpdateBlockData(
                          idx,
                          'headers',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* List Block Fields */}
              {block.type === 'list' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      List Title
                    </label>
                    <input
                      type="text"
                      value={block.data.title || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'title', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Items (Comma Separated)
                    </label>
                    <input
                      type="text"
                      value={(block.data.items || []).join(', ')}
                      onChange={(e) =>
                        handleUpdateBlockData(
                          idx,
                          'items',
                          e.target.value.split(',').map((s) => s.trim())
                        )
                      }
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    />
                  </div>
                </div>
              )}

              {/* Documentation Block Fields */}
              {block.type === 'documentation' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={block.data.section || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'section', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      API Endpoint
                    </label>
                    <input
                      type="text"
                      value={block.data.endpoint || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'endpoint', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-900 bg-slate-50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase">
                      Description & Code Snippet
                    </label>
                    <input
                      type="text"
                      value={block.data.description || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'description', e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-900 mb-2"
                    />
                    <textarea
                      rows={2}
                      value={block.data.codeSnippet || ''}
                      onChange={(e) => handleUpdateBlockData(idx, 'codeSnippet', e.target.value)}
                      placeholder="curl http://localhost:5000/api/v1/pages/slug/home"
                      className="w-full rounded-xl border border-slate-200 p-2 text-xs font-mono text-slate-900 bg-slate-900 text-emerald-400"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
