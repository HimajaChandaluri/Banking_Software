import React, { Component } from "react";
import { Link } from "react-router-dom";

class UserAccount extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <h1>User - userAccount</h1>
        <Link
          to={{
            pathname: "transactions",
            state: {
              account: "CheckingAccount",
            },
          }}
        >
          link
        </Link>
      </React.Fragment>
    );
  }
}

export default UserAccount;
