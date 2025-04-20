import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks($limit: Int, $offset: Int) {
    getBooks(limit: $limit, offset: $offset) {
      total
      items {
        id
        title
        author {
          name
        }
      }
    }
  }
`;

export const GET_BOOK_BY_ID = gql`
  query GetBookById($id: Int!) {
    getBookById(id: $id) {
      id
      title
      genre
      publishedYear
      rating
      isPublished
      author {
        name
      }
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($data: CreateBookInput!) {
    addBook(data: $data) {
      id
      title
      author {
        name
      }
    }
  }
`;
