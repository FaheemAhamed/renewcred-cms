export interface Book {
  _id: string;
  title: string;
  subtitle?: string;
  description: string;
  author: string;
  publisher: string;
  isbn?: string;
  language: string;
  category: string;
  coverImage?: string;
  coverImagePublicId?: string;
  pdfUrl?: string;
  pdfPublicId?: string;
  price: number;
  discountPrice?: number;
  status: 'draft' | 'published';
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentBlock {
  blockId?: string;
  type:
    | 'header'
    | 'paragraph'
    | 'list'
    | 'nested_list'
    | 'table'
    | 'equation'
    | 'markdown'
    | 'image'
    | 'documentation';
  data: Record<string, any>;
  order: number;
}

export interface PageItem {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  status: 'draft' | 'published';
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
}
