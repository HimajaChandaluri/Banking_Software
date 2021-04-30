import React from "react";
import Form from "./common/form";
import Joi from "joi-browser";
import { getUserDetails } from "../services/userService";
import { isEmpty } from "lodash";
import { compareDesc } from "date-fns";
import auth from "../services/authService";
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
class NewTransfer extends Form {
  state = {
    data: {
      userId: "",
      checkingAccount: false,
      savingAccount: false,
      typeOfTransfer: "Transfer to someone within a bank",
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
    isTransferCompleted: false,
    showWarningBanner: false,
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
      if (response && response.status === 200) {
        this.setState({ isTransferCompleted: true });
      }
      console.log(response);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        this.setState({ showWarningBanner: true });
      }
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

  renderConfirmation = () => {
    return (
      <div className="mt-4 mb-4">
        <div className="row">
          <div className="col">
            <p style={{ padding: "0 0 0 50%" }}>From</p>
            <p style={{ padding: "0 0 0 50%" }}>To</p>
            <p style={{ padding: "0 0 0 50%" }}>Amount</p>
            {!isEmpty(this.state.data.startOn) && (
              <p style={{ padding: "0 0 0 50%" }}>Starts on</p>
            )}
            {!isEmpty(this.state.data.endsOn) && (
              <p style={{ padding: "0 0 0 50%" }}>Ends on</p>
            )}
            <div style={{ margin: "0 0 0 50%" }} className="mt-5">
              {this.renderButton("Make another transfer", () =>
                window.location.replace("/newTransfer")
              )}
            </div>
          </div>
          <div className="col">
            <p>{this.state.data.fromAccount}</p>
            <p>{this.state.data.toAccount}</p>
            <p>{this.state.data.amount}</p>
            {!isEmpty(this.state.data.startOn) && (
              <p>{this.state.data.startOn}</p>
            )}
            {!isEmpty(this.state.data.endsOn) && (
              <p>{this.state.data.endsOn}</p>
            )}
            <div className="mt-5">
              {this.renderButton("View all transactions", () =>
                window.location.replace("/transactions")
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.state.isTransferCompleted && (
          <div>
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
            {this.renderConfirmation()}
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
            Transaction failed
          </div>
        )}
        {!this.state.isTransferCompleted && (
          <form onSubmit={this.validateAndSubmit}>
            <p style={{ fontSize: "20px" }}> Choose type of transfer</p>
            <div>
              {this.renderRadioOptions(
                "typeOfTransfer",
                "Transfer between my accounts",
                "radio",
                !this.bothAccountsExists(),
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
                          (accNumber) =>
                            accNumber != this.state.data.fromAccount
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
                    this.renderInput(
                      "routingNumber",
                      "Routing Number",
                      "number"
                    )}
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
        )}
      </div>
    );
  }
}

export default NewTransfer;
