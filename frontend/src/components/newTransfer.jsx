import React, { Component } from "react";
import Form from "./common/form";
import Joi from "joi-browser";

const howFrequent = [
  "One time immediately",
  "One time On",
  "Weekly",
  "Every two weeks",
  "Monthly",
  "Every 3 Months",
  "Every 6 Months",
  "Annually",
];
class NewTransfer extends Form {
  state = {
    data: {
      typeOfTransfer: "",
      fromAccount: "",
      toAccount: "",
      amount: "",
      frequency: "",
      startOn: "",
      endsOn: "",
    },
    errors: {},
  };
  schema = {
    typeOfTransfer: Joi.string().required(),
    fromAccount: Joi.string().length(8).required().label("Account number"),
    toAccount: Joi.string()
      .length(8)
      .invalid(Joi.ref("fromAccount"))
      .required()
      .label("Account numbers should be different"),
    amount: Joi.number().positive().required().label("Amount"),
    frequency: Joi.string().required().label("Frequency"),
    startOn: Joi.date().required(),
    endsOn: Joi.date()
      .min(new Date(Joi.ref("startOn")))
      .required(),
  };

  render() {
    return (
      <div>
        <form>
          <p style={{ fontSize: "20px" }}> Choose type of transfer</p>
          <div>
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer between my accounts",
              "radio"
            )}
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer to someone within a bank",
              "radio"
            )}
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer to an account in other bank",
              "radio"
            )}
          </div>
          <div className="mt-4 mb-4">
            <div className="row">
              <div className="col">
                {this.renderInput("fromAccount", "From Account", "number")}
                {this.renderInput("toAccount", "To Account", "number")}
                {this.renderInput("amount", "Amount", "number")}
              </div>
              <div className="col">
                {this.renderSelect("frequency", "Frequency", howFrequent)}
                {this.renderInput("startOn", "StartOn", "date")}
                {this.renderInput("endsOn", "EndsOn", "date")}
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {this.renderButton("Transfer")}
          </div>
        </form>
      </div>
    );
  }
}

export default NewTransfer;
