import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getUserDetails } from "../services/userService";
import { isEmpty } from "lodash";
import { compareDesc } from "date-fns";
import auth from "../services/authService";
import { makeTransfer } from "../services/userService";

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
      userId: "",
      checkingAccount: false,
      savingAccount: false,
      typeOfTransfer: "",
      fromAccount: "",
      toAccount: "",
      amount: "",
      frequency: "",
      startOn: "",
      endsOn: "",
      routingNumber: "",
    },
    userAccounts: [],
    transferFromOptions: [],
    errors: {},
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    const data = { ...this.state.data };
    const transferFromOptions = [...this.state.transferFromOptions];
    const userAccounts = [...this.state.userAccounts];

    let userAccountDetails = await getUserDetails(user._id);
    data.userId = user._id;

    if (userAccountDetails.data.checkingAccount) {
      data.checkingAccount = true;
      userAccounts.push(userAccountDetails.data.checkingAccount);
      transferFromOptions.push(
        userAccountDetails.data.checkingAccount.accountNumber
      );
    }
    if (userAccountDetails.data.savingAccount) {
      data.savingAccount = true;
      userAccounts.push(userAccountDetails.data.savingAccount);
      transferFromOptions.push(
        userAccountDetails.data.savingAccount.accountNumber
      );
    }

    this.setState({ data, transferFromOptions, userAccounts });
  }

  doSubmit = async () => {
    try {
      const response = await makeTransfer(this.state.data);
      // if (response && response.status === 200) {
      //   this.baseState.showSuccessBanner = true;
      //   this.setState(this.baseState);
      // }
      console.log(response);
    } catch (ex) {
      // if (ex.response && ex.response.status === 400) {
      //   this.setState({ showWarningBanner: true });
      // }
      console.log(ex);
    }
  };

  schema = {
    userId: Joi.string().required(),
    typeOfTransfer: Joi.string().required(),
    fromAccount: Joi.string().length(8).required().label("Account number"),
    toAccount: Joi.string()
      .length(8)
      .invalid(Joi.ref("fromAccount"))
      .required()
      .label("Account numbers should be different"),
    amount: Joi.number().positive().required().label("Amount"),
    frequency: Joi.string().required().label("Frequency"),
    startOn: Joi.date().allow(""),
    endsOn: Joi.date().allow(""),
    checkingAccount: Joi.boolean(),
    savingAccount: Joi.boolean(),
    routingNumber: Joi.string().length(9).allow("").label("Routing Number"),
  };

  getAvailableBalance = () => {
    let availableBalance = 0;
    this.state.userAccounts.forEach((account) => {
      if (account.accountNumber == this.state.data.fromAccount) {
        availableBalance = account.balance;
      }
    });
    return availableBalance;
  };

  bothAccountsExists = () => {
    const { data } = this.state;
    if (data.savingAccount && data.checkingAccount) return true;
    else return false;
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
    if (this.getAvailableBalance() < this.state.data.amount) {
      errors.amount = "Insufficient funds";
    }
    this.setState({ errors }, () => this.handleSubmit(e));
  };

  render() {
    return (
      <div>
        <form onSubmit={this.validateAndSubmit}>
          <p style={{ fontSize: "20px" }}> Choose type of transfer</p>
          <div>
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer between my accounts",
              "radio",
              !this.bothAccountsExists()
            )}
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer to someone within a bank",
              "radio",
              false
            )}
            {this.renderRadioOptions(
              "typeOfTransfer",
              "Transfer to an account in other bank",
              "radio",
              false
            )}
          </div>
          <div className="mt-4 mb-4">
            <div className="row">
              <div className="col">
                {this.renderSelect(
                  "fromAccount",
                  "From Account",
                  this.state.transferFromOptions
                )}
                {this.bothAccountsExists() &&
                this.state.data.typeOfTransfer ===
                  "Transfer between my accounts"
                  ? this.renderSelect(
                      "toAccount",
                      "To Account",
                      this.state.transferFromOptions.filter(
                        (accNumber) => accNumber != this.state.data.fromAccount
                      )
                    )
                  : this.renderInput("toAccount", "To Account", "number")}
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
                  this.renderInput("routingNumber", "Routing Number", "number")}
              </div>
            </div>
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

export default NewTransfer;
