import { useMutation } from "@apollo/client";
import React from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { UPDATE_NOTE } from "../mutations/noteMutations";
import { GET_NOTE } from "../queries/noteQueries";

const EditNote = ({ note, setNote, show, setShow }) => {
  const [updateNote] = useMutation(UPDATE_NOTE, {
    variables: {
      id: note.id,
      title: note.etitle,
      description: note.edescription,
      tag: note.etag,
    },
    refetchQueries: [{ query: GET_NOTE, variables: { id: note.id } }],
  });

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleClick = async (e) => {
    const res = await updateNote(
      note.id,
      note.etitle,
      note.edescription,
      note.etag
    );
    if (res?.data?.updateNote) {
      setShow(false);
      toast.success("Note updated successfully");
    } else {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className="modal fade"
      id="exampleModal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div
        className="modal show"
        style={{ display: "block", position: "initial" }}
      >
        <Modal show={show} onHide={() => setShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Note</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <form className="my-3">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  value={note.etitle}
                  minLength={5}
                  required
                  className="form-control"
                  id="etitle"
                  name="etitle"
                  aria-describedby="emailHelp"
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <input
                  type="text"
                  value={note.edescription}
                  minLength={5}
                  required
                  className="form-control"
                  id="edescription"
                  name="edescription"
                  onChange={onChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tag" className="form-label">
                  Tag
                </label>
                <input
                  type="text"
                  value={note.etag}
                  className="form-control"
                  id="etag"
                  name="etag"
                  onChange={onChange}
                />
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <button
              disabled={note.etitle.length < 5 || note.edescription.length < 5}
              type="button"
              onClick={handleClick}
              className="btn btn-primary"
            >
              Update note
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default EditNote;
