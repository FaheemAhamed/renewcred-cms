import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import { Book, Pagination } from '@/types';

interface BookState {
  books: Book[];
  currentBook: Book | null;
  pagination: Pagination | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: BookState = {
  books: [],
  currentBook: null,
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      category?: string;
      status?: string;
      sort?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/books', { params });
      return {
        books: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch books');
    }
  }
);

export const fetchBookById = createAsyncThunk(
  'books/fetchBookById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/books/${id}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch book details');
    }
  }
);

export const createBook = createAsyncThunk(
  'books/createBook',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/books', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create book');
    }
  }
);

export const updateBook = createAsyncThunk(
  'books/updateBook',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/books/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update book');
    }
  }
);

export const deleteBook = createAsyncThunk(
  'books/deleteBook',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/books/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete book');
    }
  }
);

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
    clearBookError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload.books;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Book By Id
      .addCase(fetchBookById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Book
      .addCase(createBook.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.books.unshift(action.payload);
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Update Book
      .addCase(updateBook.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentBook = action.payload;
        const index = state.books.findIndex((b) => b._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Delete Book
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b._id !== action.payload);
      });
  },
});

export const { clearCurrentBook, clearBookError } = bookSlice.actions;
export default bookSlice.reducer;
