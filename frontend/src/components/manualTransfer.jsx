import React from "react";
import Joi from "joi-browser";
import { isEmpty } from "lodash";
import { compareDesc } from "date-fns";
import Form from "./common/form";
import { makeTransfer } from "../services/userService";

var howFrequent = [
  "One time immediately",
  "One time On",
  "Weekly",
  "Every two weeks",
  "Monthly",
  "Every 3 Months",
  "Every 6 Months",
  "Annually",
];

class ManualTransfer extends Form {
  state = {
    data: {
      typeOfTransfer: "Transfer to someone within a bank",
      fromAccount: "",
      toAccount: "",
      amount: "",
      frequency: "",
      startOn: "",
      endsOn: "",
      routingNumber: "",
    },
    errors: {},
    showSuccessBanner: false,
    showWarningBanner: false,
  };
  baseState = { ...this.state };

  schema = {
    typeOfTransfer: Joi.string().required(),
    fromAccount: Joi.string().length(8).allow("").label("Account number"),
    toAccount: Joi.string()
      .length(8)
      .invalid(Joi.ref("fromAccount"))
      .required()
      .label("Account numbers should be different"),
    amount: Joi.number().positive().required().label("Amount"),
    frequency: Joi.string().allow("").label("Frequency"),
    startOn: Joi.date().allow(""),
    endsOn: Joi.date().allow(""),
    routingNumber: Joi.string().length(9).allow("").label("Routing Number"),
  };

  validateAndSubmit = (e) => {
    e.preventDefault();
    const errors = { ...this.state.errors };
    if (
      compareDesc(
        new Date(this.state.data.startOn),
        new Date(this.state.data.endsOn)
      ) < 0
    ) {
      errors.endsOn = "End date should be later than start date";
    }
    this.setState({ errors }, () => this.handleSubmit(e));
  };

  doSubmit = async () => {
    try {
      const response = await makeTransfer(this.state.data);
      if (response && response.status === 200) {
        this.baseState.showSuccessBanner = true;
        this.setState(this.baseState);
      }
      console.log(response);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ showWarningBanner: true });
      }
      console.log(ex);
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
            Transaction successful
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
            Transaction failed.
          </div>
        )}
        <form onSubmit={this.validateAndSubmit}>
          <p style={{ fontSize: "20px" }}> Choose type of transfer</p>
          <div>
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Deposit money",
              "radio",
              false,
              this.state.data.typeOfTransfer
            )}
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer to someone within a bank",
              "radio",
              false,
              this.state.data.typeOfTransfer
            )}
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer to an account in other bank",
              "radio",
              false,
              this.state.data.typeOfTransfer
            )}
          </div>
          <div className="mt-4 mb-4">
            {this.state.data.typeOfTransfer !== "Deposit money" && (
              <div className="row">
                <div className="col">
                  {this.renderInput("fromAccount", "From Account", "number")}
                  {this.renderInput("toAccount", "To Account", "number")}
                  {this.renderInput("amount", "Amount", "number")}
                </div>
                <div className="col">
                  {this.renderSelect("frequency", "Frequency", howFrequent)}
                  {this.state.data.frequency !== "One time immediately" &&
                    this.renderDateInput("startOn", "StartOn", "date")}
                  {!this.state.data.frequency.startsWith("One time") &&
                    this.renderDateInput("endsOn", "EndsOn", "date")}
                  {this.state.data.typeOfTransfer ===
                    "Transfer to an account in other bank" &&
                    this.renderInput(
                      "routingNumber",
                      "Routing Number",
                      "number"
                    )}
                </div>
              </div>
            )}
            {this.state.data.typeOfTransfer === "Deposit money" && (
              <div className="row">
                <div className="col">
                  {this.renderInput("toAccount", "To Account", "number")}
                </div>
                <div className="col">
                  {this.renderInput("amount", "Amount", "number")}
                </div>
              </div>
            )}
          </div>
          <div className="row justify-content-center">
            <button
              disabled={!isEmpty(this.validate())}
              className="btn btn-custom"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ManualTransfer;
