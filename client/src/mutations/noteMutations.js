import { gql } from "@apollo/client";

const ADD_NOTE = gql`
  mutation AddNote($title: String!, $description: String!, $tag: String) {
    addNote(title: $title, description: $description, tag: $tag) {
      id
      title
      description
      tag
    }
  }
`;

const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id) {
      id
    }
  }
`;

const UPDATE_NOTE = gql`
  mutation UpdateNote(
    $id: ID!
    $title: String!
    $description: String!
    $tag: String!
  ) {
    updateNote(id: $id, title: $title, description: $description, tag: $tag) {
      id
      title
      description
      tag
    }
  }
`;

export { ADD_NOTE, DELETE_NOTE, UPDATE_NOTE };
