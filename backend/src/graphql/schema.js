import {buildSchema} from "graphql";

const schema = buildSchema(`
  type Book {
    _id: ID!
    title: String!
    author: String!
    description: String
    category: String!
    path: String
    coverImage: String
    isActive: Boolean!
    publishedYear: Int
    isbn: String
    language: String
    pageCount: Int
    createdBy: User
    createdAt: String
    updatedAt: String
  }

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
  }

  type BookConnection {
    books: [Book!]!
    total: Int!
    page: Int!
    totalPages: Int!
  }

  type BookMutationResult {
    success: Boolean!
    message: String!
    book: Book
  }

  input BookFilter {
    search: String
    category: String
    author: String
    isActive: Boolean
    sortBy: String
    sortOrder: String
    page: Int
    limit: Int
  }

  input CreateBookInput {
    title: String!
    author: String!
    description: String
    category: String!
    path: String
    coverImage: String
    publishedYear: Int
    isbn: String
    language: String
    pageCount: Number
    isActive: Boolean
  }

  input UpdateBookInput {
    title: String
    author: String
    description: String
    category: String
    path: String
    coverImage: String
    publishedYear: Int
    isbn: String
    language: String
    pageCount: Int
    isActive: Boolean
  }

  type Query {
    books(filter: BookFilter): BookConnection!
    book(id: ID!): Book
    categories: [String!]!
  }

  type Mutation {
    createBook(input: CreateBookInput!): BookMutationResult!
    updateBook(id: ID!, input: UpdateBookInput!): BookMutationResult!
    deleteBook(id: ID!): BookMutationResult!
    toggleBookStatus(id: ID!): BookMutationResult!
  }
`);

export default schema;