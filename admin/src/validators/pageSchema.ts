import { z } from 'zod';

export const blockSchema = z.object({
  blockId: z.string().optional(),
  type: z.enum([
    'header',
    'paragraph',
    'list',
    'nested_list',
    'table',
    'equation',
    'markdown',
    'image',
    'documentation',
  ]),
  data: z.record(z.any()),
  order: z.number().default(0),
});

export const pageFormSchema = z.object({
  title: z.string().min(1, 'Page title is required').max(200, 'Title is too long'),
  slug: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']).default('published'),
  blocks: z.array(blockSchema).default([]),
});

export type PageFormValues = z.infer<typeof pageFormSchema>;
