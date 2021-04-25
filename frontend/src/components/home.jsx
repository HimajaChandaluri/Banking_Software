import React, { Component } from "react";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";

class Home extends Component {
  state = {};
  render() {
    const user = auth.getCurrentUser();
    console.log("Got user data again in HOME: ", user);

    if (!user) {
      //return <h1>Home - unprotected</h1>;
	return (<Redirect to={{ pathname: "/Login",}}></Redirect>);
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
