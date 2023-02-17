import React, { useEffect, useState } from "react";
import AddNote from "./AddNote";
import Noteitem from "./Noteitem";
import { GET_NOTES } from "../queries/noteQueries";
import { useQuery } from "@apollo/client";
import Spinner from "./Spinner";
import { Button, Pagination } from "react-bootstrap";
import EditNote from "./EditNote";
import AddNoteModal from "./AddNoteModal";

const limit = 8;

function Notes() {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showEditNote, setShowEditNote] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  const { loading, error, data } = useQuery(GET_NOTES, {
    variables: {
      limit,
      skip,
    },
  });

  const [note, setNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
  });

  const handleUpdateNote = (currentNote) => {
    setNote({
      id: currentNote.id,
      etitle: currentNote.title,
      edescription: currentNote.description,
      etag: currentNote.tag,
    });
    setShowEditNote(true);
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
      {/* <AddNote {...{ limit, skip }} /> */}

      <AddNoteModal
        show={showAddNote}
        setShow={setShowAddNote}
        limit={limit}
        skip={skip}
      />
      <EditNote
        note={note}
        setNote={setNote}
        limit={limit}
        skip={skip}
        show={showEditNote}
        setShow={setShowEditNote}
      />

      <div className="row my-3 justify-content-center">
        <h2>Your notes</h2>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="container">
              {data?.notes?.length === 0 && "No notes to display"}
            </div>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <input type="text" />
              <Button onClick={() => setShowAddNote(true)}>Add Note</Button>
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
