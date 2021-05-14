import React, { Component } from "react";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import background from "../images/bank.png";
class Home extends Component {
  state = {};
  render() {
    const user = auth.getCurrentUser();
    console.log("Got user data again in HOME: ", user);

    if (!user) {
      return (
        <div>
          <img
            src={background}
            alt="LOGO"
            style={{
              width: "100%",
              maxHeight: "700px",
            }}
          ></img>
        </div>
      );
    } else {
      if (user && user.isAdmin) {
        return (
          <Redirect
            to={{
              pathname: "/createAccount",
            }}
          ></Redirect>
        );
      } else {
        return (
          <Redirect
            to={{
              pathname: "/accounts",
            }}
          ></Redirect>
        );
      }
    }
  }
}

export default Home;
