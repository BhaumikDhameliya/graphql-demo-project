import { gql } from "@apollo/client";

const GET_NOTES = gql`
  query getNotes($limit: Int, $skip: Int) {
    notes(limit: $limit, skip: $skip) {
      data {
        id
        title
        description
        tag
      }
      hasMore
    }
  }
`;

const GET_NOTE = gql`
  query getNote($id: ID!) {
    note(id: $id) {
      id
      title
      description
      tag
    }
  }
`;

export { GET_NOTES, GET_NOTE };
