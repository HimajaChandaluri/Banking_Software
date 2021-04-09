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
      <Redirect
        to={{
          pathname: "/home",
        }}
      ></Redirect>;
    }
  }

  render() {
    return null;
  }
}

export default Logout;
