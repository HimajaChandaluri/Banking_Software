import React from "react";
import "../../App.css";

const Input = (props) => {
  return (
    <div className="form-group">
      <label htmlFor={props.name}> {props.label}</label>
      <input
        value={props.value}
        onChange={props.onChange}
        name={props.name}
        id={props.name}
        type={props.type}
        className="form-control form-element"
        min={props.min ?? undefined}
        max={props.max ?? undefined}
      />
      {props.error && <div className="alert alert-danger">{props.error}</div>}
    </div>
  );
};

export default Input;
