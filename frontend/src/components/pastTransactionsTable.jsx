import React, { Component } from "react";
import Table from "./common/table";

class PastTransactionsTable extends Component {
  state = {};

  columns = [
    { path: "dateInitiatedOn", label: "Date" },
    { path: "senderAccount.accountNumber", label: "Sender" },
    { path: "receiverAccount.accountNumber", label: "Receiver" },
    { path: "amount", label: "Amount" },
  ];

  render() {
    const { data } = this.props;
    return (
      <React.Fragment>
        {data.length === 0 && (
          <p className="row justify-content-center">
            No past transactions available
          </p>
        )}
        {data.length !== 0 && (
          <Table data={data} columns={this.columns} keyAtt="_id"></Table>
        )}
      </React.Fragment>
    );
  }
}

export default PastTransactionsTable;
