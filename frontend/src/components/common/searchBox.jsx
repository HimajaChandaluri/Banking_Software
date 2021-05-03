import React from "react";
import "../../App.css";

const SearchBox = ({ value, onChange }) => {
  return (
    <div className="form-group" style={{ paddingTop: "23px" }}>
      <input
        type="text"
        name="query"
        className="form-control form-element"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      ></input>
    </div>
  );
};

export default SearchBox;
