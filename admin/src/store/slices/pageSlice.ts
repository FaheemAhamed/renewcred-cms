import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '@/lib/axios';
import { PageItem, Pagination } from '@/types';

interface PageState {
  pages: PageItem[];
  currentPage: PageItem | null;
  pagination: Pagination | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: PageState = {
  pages: [],
  currentPage: null,
  pagination: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

export const fetchPages = createAsyncThunk(
  'pages/fetchPages',
  async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sort?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.get('/pages', { params });
      return {
        pages: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch CMS pages');
    }
  }
);

export const fetchPageById = createAsyncThunk(
  'pages/fetchPageById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/pages/${id}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch page details');
    }
  }
);

export const createPage = createAsyncThunk(
  'pages/createPage',
  async (pageData: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/pages', pageData);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create CMS page');
    }
  }
);

export const updatePage = createAsyncThunk(
  'pages/updatePage',
  async ({ id, pageData }: { id: string; pageData: any }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/pages/${id}`, pageData);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update CMS page');
    }
  }
);

export const deletePage = createAsyncThunk(
  'pages/deletePage',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/pages/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete CMS page');
    }
  }
);

const pageSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
    clearPageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Pages
      .addCase(fetchPages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pages = action.payload.pages;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Page By Id
      .addCase(fetchPageById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPageById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPage = action.payload;
      })
      .addCase(fetchPageById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Page
      .addCase(createPage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createPage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.pages.unshift(action.payload);
      })
      .addCase(createPage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Update Page
      .addCase(updatePage.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updatePage.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentPage = action.payload;
        const index = state.pages.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.pages[index] = action.payload;
        }
      })
      .addCase(updatePage.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Delete Page
      .addCase(deletePage.fulfilled, (state, action) => {
        state.pages = state.pages.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrentPage, clearPageError } = pageSlice.actions;
export default pageSlice.reducer;
