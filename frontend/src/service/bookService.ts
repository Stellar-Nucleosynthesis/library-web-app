import axios from './axios';
import type {Book, BookFilters, BookFormData} from '../models/book';
import type {ApiResponse} from '../models/api';

export const booksApi = {
    getBooks: async (filters: BookFilters = {}): Promise<ApiResponse<Book[]>> => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([k, v]) => {
            if (v !== undefined && v !== '')
                params.set(k, v);
        });
        const res = await axios.get(`/api/books?${params.toString()}`);
        return res.data;
    },

    getBook: async (id: string): Promise<ApiResponse<Book>> => {
        const res = await axios.get(`/api/books/${id}`);
        return res.data;
    },

    createBook: async (data: Partial<BookFormData>): Promise<ApiResponse<Book>> => {
        const res = await axios.post('/api/books', data);
        return res.data;
    },

    updateBook: async (id: string, data: Partial<BookFormData>): Promise<ApiResponse<Book>> => {
        const res = await axios.put(`/api/books/${id}`, data);
        return res.data;
    },

    deleteBook: async (id: string): Promise<{ success: boolean; message?: string }> => {
        const res = await axios.delete(`/api/books/${id}`);
        return res.data;
    },

    toggleStatus: async (id: string): Promise<ApiResponse<Book>> => {
        const res = await axios.patch(`/api/books/${id}/toggle-status`);
        return res.data;
    },

    getCategories: async (): Promise<{ success: boolean; data?: string[] }> => {
        const res = await axios.get('/api/books/categories');
        return res.data;
    },

    downloadBook: async (id: string, title: string): Promise<void> => {
        const res = await axios.get(`/api/books/${id}/download`, {responseType: 'blob'});
        const url = globalThis.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${title}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        globalThis.URL.revokeObjectURL(url);
    },
};
