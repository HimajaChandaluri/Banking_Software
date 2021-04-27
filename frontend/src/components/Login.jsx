import React, { Component } from "react";
import auth from "../services/authService";
import { Redirect } from "react-router-dom";
import { login } from "../services/authService";
import Joi from "joi-browser";
import Form from "./common/form";

class Login extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {},
    showWarningBanner: false,
  };

  schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  };

  doSubmit = async () => {
    const { username, password } = this.state.data;
    const response = await login(username, password);
    if (response) {
      window.location = "/";
    } else {
      this.setState({ showWarningBanner: true });
    }
  };

  render() {
    const user = auth.getCurrentUser();

    if (!user) {
      return (
        <div className="container">
          {this.state.showWarningBanner && (
            <div className="alert alert-warning alert-dismissible">
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                onClick={() => this.setState({ showWarningBanner: false })}
              >
                &times;
              </button>
              Invalid Username or Password
            </div>
          )}

          <div className="row justify-content-center">
            <h1 className="mt-4 mb-4">Login</h1>
          </div>

          <form onSubmit={this.handleSubmit}>
            {this.renderInput("username", "Username", "text")}
            {this.renderInput("password", "Password", "password")}
            {this.renderButton("Login")}
          </form>
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

export default Login;
