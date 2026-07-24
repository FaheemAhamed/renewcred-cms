'use client';

import React from 'react';
import Image from 'next/image';
import { InlineMath, BlockMath } from 'react-katex';
import { Calculator, CheckCircle2, Code, FileText, Table as TableIcon } from 'lucide-react';
import { ContentBlock } from '@/types';

interface BlockRendererProps {
  blocks: ContentBlock[];
}

export default function BlockRenderer({ blocks = [] }: BlockRendererProps) {
  const sortedBlocks = [...blocks].sort((a, b) => (a.order || 0) - (b.order || 0));

  if (sortedBlocks.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-xs text-slate-500">
        No content blocks found for this page.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedBlocks.map((block, idx) => {
        const key = block.blockId || `block_${idx}`;

        switch (block.type) {
          case 'header': {
            const { text, level = 1, subtitle } = block.data || {};
            const Tag = (level === 2 ? 'h2' : level === 3 ? 'h3' : 'h1') as keyof JSX.IntrinsicElements;
            return (
              <div key={key} className="space-y-2 border-b border-slate-100 pb-4">
                <Tag className={`font-extrabold tracking-tight text-slate-900 ${
                  level === 1 ? 'text-3xl sm:text-4xl' : level === 2 ? 'text-2xl sm:text-3xl' : 'text-xl'
                }`}>
                  {text}
                </Tag>
                {subtitle && <p className="text-sm font-medium text-blue-600">{subtitle}</p>}
              </div>
            );
          }

          case 'paragraph': {
            const { text } = block.data || {};
            return (
              <p key={key} className="text-base text-slate-700 leading-relaxed">
                {text}
              </p>
            );
          }

          case 'equation': {
            const { title, equation, displayMode = true, caption } = block.data || {};
            return (
              <div
                key={key}
                className="rounded-2xl border border-blue-100 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 text-white shadow-lg space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-400" />
                    <span className="font-bold text-sm text-slate-200">
                      {title || 'Mathematical Model'}
                    </span>
                  </div>
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-300 uppercase tracking-wider border border-blue-400/20">
                    LaTeX KaTeX
                  </span>
                </div>

                <div className="my-4 overflow-x-auto py-2 text-center text-lg sm:text-xl">
                  {displayMode ? (
                    <BlockMath math={equation || ''} />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-mono text-slate-400">[Formula]:</span>
                      <InlineMath math={equation || ''} />
                    </div>
                  )}
                </div>

                {caption && (
                  <p className="text-xs text-slate-400 italic text-center border-t border-slate-800/80 pt-2">
                    {caption}
                  </p>
                )}
              </div>
            );
          }

          case 'table': {
            const { title, headers = [], rows = [] } = block.data || {};
            return (
              <div key={key} className="space-y-3">
                {title && (
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-blue-600" />
                    <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
                  </div>
                )}
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        {headers.map((h: string, i: number) => (
                          <th
                            key={i}
                            className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-600"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white text-xs text-slate-700">
                      {rows.map((row: string[], rIdx: number) => (
                        <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                          {row.map((cell: string, cIdx: number) => (
                            <td key={cIdx} className="whitespace-nowrap px-6 py-4 font-medium">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          }

          case 'list': {
            const { title, style = 'bullet', items = [] } = block.data || {};
            const ListTag = style === 'number' ? 'ol' : 'ul';
            return (
              <div key={key} className="space-y-3 rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
                {title && <h4 className="font-bold text-slate-900 text-sm">{title}</h4>}
                <ListTag
                  className={`space-y-2 text-sm text-slate-700 ${
                    style === 'number' ? 'list-decimal pl-5' : 'list-disc pl-5'
                  }`}
                >
                  {items.map((item: string, i: number) => (
                    <li key={i} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ListTag>
              </div>
            );
          }

          case 'nested_list': {
            const { title, items = [] } = block.data || {};
            return (
              <div key={key} className="space-y-4 rounded-2xl bg-slate-50 p-6 border border-slate-200">
                {title && <h4 className="font-bold text-slate-900 text-sm">{title}</h4>}
                <ul className="space-y-4">
                  {items.map((parentItem: any, pIdx: number) => (
                    <li key={pIdx} className="space-y-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{parentItem.text || parentItem}</span>
                      </div>
                      {parentItem.children && Array.isArray(parentItem.children) && (
                        <ul className="ml-6 space-y-1.5 list-disc text-xs text-slate-600 pl-4">
                          {parentItem.children.map((child: string, cIdx: number) => (
                            <li key={cIdx}>{child}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          }

          case 'documentation': {
            const { section, endpoint, description, codeSnippet } = block.data || {};
            return (
              <div
                key={key}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-xs uppercase tracking-wider text-blue-600">
                    {section || 'Documentation Section'}
                  </span>
                  {endpoint && (
                    <span className="font-mono text-xs font-bold rounded-lg bg-slate-100 px-3 py-1 text-slate-800 border border-slate-200">
                      {endpoint}
                    </span>
                  )}
                </div>

                {description && <p className="text-xs text-slate-600">{description}</p>}

                {codeSnippet && (
                  <div className="relative rounded-xl bg-slate-900 p-4 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2">
                      <span>cURL HTTP Request</span>
                      <Code className="h-3.5 w-3.5" />
                    </div>
                    <code>{codeSnippet}</code>
                  </div>
                )}
              </div>
            );
          }

          case 'markdown': {
            const { text } = block.data || {};
            return (
              <div key={key} className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {text}
              </div>
            );
          }

          case 'image': {
            const { url, caption } = block.data || {};
            if (!url) return null;
            return (
              <div key={key} className="space-y-2 text-center">
                <div className="relative h-72 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                  <Image src={url} alt={caption || 'Content Image'} fill className="object-cover" />
                </div>
                {caption && <p className="text-xs text-slate-500 italic">{caption}</p>}
              </div>
            );
          }

          default:
            return (
              <div key={key} className="p-3 bg-amber-50 text-amber-800 text-xs rounded-xl border border-amber-200">
                Unknown content block format: {block.type}
              </div>
            );
        }
      })}
    </div>
  );
}
