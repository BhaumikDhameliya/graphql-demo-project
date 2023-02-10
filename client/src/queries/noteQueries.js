import { gql } from "@apollo/client";

const GET_NOTES = gql`
  query getNotes {
    notes {
      id
      title
      description
      tag
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
