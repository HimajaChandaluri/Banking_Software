import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Transfer extends Component {
  state = {};
  render() {
    return (
      <div>
        <h1>User - Transfer</h1>

        <NavLink
          className="nav-link"
          style={{ float: "leftt", padding: "0px" }}
          to="/newTransfer"
        >
          Make Transfer
        </NavLink>
      </div>
    );
  }
}

export default Transfer;
