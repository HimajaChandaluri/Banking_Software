import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import { getUserDetails } from "../services/userService";
import { getUserTransactions } from "../services/userService";

class UserAccount extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userFirstName: "Firstname",
			userLastName: "Lastname",
			userAccounts: [],
			userUpcomingTransfers: []
		}
	}

	hideAccountNumber(number) {
		return "XXXX" + (number).toString().slice(4);
	}

	renderAllAccountInfo() {
		return this.state.userAccounts.map((user, index) => {
			const { Name, Type, Balance } = user;
			let accountNameHidden = this.hideAccountNumber(Name);
			return (
				<Link to={{pathname: "transactions", state: {account: (Type==="Checking") ? "CheckingAccount" : "SavingAccount" }}}> 
				<div style={{width: 'auto', padding: '20px', margin: '10px', borderRadius: '25px', background: '#F9F9F9', color: '#222222', border:'1px solid '+this.colorScheme}}>
					<h2>{Type} Account</h2>
					<h4>{accountNameHidden}</h4>
					<h3 style={{color:this.colorScheme}}>${Balance}</h3>
				</div>
				</Link>
			)
		})
	}

	renderUpcomingPayments() {
		/*
		for(const [index, value] of this.state.userUpcomingTransfers.entries()) {
			console.log("Rendering transfers:", value);
		}
		*/
		return this.state.userUpcomingTransfers.map((transferDetails, index) => {
			const amount = transferDetails.amount;
			const receiver = this.hideAccountNumber(transferDetails.receiverAccount.accountNumber);
			const transferDate = transferDetails.dateToBeInitiatedOn;
			const yearStr = transferDate.substring(0, 4);
			const monthStr = transferDate.substring(5, 7);
			const dayStr = transferDate.substring(8, 10);
			const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			const monthIndex = parseInt(monthStr, 10) - 1;
			console.log("Rendering: $", amount, "to", receiver, "on", transferDate);
			return (
				<div className="row justify-content-center" style={{width: '75%'}}>
					<p className="mt-4 mb-4" style={{fontSize: '1.5em'}}><span style={{color: this.colorScheme}}>${amount} </span> to {receiver} on {monthNames[monthIndex]} {dayStr}, {yearStr}</p>
				</div>
			)
		})
	}

	state = {};
	colorScheme = "indigo";

	capitalizeFirstChar(text) {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	async componentDidMount() {
		const user = auth.getCurrentUser();
		const userAccounts = [...this.state.userAccounts];

		var userFirstName = this.capitalizeFirstChar(user.firstName);
		var userLastName = this.capitalizeFirstChar(user.lastName);

		let userAccountDetails = await getUserDetails(user._id);
		//console.log("User accounts: ", userAccountDetails); 
		if (userAccountDetails.data.checkingAccount) {
			userAccounts.push({ Name: userAccountDetails.data.checkingAccount.accountNumber, Type: "Checking", Balance: userAccountDetails.data.checkingAccount.balance });
		}
		if (userAccountDetails.data.savingAccount) {
			userAccounts.push({ Name: userAccountDetails.data.savingAccount.accountNumber, Type: "Savings", Balance: userAccountDetails.data.savingAccount.balance });
		}

		const { data: transactions } = await getUserTransactions();
		//console.log("Transactions:", transactions);

		const userUpcomingTransfers = [...this.state.userUpcomingTransfers];
		for (const [index, value] of transactions[0].checkingTrans[0].futureTrans.entries()) {
			//console.log("Transaction:", value);
			userUpcomingTransfers.push(value);
		}
		for (const [index, value] of transactions[0].savingTrans[0].futureTrans.entries()) {
			//console.log("Transaction:", value);
			// Ignore duplicate transfers (same transaction ID)
			if (userUpcomingTransfers.findIndex(obj => obj._id === value._id) === -1) userUpcomingTransfers.push(value);
		}
		/*
		for(const [index, value] of upcomingTransfers.entries()) {
			console.log("Filtered transfers:", value);
		}
		*/
		
		/* Update state */
		this.setState({ userFirstName, userLastName, userAccounts, userUpcomingTransfers }, () => {console.log("setState():", this.state.userUpcomingTransfers)});
	}

	render() {
		const { pageSize, currentPage, searchQuery } = this.state;
		//const { dataLength, data } = this.getTableData();
		const userFirstName = this.state.userFirstName;
		return (
			<div className="container">
				<div className="row justify-content-left">
					<h1 className="mt-4 mb-4">Hi {userFirstName}</h1>
				</div>
				<div className="row justify-content-left">
					<h4 className="mt-4 mb-4">Welcome to your dashboard</h4>
				</div>
				<div>
					<div style={{width: '50%', height: 'auto', float: 'left'}}>
						{this.renderAllAccountInfo()}
					</div>
					<div style={{width: '45%', height: 'auto', float: 'right', padding: '10px', margin: '10px', borderRadius: '25px', background: '#F9F9F9', border: '1px solid '+this.colorScheme}}>
						<div className="row justify-content-center">
							<h1 className="mt-4 mb-4">Upcoming Payments</h1>
							{this.renderUpcomingPayments()}
							<form action="transactions">
							<button className="mt-4 mb-4" style={{borderRadius: '32px', border: '1px solid '+this.colorScheme, padding: '12px'}}>
								<b style={{fontSize: '1.3em', color: this.colorScheme}}>View more payments</b>
							</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		)
	};
}

export default UserAccount;
