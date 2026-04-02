import axios from './axios';
import {Book, BookFilters} from '@/models/book.ts';

const gql = async (query: string, variables?: Record<string, unknown>) => {
    const res = await axios.post('/graphql', {query, variables});
    if (res.data.errors) {
        throw new Error(res.data.errors[0]?.message || 'GraphQL error');
    }
    return res.data.data;
};

export const graphqlApi = {
    getBooks: async (filter: BookFilters = {}) => {
        const data = await gql(
            `query GetBooks($filter: BookFilter) {
        books(filter: $filter) {
          books {
            _id title author description category isActive publishedYear coverImage language pageCount isbn
            createdBy { _id firstName lastName }
            createdAt updatedAt
          }
          total page totalPages
        }
      }`,
            {filter}
        );
        return data.books as { books: Book[]; total: number; page: number; totalPages: number };
    },

    getBook: async (id: string) => {
        const data = await gql(
            `query GetBook($id: ID!) {
        book(id: $id) {
          _id title author description category isActive publishedYear coverImage path language pageCount isbn
          createdBy { _id firstName lastName }
          createdAt updatedAt
        }
      }`,
            {id}
        );
        return data.book as Book | null;
    },

    getCategories: async () => {
        const data = await gql(`query { categories }`);
        return data.categories as string[];
    },

    createBook: async (input: Record<string, unknown>) => {
        const {
            title, author, description, category, path, coverImage,
            publishedYear, isbn, language, pageCount
        } = input;

        const data = await gql(
            `mutation CreateBook($input: CreateBookInput!) {
            createBook(input: $input) { success message book { _id title author category isActive createdAt } }
        }`,
            {
                input: {
                    title, author, description, category, path, coverImage,
                    isbn, language,
                    publishedYear: publishedYear ? parseInt(publishedYear as string, 10) : undefined,
                    pageCount: pageCount ? parseInt(pageCount as string, 10) : undefined,
                }
            }
        );
        return data.createBook as { success: boolean; message: string; book: Book };
    },

    updateBook: async (id: string, input: Record<string, unknown>) => {
        const {
            title, author, description, category, path, coverImage,
            publishedYear, isbn, language, pageCount
        } = input;

        const data = await gql(
            `mutation UpdateBook($id: ID!, $input: UpdateBookInput!) {
            updateBook(id: $id, input: $input) { success message book { _id title author category isActive updatedAt } }
        }`,
            {
                id,
                input: {
                    title, author, description, category, path, coverImage,
                    isbn, language,
                    publishedYear: publishedYear ? parseInt(publishedYear as string, 10) : undefined,
                    pageCount: pageCount ? parseInt(pageCount as string, 10) : undefined,
                }
            }
        );
        return data.updateBook as { success: boolean; message: string; book: Book };
    },

    deleteBook: async (id: string) => {
        const data = await gql(
            `mutation DeleteBook($id: ID!) {
        deleteBook(id: $id) { success message }
      }`,
            {id}
        );
        return data.deleteBook as { success: boolean; message: string };
    },

    toggleBookStatus: async (id: string) => {
        const data = await gql(
            `mutation ToggleBookStatus($id: ID!) {
        toggleBookStatus(id: $id) { success message book { _id isActive } }
      }`,
            {id}
        );
        return data.toggleBookStatus as { success: boolean; message: string; book: Book };
    },
};
