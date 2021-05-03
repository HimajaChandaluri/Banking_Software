import React, { Component } from "react";
import SelectWithoutBlankOption from "./common/selectWithoutBlankOption";
import SearchBox from "./common/searchBox";
import PastTransactionsTable from "./pastTransactionsTable";
import _ from "lodash";

class PastTransactions extends Component {
  state = {
    selectedTransType: "All",
  };

  handleChange = (e) => {
    console.log(e.currentTarget.value);
    this.setState({ selectedTransType: e.currentTarget.value });
  };

  getTableData = () => {
    const savingAccRegex = new RegExp("SavingAccount");
    const checkingAccRegex = new RegExp("CheckingAccount");
    const {
      savingAccTrans,
      checkingAccTrans,
      selected,
      userAccountDetails,
    } = this.props;

    let data = [];
    if (selected === "All Accounts") {
      data = [...savingAccTrans, ...checkingAccTrans];
      console.log("All Accounts");
    } else if (savingAccRegex.test(selected)) {
      data = [...savingAccTrans];
      console.log("SavingAccount");
    } else if (checkingAccRegex.test(selected)) {
      data = [...checkingAccTrans];
      console.log("CheckingAccount");
    }

    let filteredData = [];
    const { selectedTransType } = this.state;
    if (selectedTransType === "Credit") {
      if (savingAccRegex.test(selected)) {
        filteredData = data.filter((tran) => {
          return (
            tran.receiverAccount.accountNumber ===
            userAccountDetails.savingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else if (checkingAccRegex.test(selected)) {
        filteredData = data.filter((tran) => {
          return (
            tran.receiverAccount.accountNumber ===
            userAccountDetails.checkingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else {
        filteredData = data.filter((tran) => {
          return (
            tran.receiverAccount.accountNumber ===
              userAccountDetails.checkingAccount.accountNumber ||
            tran.receiverAccount.accountNumber ===
              userAccountDetails.savingAccount.accountNumber
          );
        });
        filteredData = _.uniqBy(filteredData, "_id");
        console.log("FILTERED DATA: ", filteredData);
      }
    } else if (selectedTransType === "Debit") {
      if (savingAccRegex.test(selected)) {
        filteredData = data.filter((tran) => {
          return (
            tran.senderAccount.accountNumber ===
            userAccountDetails.savingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else if (checkingAccRegex.test(selected)) {
        filteredData = data.filter((tran) => {
          return (
            tran.senderAccount.accountNumber ===
            userAccountDetails.checkingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else {
        filteredData = data.filter((tran) => {
          return (
            tran.senderAccount.accountNumber ===
              userAccountDetails.checkingAccount.accountNumber ||
            tran.senderAccount.accountNumber ===
              userAccountDetails.savingAccount.accountNumber
          );
        });
        filteredData = _.uniqBy(filteredData, "_id");
        console.log("FILTERED DATA: ", filteredData);
      }
    } else if (selectedTransType === "All") {
      filteredData = _.uniqBy(data, "_id");
    }

    return filteredData;
  };

  render() {
    return (
      <React.Fragment>
        <div className="row justify-content-center">
          <h4 className="mt-4 mb-4">Past Transactions</h4>
        </div>
        <div className="row">
          <div className="col-sm-4">
            <SelectWithoutBlankOption
              name="pastTranChoice"
              label=""
              options={["All", "Credit", "Debit"]}
              onChange={this.handleChange}
            />
          </div>
          <div className="col-lg-8">
            <SearchBox value="" onChange={this.handleSearch}></SearchBox>
          </div>
        </div>
        <PastTransactionsTable
          data={this.getTableData()}
        ></PastTransactionsTable>
      </React.Fragment>
    );
  }
}

export default PastTransactions;
