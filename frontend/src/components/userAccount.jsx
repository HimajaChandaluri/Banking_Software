import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import { getUserDetails } from "../services/userService";

class UserAccount extends Component {
  constructor(props) {
	super(props);
	this.state = {
		userFirstName: "Firstname",
		userLastName: "Lastname",
		userAccounts: []
	}
  }

	renderTableHeader(){
		if(!this.state.userAccounts || this.state.userAccounts.length <= 0) return null;
		let header = Object.keys(this.state.userAccounts[0])
		return header.map((key, index) => {
			return <th key={index}>{key.toUpperCase()}</th>
		})
	}

	renderTableData() {
		return this.state.userAccounts.map((user, index) => {
			const { Name, Type, Balance } = user;
			let accountNameHidden = "XXXX" + (Name).toString().slice(4);
			// console.log("TEST::", accountNameHidden);
			return (
				<tr key={Name}>
					<Link to={{
						pathname: "transactions",
						state: {
							account: Name
						}
					}}>{accountNameHidden}</Link>
					<td>{Type}</td>
					<td>${Balance}</td>
				</tr>
			)
		})
	}

	renderAllAccountInfo() {
		return this.state.userAccounts.map((user, index) => {
			const { Name, Type, Balance } = user;
			let accountNameHidden = "XXXX" + (Name).toString().slice(4);
			return (
				<Link to={{pathname: "transactions", state: {account: Name}}}> 
				<div style={{width: 'auto', padding: '10px', margin: '10px', borderRadius: '25px', background: '#EEEEEE', color: '#222222'}}>
					<h2>{Type} Account</h2>
					<h4>{accountNameHidden}</h4>
					<h3 style={{color:'purple'}}>${Balance}</h3>
				</div>
				</Link>
			)
		})
	}

	renderUpcomingPayments() {
		return (
			<div className="row justify-content-center">
				<h2 className="mt-4 mb-4">Upcoming Payments</h2>
			</div>
		)
	}

	state = {};

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
		
		/* Update state */
		this.setState({ userFirstName, userLastName, userAccounts });
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
					<div style={{width: '45%', height: 'auto', float: 'right', padding: '10px', margin: '10px', borderRadius: '25px', background: '#EEEEEE'}}>
						{this.renderUpcomingPayments()}
					</div>
				</div>
			</div>
		)
	};
}

export default UserAccount;
