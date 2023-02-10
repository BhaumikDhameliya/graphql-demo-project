import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { DELETE_NOTE } from "../mutations/noteMutations";
import { GET_NOTES } from "../queries/noteQueries";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

const Noteitem = (props) => {
  const { note, updateNote } = props;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [deleteNote] = useMutation(DELETE_NOTE, {
    variables: { id: note?.id },
    onCompleted: () => navigate("/"),
    refetchQueries: [{ query: GET_NOTES }],
  });

  const handleDeleteNote = async () => {
    const res = await deleteNote();
    if (res?.data) {
      toast.success("Note deleted successfully");
    }
  };

  return (
    <>
      <div className="col-md-3" style={{ minWidth: "300px" }}>
        <div className="card my-3">
          <div className="card-body">
            <h5 className="card-title">{note.title}</h5>
            <p className="card-text">{note.description}</p>
            <Button
              variant="light"
              onClick={() => setShowModal((prev) => !prev)}
            >
              <i className="fas fa-trash mx-2 text-danger"></i>
            </Button>
            <Button
              variant="light"
              onClick={() => updateNote(note)}
              className="ms-2"
            >
              <i className="fas fa-edit mx-2 text-primary"></i>
            </Button>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        title="Confirm Delete"
        bodyText="Are you sure ?"
        onClose={(success) => {
          if (success) {
            handleDeleteNote();
          }
        }}
        show={showModal}
        setShow={setShowModal}
      />
    </>
  );
};

export default Noteitem;
