import React, { Component } from "react";
import Joi from "joi-browser";
import { isEmpty } from "lodash";
import { UsaStates } from "usa-states";
import Form from "./common/form";
import Input from "./common/Input";
import "../App.css";

var usStates = new UsaStates();

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
      savingsAccount: false,
      checkingAccount: false,
    },
    errors: {
      accounts: "Select atleast one account",
    },
  };
  doSubmit = () => {
    console.log("submitted");
  };

  handleChangeForCheckbox = (e) => {
    const data = { ...this.state.data };
    const errors = { ...this.state.errors };
    data[e.currentTarget.name] = !data[e.currentTarget.name];
    this.setState({ data });

    if (data.savingsAccount || data.checkingAccount) {
      delete errors.accounts;
      this.setState({ errors });
    }
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
    dateOfBirth: Joi.date().required(),
    address: Joi.string().max(100).required(),
    city: Joi.string().max(10).required(),
    state: Joi.string().min(2).required(),
    zip: Joi.number()
      .integer()
      .min(10 ** 4)
      .max(10 ** 5 - 1)
      .required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required(),
    savingsAccount: Joi.boolean(),
    checkingAccount: Joi.boolean(),
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <h1>Registration</h1>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className="col">
              {this.renderInput("firstName", "First Name", "text")}
              {this.renderInput("email", "Email", "text")}
              {this.renderInput("dateOfBirth", "Date Of Birth", "date")}
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
              {this.renderSelect("state", "State", usStates.states)}
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

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value={this.state.data.savingsAccount}
              id="savingsAccount"
              name="savingsAccount"
              onChange={this.handleChangeForCheckbox}
            />
            <label class="form-check-label" for="savingsAccount">
              Savings Account
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              value={this.state.data.checkingAccount}
              id="checkingAccount"
              name="checkingAccount"
              onChange={this.handleChangeForCheckbox}
            />
            <label class="form-check-label" for="checkingAccount">
              Checking Account
            </label>
          </div>
          {this.state.errors.accounts && (
            <div className="alert alert-danger">
              {this.state.errors.accounts}
            </div>
          )}
          <div className="row justify-content-center">
            <button
              disabled={!isEmpty(this.validate())}
              className="btn btn-custom"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateAccount;
