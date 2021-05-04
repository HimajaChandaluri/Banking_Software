import React, { Component } from "react";
import { getUserTransactions } from "../services/userService";
import auth from "../services/authService";
import { getUserDetails } from "../services/userService";
import SelectWithoutBlankOption from "./common/selectWithoutBlankOption";
import PastTransactions from "./pastTransactions";
import FutureTransactions from "./futureTransactions";

class UserTransactions extends Component {
  state = {
    accountNumbers: [],
    selectedAccount: "",
  };

  async componentDidMount() {
    await this.populateUserAccountNumbers();
    await this.populateUserTransactions();
  }

  async populateUserTransactions() {
    const { data: allTrans } = await getUserTransactions();

    if (allTrans[0].checkingTrans) {
      this.setState({
        checkingAccPastTrans: allTrans[0].checkingTrans[0].pastTrans,
        checkingAccFutureTrans: allTrans[0].checkingTrans[0].futureTrans,
      });
    }

    if (allTrans[0].savingTrans) {
      this.setState({
        savingAccPastTrans: allTrans[0].savingTrans[0].pastTrans,
        savingAccFutureTrans: allTrans[0].savingTrans[0].futureTrans,
      });
    }

    this.setState({ selectedAccount: "All Accounts" });
  }

  async populateUserAccountNumbers() {
    const user = auth.getCurrentUser();

    const { data: userAccountDetails } = await getUserDetails(user._id);
    console.log("CURRENT USER DETAILS: ", userAccountDetails);

    let accountNumbers = [...this.state.accountNumbers];

    accountNumbers.push("All Accounts");

    if (userAccountDetails.checkingAccount) {
      accountNumbers.push(
        "CheckingAccount(" +
          userAccountDetails.checkingAccount.accountNumber +
          ")"
      );
    }
    if (userAccountDetails.savingAccount) {
      accountNumbers.push(
        "SavingAccount(" + userAccountDetails.savingAccount.accountNumber + ")"
      );
    }

    this.setState({ accountNumbers, userAccountDetails });
  }

  handleChange = (e) => {
    console.log(e.currentTarget.value);
    this.setState({ selectedAccount: e.currentTarget.value });
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <h1 className="mt-4 mb-4">Transactions</h1>
        </div>
        <SelectWithoutBlankOption
          name="account"
          label="Account"
          options={this.state.accountNumbers}
          onChange={this.handleChange}
        />

        <PastTransactions
          savingAccTrans={this.state.savingAccPastTrans}
          checkingAccTrans={this.state.checkingAccPastTrans}
          selected={this.state.selectedAccount}
          userAccountDetails={this.state.userAccountDetails}
        ></PastTransactions>

        <FutureTransactions
          savingAccTrans={this.state.savingAccFutureTrans}
          checkingAccTrans={this.state.checkingAccFutureTrans}
          selected={this.state.selectedAccount}
          userAccountDetails={this.state.userAccountDetails}
        ></FutureTransactions>
      </div>
    );
  }
}

export default UserTransactions;
