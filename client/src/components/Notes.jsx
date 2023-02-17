import React, { useEffect, useRef, useState } from "react";
import AddNote from "./AddNote";
import Noteitem from "./Noteitem";
import { toast } from "react-toastify";
import { GET_NOTE, GET_NOTES } from "../queries/noteQueries";
import { useMutation, useQuery } from "@apollo/client";
import Spinner from "./Spinner";
import { UPDATE_NOTE } from "../mutations/noteMutations";
import { Pagination } from "react-bootstrap";

const limit = 8;

function Notes() {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const { loading, error, data } = useQuery(GET_NOTES, {
    variables: {
      limit,
      skip,
    },
  });

  const ref = useRef(null);
  const refClose = useRef(null);

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const [updateNote] = useMutation(UPDATE_NOTE, {
    variables: {
      id: note.id,
      title: note.etitle,
      description: note.edescription,
      tag: note.etag,
    },
    refetchQueries: [{ query: GET_NOTE, variables: { id: note.id } }],
  });

  const handleUpdateNote = (currentNote) => {
    ref.current.click();
    setNote({
      id: currentNote.id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
  };

  const handleClick = async (e) => {
    const res = await updateNote(
      note.id,
      note.etitle,
      note.edescription,
      note.etag
    );
    if (res?.data?.updateNote) {
      refClose.current.click();
      toast.success("Note updated successfully");
    } else {
      toast.error("Something went wrong");
    }
  };
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handlePrev = () => {
    setPage((page) => page - 1);
    setSkip((prevSkip) => prevSkip - limit);
  };

  const handleNext = () => {
    setPage((page) => page + 1);
    setSkip((prevSkip) => prevSkip + limit);
  };

  const handleSetPage = (page) => {
    setPage(page);
    setSkip((page - 1) * limit);
  };

  if (error) return <p>Something Went Wrong</p>;

  useEffect(() => {
    if (data?.totalNotesCount) {
      setLastPage(Math.ceil(data.totalNotesCount / limit));
    }
  }, [data?.totalNotesCount]);

  return (
    <>
      <AddNote {...{ limit, skip }} />
      <button
        type="button"
        className="btn btn-primary d-none"
        ref={ref}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
            </div>
            <div className="modal-footer">
              <button
                type="button"
                ref={refClose}
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={
                  note.etitle.length < 5 || note.edescription.length < 5
                }
                type="button"
                onClick={handleClick}
                className="btn btn-primary"
              >
                Update note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3 justify-content-center">
        <h2>Your notes</h2>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="container">
              {data?.notes?.length === 0 && "No notes to display"}
            </div>
            {data?.notes?.map((note) => {
              return (
                <Noteitem
                  key={note.id}
                  updateNote={handleUpdateNote}
                  note={note}
                  limit={limit}
                  skip={skip}
                />
              );
            })}
          </>
        )}
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <Pagination>
          <Pagination.Prev onClick={handlePrev} disabled={page === 1} />
          {page - 3 > 0 && (
            <>
              <Pagination.Item
                onClick={() => {
                  handleSetPage(1);
                }}
              >
                {1}
              </Pagination.Item>
              <Pagination.Ellipsis
                onClick={() => {
                  handleSetPage(page - 3);
                }}
              />
            </>
          )}
          {page - 2 > 0 && (
            <Pagination.Item
              onClick={() => {
                handleSetPage(page - 2);
              }}
            >
              {page - 2}
            </Pagination.Item>
          )}
          {page - 1 > 0 && (
            <Pagination.Item
              onClick={() => {
                handleSetPage(page - 1);
              }}
            >
              {page - 1}
            </Pagination.Item>
          )}
          <Pagination.Item active>{page}</Pagination.Item>
          {page + 1 <= lastPage && (
            <Pagination.Item
              onClick={() => {
                handleSetPage(page + 1);
              }}
            >
              {page + 1}
            </Pagination.Item>
          )}
          {page + 2 <= lastPage && (
            <Pagination.Item
              onClick={() => {
                handleSetPage(page + 2);
              }}
            >
              {page + 2}
            </Pagination.Item>
          )}
          {page + 3 <= lastPage && (
            <>
              <Pagination.Ellipsis
                onClick={() => {
                  handleSetPage(page + 3);
                }}
              />
              <Pagination.Item
                onClick={() => {
                  handleSetPage(lastPage);
                }}
              >
                {lastPage}
              </Pagination.Item>
            </>
          )}
          <Pagination.Next onClick={handleNext} disabled={page === lastPage} />
        </Pagination>
      </div>
    </>
  );
}

export default Notes;
