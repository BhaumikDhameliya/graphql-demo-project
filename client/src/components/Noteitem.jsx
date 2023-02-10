import { useMutation } from "@apollo/client";
import React from "react";
import { toast } from "react-toastify";
import { DELETE_NOTE } from "../mutations/noteMutations";
import { GET_NOTES } from "../queries/noteQueries";
import { useNavigate } from "react-router-dom";

const Noteitem = (props) => {
  const { note, updateNote } = props;
  const navigate = useNavigate();

  const [deleteNote] = useMutation(DELETE_NOTE, {
    variables: { id: note?.id },
    onCompleted: () => navigate("/"),
    refetchQueries: [{ query: GET_NOTES }],
  });
  return (
    <div className="col-md-3" style={{ minWidth: "300px" }}>
      <div className="card my-3">
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">{note.description}</p>
          <i
            className="fas fa-trash mx-2"
            onClick={() => {
              deleteNote();
              toast.success("Note deleted successfully");
            }}
          ></i>
          <i
            className="fas fa-edit mx-2"
            onClick={() => {
              updateNote(note);
            }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
