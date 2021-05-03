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
  }

  async populateUserAccountNumbers() {
    const user = auth.getCurrentUser();
    const { data: userAccountDetails } = await getUserDetails(user._id);

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

    this.setState({ accountNumbers });
  }

  handleChange = (e) => {
    console.log(e.currentTarget.value);
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

        {/* Past transactions */}
        <div>
          <div className="row justify-content-center">
            <h4 className="mt-4 mb-4">Past Transactions</h4>
            <PastTransactions
              savingAccTrans={this.state.savingAccPastTrans}
              checkingAccTrans={this.state.checkingAccPastTrans}
            ></PastTransactions>
          </div>
        </div>

        {/* Future transactions */}
        <div>
          <div className="row justify-content-center">
            <h4 className="mt-4 mb-4">Future Transactions</h4>
            <FutureTransactions
              savingAccTrans={this.state.savingAccFutureTrans}
              checkingAccTrans={this.state.checkingAccFutureTrans}
            ></FutureTransactions>
          </div>
        </div>
      </div>
    );
  }
}

export default UserTransactions;
