import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { GET_TAGS } from "../queries/noteQueries";
import Spinner from "./Spinner";
import "./TagFilter.css";

const TagFilter = ({ tag, setTag, searchTag, setSearchTag }) => {
  const { loading, error, data } = useQuery(GET_TAGS);

  const [tagList, setTagList] = useState([]);
  console.log("searchTag----->", searchTag);

  useEffect(() => {
    if (data && data.tags) setTagList(data.tags);
  }, [data]);

  return (
    <Dropdown drop="down-centered">
      <Dropdown.Toggle variant="info" id="tag-filter" className="text-white">
        <input
          type="text"
          className="tag-filter-input"
          value={searchTag}
          onChange={(e) => {
            setSearchTag(e.target.value);
          }}
          placeholder="Select Tag"
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {error ? (
          <div>Something Went Wrong</div>
        ) : loading ? (
          <Spinner />
        ) : (
          tagList?.map((t) => {
            return (
              <Dropdown.Item key={t} onClick={() => setSearchTag(t)}>
                {t}
              </Dropdown.Item>
            );
          })
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TagFilter;
