import React, { Component } from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import { deleteAccount } from "../services/userService";

class CloseAccount extends Form {
  state = {
    data: { accountType: "", accountNumber: "" },
    errors: {},
    showSuccessBanner: false,
    showWarningBanner: false,
  };

  baseState = { ...this.state };

  schema = {
    accountType: Joi.string().required().label("Account Type"),
    accountNumber: Joi.number()
      .min(10000000)
      .max(99999999)
      .label("Account Number"),
  };

  doSubmit = async () => {
    try {
      console.log(this.state.data);
      const response = await deleteAccount(this.state.data);
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
            Account deleted successfully!
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
            Account does not exist
          </div>
        )}

        <div className="row justify-content-center">
          <h1 className="mt-4 mb-4">Delete Account</h1>
        </div>

        <form onSubmit={this.handleSubmit}>
          <p style={{ fontSize: "20px" }}> Select Account Type</p>
          <div style={{ marginTop: "20px", marginBottom: "20px" }}>
            {this.renderRadioOptions("accountType", "User Account", "radio")}
            {this.renderRadioOptions("accountType", "Saving Account", "radio")}
            {this.renderRadioOptions(
              "accountType",
              "Checking Account",
              "radio"
            )}
          </div>
          <div style={{ fontSize: "20px" }}>
            {this.renderInput("accountNumber", "Account Number", "text")}
          </div>
          {this.renderButton("Delete Account")}
        </form>
      </div>
    );
  }
}

export default CloseAccount;
