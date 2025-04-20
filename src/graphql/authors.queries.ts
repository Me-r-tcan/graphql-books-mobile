import { gql } from '@apollo/client';

export const GET_AUTHORS = gql`
  query GetAuthors($limit: Int, $offset: Int, $search: String) {
    getAuthors(limit: $limit, offset: $offset, search: $search) {
      id
      name
    }
  }
`;
