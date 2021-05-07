import React, { Component } from "react";
import Table from "./common/table";

class FutureTransactionsTable extends Component {
  state = {};

  columns = [
    { path: "dateToBeInitiatedOn", label: "Date" },
    { path: "senderAccount.accountNumber", label: "Sender" },
    { path: "receiverAccount.accountNumber", label: "Receiver" },
    { path: "amount", label: "Amount" },
    { path: "typeOfPayment", label: "Type" },
  ];

  render() {
    const { data } = this.props;
    return (
      <React.Fragment>
        {data.length === 0 && (
          <p className="row justify-content-center">
            No future transactions available
          </p>
        )}
        {data.length !== 0 && (
          <Table data={data} columns={this.columns} keyAtt="_id"></Table>
        )}
      </React.Fragment>
    );
  }
}

export default FutureTransactionsTable;
