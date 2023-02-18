import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { DELETE_NOTE } from "../mutations/noteMutations";
import { GET_NOTES } from "../queries/noteQueries";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Badge } from "react-bootstrap";

const Noteitem = (props) => {
  const { note, updateNote, limit, skip, search } = props;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const [deleteNote] = useMutation(DELETE_NOTE, {
    variables: { id: note?.id },
    onCompleted: () => navigate("/"),
    refetchQueries: [
      {
        query: GET_NOTES,
        variables: {
          limit,
          skip,
          search,
        },
      },
    ],
  });

  const handleDeleteNote = async () => {
    const res = await deleteNote();
    if (res?.data?.deleteNote) {
      toast.success("Note deleted successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="col-md-3" style={{ minWidth: "300px" }}>
        <div className="card my-3 position-relative">
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
          {note.tag && (
            <Badge
              pill={true}
              bg="info"
              className="position-absolute top-0 end-0"
              style={{ transform: "translate(-10px, 10px)" }}
            >
              {note.tag}
            </Badge>
          )}
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
