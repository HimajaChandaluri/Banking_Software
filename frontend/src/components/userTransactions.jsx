import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { getTransactionHistory } from "../services/historyService";
import { getUserDetails } from "../services/userService";
import auth from "../services/authService";
import "../App.css";

class UserTransactions extends Component {
  constructor(props) {
    super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = { //state is by default an object
	activeAccount : 0,
	accountBalance : 0,
        transactions: [
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' },
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' },
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' },
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' },
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' },
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' },
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' },
          { Date: '04-13-2021', Description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text', Amount: '200$', AvailableBalance: '120$' }
       ]
    }
 }
 renderTableHeader() {
  let header = Object.keys(this.state.transactions[0])
  return header.map((key, index) => {
     return <th key={index}>{key.toUpperCase()}</th>
  })
}
 renderTableData() {
  return this.state.transactions.map((user, index) => {
     const { Date, Description, Amount, AvailableBalance } = user //destructuring
     return (
        <tr key={Date}>
           <td>{Date}</td>
           <td>{Description}</td>
           <td>{Amount}</td>
           <td>{AvailableBalance}</td>
        </tr>
     )
  })
}

  state = {};

async componentDidMount() {
	// Get account selected from accounts page
	var { account="" } = this.props.location.state || {};

	//console.log("Selected Account", account);

	// Get current user account details
	const user = auth.getCurrentUser();
	let userAccountDetails = await getUserDetails(user._id);

	// Default to the first available account, if not selected
	if(account === ""){
		//console.log("No Accounts selected");
		// Select Checking account if available
		if(userAccountDetails.data.checkingAccount){
			account = userAccountDetails.data.checkingAccount.accountNumber;
		}else if (userAccountDetails.data.savingAccount){
			account = userAccountDetails.data.savingAccount.accountNumber;
		} else {
			// No accounts. Redirect to the Accounts page
			//console.log("No Accounts");
			return <Redirect to="accounts" />
		}
		console.log("Defaulting to account", account);
	}

	let activeAccount = {...this.state.activeAccount};
	activeAccount = account;

	let accountBalance = {...this.state.accountBalance};
	if(userAccountDetails.data.checkingAccount && userAccountDetails.data.checkingAccount.accountNumber===account){
		accountBalance = userAccountDetails.data.checkingAccount.balance;
	}else if(userAccountDetails.data.savingAccount){
		accountBalance = userAccountDetails.data.savingAccount.balance;
	}else{
		accountBalance = 0;
	}

	const transactionHistory = [...this.state.transactions];

	// Fetch the transaction history
	//getTransactionHistory(account);

	this.setState({activeAccount, accountBalance, transactionHistory});
}

  render() {
	console.log("Rendering account", this.state.activeAccount);
	let accountNameHidden = "XXXX" + (this.state.activeAccount).toString().slice(4);

    return (
    <div className="container">
      <div className="row justify-content-center">
          <h1 className="mt-4 mb-4">Account {accountNameHidden}</h1>
      </div>
      <h3>Summary</h3>
      <h2>Available Balance (as of today): ${this.state.accountBalance}</h2><br></br>
      <form action="/" method="get">
        <label htmlFor="header-search">
            <span className="visually-hidden">Search UserTransactions : -</span>
        </label>
        <input
            type="text"
            id="header-search"
            placeholder="search transactions"
            name="s" 
        />
        <button type="submit">Search</button>
    </form><br></br>
      <div>
        <table id='users'>
               <tbody>
               <tr>{this.renderTableHeader()}</tr>
                  {this.renderTableData()}
               </tbody>
            </table>
      </div>
    </div>
  )};
}

export default UserTransactions;
