import React, { Component } from "react";
import Joi from "joi-browser";
import { isEmpty } from "lodash";
import { UsaStates } from "usa-states";
import Form from "./common/form";
import Input from "./common/Input";
import "../App.css";
import { register } from "../services/userService";

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
      checkingAccount: true,
    },
    errors: {},
    showSuccessBanner: false,
    showWarningBanner: false,
  };
  baseState = { ...this.state };
  doSubmit = async () => {
    try {
      const response = await register(this.state.data);
      if (response && response.status === 200) {
        this.baseState.showSuccessBanner = true;
        this.setState(this.baseState);
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ showWarningBanner: true });
      }
    }
  };

  checkIfAccountTypeSelected = () => {
    const { data, errors } = this.state;
    if (data.savingsAccount || data.checkingAccount) {
      delete errors.accounts;
    } else {
      errors.accounts = "Select atleast one account";
    }
    this.setState({ errors });
  };

  handleChangeForCheckbox = (e) => {
    const data = { ...this.state.data };
    data[e.currentTarget.name] = !data[e.currentTarget.name];
    this.setState({ data }, () => this.checkIfAccountTypeSelected());
  };

  schema = {
    firstName: Joi.string().min(2).max(50).required().label("First Name"),
    lastName: Joi.string().min(2).max(50).required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    phoneNumber: Joi.string()
      .regex(/^\d+$/)
      .length(10)
      .required()
      .label("Phone Number"),
    dateOfBirth: Joi.date().required(),
    address: Joi.string().min(5).max(500).required(),
    city: Joi.string().min(2).max(50).required(),
    state: Joi.string().min(2).max(100).required(),
    zip: Joi.string().regex(/^\d+$/).length(5).required().label("Zip"),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required(),
    savingsAccount: Joi.boolean(),
    checkingAccount: Joi.boolean(),
  };

  render() {
    return (
      <div className="container">
        {this.state.showSuccessBanner && (
          <div className="alert alert-success alert-dismissible fade show">
            <button
              type="button"
              className="close"
              data-dismiss="alert"
              onClick={() => this.setState({ showSuccessBanner: false })}
            >
              &times;
            </button>
            Account created successfully!
          </div>
        )}
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
            Account already exists with same email address or phone number.
          </div>
        )}
        <div className="row justify-content-center">
          <h1 className="mt-4 mb-4">Registration</h1>
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
          <label className="form-check-label">
            Select atleast one type of account
          </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={this.state.data.savingsAccount}
              checked={this.state.data.savingsAccount}
              id="savingsAccount"
              name="savingsAccount"
              onChange={this.handleChangeForCheckbox}
            />
            <label className="form-check-label" htmfor="savingsAccount">
              Savings Account
            </label>
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={this.state.data.checkingAccount}
              checked={this.state.data.checkingAccount}
              id="checkingAccount"
              name="checkingAccount"
              onChange={this.handleChangeForCheckbox}
            />
            <label className="form-check-label" htmfor="checkingAccount">
              Checking Account
            </label>
          </div>
          {this.state.errors?.accounts && (
            <div className="alert alert-danger">
              {this.state.errors?.accounts}
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
