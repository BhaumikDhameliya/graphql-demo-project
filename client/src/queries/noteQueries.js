import { gql } from "@apollo/client";

const GET_NOTES = gql`
  query getNotes($limit: Int, $skip: Int, $search: String) {
    notes(limit: $limit, skip: $skip, search: $search) {
      id
      title
      description
      tag
    }
    totalNotesCount(search: $search)
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
