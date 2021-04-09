import React, { Component } from "react";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class Logout extends Component {
  componentDidMount() {
    const user = auth.getCurrentUser();
    console.log("Got user data again in LOGOUT: ", user);
    if (user) {
      auth.logout();
      window.location = "/";
    } else {
      if (user && user.isAdmin) {
        <Redirect
          to={{
            pathname: "/createAccount",
          }}
        ></Redirect>;
      } else {
        <Redirect
          to={{
            pathname: "/accounts",
          }}
        ></Redirect>;
      }
    }
  }

  render() {
    return null;
  }
}

export default Logout;
