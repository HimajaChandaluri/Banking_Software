import React, { Component } from "react";
import SelectWithoutBlankOption from "./common/selectWithoutBlankOption";
import SearchBox from "./common/searchBox";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import PastTransactionsTable from "./pastTransactionsTable";
import _ from "lodash";

class PastTransactions extends Component {
  state = {
    selectedTransType: "All",
    pageSize: 4,
    currentPage: 1,
    searchQuery: "",
  };

  handleChange = (e) => {
    console.log(e.currentTarget.value);
    this.setState({
      selectedTransType: e.currentTarget.value,
      currentPage: 1,
      searchQuery: "",
    });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
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
    const { pageSize, currentPage, searchQuery } = this.state;

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
            tran.receiverAccount &&
            tran.receiverAccount.accountNumber ===
              userAccountDetails.savingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else if (checkingAccRegex.test(selected)) {
        filteredData = data.filter((tran) => {
          return (
            tran.receiverAccount &&
            tran.receiverAccount.accountNumber ===
              userAccountDetails.checkingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else {
        filteredData = data.filter((tran) => {
          return (
            (tran.receiverAccount &&
              tran.receiverAccount.accountNumber ===
                userAccountDetails.checkingAccount.accountNumber) ||
            (tran.receiverAccount &&
              tran.receiverAccount.accountNumber ===
                userAccountDetails.savingAccount.accountNumber)
          );
        });
        filteredData = _.uniqBy(filteredData, "_id");
        console.log("FILTERED DATA: ", filteredData);
      }
    } else if (selectedTransType === "Debit") {
      if (savingAccRegex.test(selected)) {
        filteredData = data.filter((tran) => {
          return (
            tran.senderAccount &&
            tran.senderAccount.accountNumber ===
              userAccountDetails.savingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else if (checkingAccRegex.test(selected)) {
        filteredData = data.filter((tran) => {
          return (
            tran.senderAccount &&
            tran.senderAccount.accountNumber ===
              userAccountDetails.checkingAccount.accountNumber
          );
        });
        console.log("FILTERED DATA: ", filteredData);
      } else {
        filteredData = data.filter((tran) => {
          return (
            (tran.senderAccount &&
              tran.senderAccount.accountNumber ===
                userAccountDetails.checkingAccount.accountNumber) ||
            (tran.senderAccount &&
              tran.senderAccount.accountNumber ===
                userAccountDetails.savingAccount.accountNumber)
          );
        });
        filteredData = _.uniqBy(filteredData, "_id");
        console.log("FILTERED DATA: ", filteredData);
      }
    } else if (selectedTransType === "All") {
      filteredData = _.uniqBy(data, "_id");
    }

    if (searchQuery) {
      filteredData = filteredData.filter(
        (tran) =>
          (tran.senderAccount &&
            tran.senderAccount.accountNumber
              .toString()
              .startsWith(searchQuery)) ||
          (tran.receiverAccount &&
            tran.receiverAccount.accountNumber
              .toString()
              .startsWith(searchQuery))
      );
    }

    const paginatedData = paginate(filteredData, currentPage, pageSize);

    return { dataLength: filteredData.length, data: paginatedData };
  };

  render() {
    const { pageSize, currentPage, searchQuery } = this.state;

    const { dataLength, data } = this.getTableData();

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
            <SearchBox
              value={searchQuery}
              onChange={this.handleSearch}
            ></SearchBox>
          </div>
        </div>
        <PastTransactionsTable data={data}></PastTransactionsTable>
        <Pagination
          itemsCount={dataLength}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        ></Pagination>
      </React.Fragment>
    );
  }
}

export default PastTransactions;
