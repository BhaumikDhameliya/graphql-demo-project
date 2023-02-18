import { gql } from "@apollo/client";

const GET_NOTES = gql`
  query getNotes($limit: Int, $skip: Int, $search: String, $tag: String) {
    notes(limit: $limit, skip: $skip, search: $search, tag: $tag) {
      id
      title
      description
      tag
    }
    totalNotesCount(search: $search, tag: $tag)
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

const GET_TAGS = gql`
  query getTags {
    tags
  }
`;

export { GET_NOTES, GET_NOTE, GET_TAGS };
