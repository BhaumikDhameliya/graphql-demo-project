import React, { useEffect, useState } from "react";
import AddNote from "./AddNote";
import Noteitem from "./Noteitem";
import { GET_NOTES } from "../queries/noteQueries";
import { useQuery } from "@apollo/client";
import Spinner from "./Spinner";
import { Button, Pagination } from "react-bootstrap";
import EditNote from "./EditNote";
import AddNoteModal from "./AddNoteModal";
import "./Notes.css";
import TagFilter from "./TagFilter";

import searchingDataGIF from "../assets/gifs/searching-data.gif";
import noDataGIF from "../assets/gifs/no-data.gif";
import somethingWentWrongGIF from "../assets/gifs/something-went-wrong.gif";

const limit = 8;

function Notes() {
  const [skip, setSkip] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showEditNote, setShowEditNote] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [searchText, setSearchText] = useState("");

  const { loading, error, data } = useQuery(GET_NOTES, {
    variables: {
      limit,
      skip,
      search,
      tag,
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

  if (error)
    return <img src={somethingWentWrongGIF} alt="something-went-gif" />;

  useEffect(() => {
    if (data?.totalNotesCount) {
      setLastPage(Math.ceil(data.totalNotesCount / limit));
    }
  }, [data?.totalNotesCount]);

  useEffect(() => {
    let timerId;
    timerId = setTimeout(() => {
      setSearch(searchText);
    }, 500);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [searchText]);

  useEffect(() => {
    let timerId;
    timerId = setTimeout(() => {
      setTag(searchTag);
    }, 500);

    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [searchTag]);

  return (
    <>
      {/* <AddNote {...{ limit, skip }} /> */}

      <AddNoteModal
        show={showAddNote}
        setShow={setShowAddNote}
        limit={limit}
        skip={skip}
        search={search}
        tag={tag}
      />
      <EditNote
        note={note}
        setNote={setNote}
        show={showEditNote}
        setShow={setShowEditNote}
      />

      <div className="row my-3 justify-content-center">
        <h2>Your notes</h2>
        {loading ? (
          <img src={searchingDataGIF} alt="searching-data-gif" />
        ) : (
          <>
            <div className="d-flex justify-content-center align-items-center gap-2">
              <input
                className="search-input"
                type="text"
                value={searchText}
                placeholder="Search note..."
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                autoFocus
              />
              <TagFilter
                tag={tag}
                setTag={setTag}
                searchTag={searchTag}
                setSearchTag={setSearchTag}
              />
              <Button onClick={() => setShowAddNote(true)}>Add Note</Button>
            </div>
            <div className="container">
              {data?.notes?.length === 0 && (
                <img src={noDataGIF} alt="no-data-gif" />
              )}
            </div>
            {data?.notes?.map((note) => {
              return (
                <Noteitem
                  key={note.id}
                  updateNote={handleUpdateNote}
                  note={note}
                  limit={limit}
                  skip={skip}
                  search={search}
                  tag={tag}
                />
              );
            })}
          </>
        )}
      </div>
      {data?.totalNotesCount > 0 && (
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
            <Pagination.Next
              onClick={handleNext}
              disabled={page === lastPage}
            />
          </Pagination>
        </div>
      )}
    </>
  );
}

export default Notes;
