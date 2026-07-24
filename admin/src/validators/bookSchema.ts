import { z } from 'zod';

export const bookFormSchema = z.object({
  title: z.string().min(1, 'Book title is required').max(200, 'Title is too long'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  author: z.string().min(1, 'Author name is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  isbn: z.string().optional(),
  language: z.string().default('English'),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().min(0, 'Price must be 0 or greater'),
  discountPrice: z.coerce.number().min(0, 'Discount price must be 0 or greater').optional(),
  status: z.enum(['draft', 'published']).default('published'),
  isFeatured: z.boolean().default(false),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
