import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import { ADD_NOTE } from "../mutations/noteMutations";
import { GET_NOTES } from "../queries/noteQueries";

const AddNoteModal = ({ show, setShow, limit, skip, search }) => {
  const [note, setNote] = useState({ title: "", description: "", tag: "" });

  const [addNote] = useMutation(ADD_NOTE, {
    variables: {
      title: note.title,
      description: note.description,
      tag: note.tag,
    },
    update(cache, { data: { addNote } }) {
      const data = cache.readQuery({
        query: GET_NOTES,
        variables: {
          limit,
          skip,
          search,
        },
      });
      cache.writeQuery({
        query: GET_NOTES,
        variables: {
          limit,
          skip,
          search,
        },
        data: { ...data, notes: [addNote, ...data.notes.slice(0, 7)] },
      });
    },
  });

  const handleClick = (e) => {
    e.preventDefault();
    if (!note.title?.length || !note.description?.length) {
      toast.error("Title and description must not be empty");
      return;
    }
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    toast.success("Note added successfully");
    setShow(false);
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add Note</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form
          className="m-auto my-3"
          style={{
            maxWidth: "600px",
          }}
        >
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              minLength={5}
              required
              value={note.title}
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              type="text"
              minLength={5}
              required
              value={note.description}
              className="form-control"
              id="description"
              name="description"
              onChange={onChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              minLength={5}
              required
              value={note.tag}
              className="form-control"
              id="tag"
              name="tag"
              onChange={onChange}
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <button type="submit" className="btn btn-primary" onClick={handleClick}>
          Add note
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddNoteModal;
