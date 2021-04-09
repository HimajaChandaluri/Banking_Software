import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import Input from "./common/Input";
class CreateAccount extends Form {
  state = {
    data: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      password: "",
      confirmPassword: "",
    },
    errors: {},
  };

  doSubmit = () => {
    console.log("submitted");
  };

  schema = {
    firstName: Joi.string().min(5).required().label("First Name"),
    lastName: Joi.string().min(5).required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    phoneNumber: Joi.number()
      .integer()
      .min(10 ** 9)
      .max(10 ** 10 - 1)
      .required()
      .label("Phone Number"),
    dateOfBirth: Joi.string().required(),
    address: Joi.string().max(100).required(),
    city: Joi.string().max(10).required(),
    state: Joi.string().required(),
    zip: Joi.number()
      .integer()
      .min(10 ** 4)
      .max(10 ** 5 - 1)
      .required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required(),
  };

  render() {
    return (
      <div className="container">
        <h1>Admin - createAccount</h1>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col">
              {this.renderInput("firstName", "First Name", "text")}
              {this.renderInput("email", "Email", "text")}
              {this.renderInput("dateOfBirth", "Date Of Birth", "text")}
            </div>
            <div className="col">
              {this.renderInput("lastName", "Last Name", "text")}
              {this.renderInput("phoneNumber", "Phone Number", "text")}
              {this.renderInput("address", "Address", "text")}
            </div>
          </div>
          <div className="row">
            <div className="col">
              {this.renderInput("city", "City", "text")}
            </div>
            <div className="col">
              {this.renderInput("state", "State", "text")}
            </div>
            <div className="col">{this.renderInput("zip", "Zip", "text")}</div>
          </div>
          <div className="row">
            <div className="col">
              {this.renderInput("password", "Password", "password")}
            </div>
            <div className="col">
              <Input
                name="confirmPassword"
                label="Confirm Password"
                value={this.state.data.confirmPassword}
                onChange={this.handleConfirmPassword}
                error={this.state.errors.confirmPassword}
                type="password"
              />
            </div>
          </div>
          <button disabled={this.validate()} className="btn btn-primary">
            Create Account
          </button>
        </form>
      </div>
    );
  }
}

export default CreateAccount;
