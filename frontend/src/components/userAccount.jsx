import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";
import { getUserDetails } from "../services/userService";

class UserAccount extends Component {
  constructor(props) {
	super(props);
	this.state = {
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

	state = {};

	async componentDidMount() {
		const user = auth.getCurrentUser();
		const userAccounts = [...this.state.userAccounts];

		let userAccountDetails = await getUserDetails(user._id);
		/* console.log("User accounts: ", userAccountDetails); */
		if (userAccountDetails.data.checkingAccount) {
			userAccounts.push({ Name: userAccountDetails.data.checkingAccount.accountNumber, Type: "Checking", Balance: userAccountDetails.data.checkingAccount.balance });
		}
		if (userAccountDetails.data.savingAccount) {
			userAccounts.push({ Name: userAccountDetails.data.savingAccount.accountNumber, Type: "Savings", Balance: userAccountDetails.data.savingAccount.balance });
		}
		
		/* Update state */
		this.setState({ userAccounts });
	}

	render() {
		return (
			<div className="container">
				<h3>Accounts</h3>
				<div>
					<table id="users">
						<tbody>
						<tr>{this.renderTableHeader()}</tr>
							{this.renderTableData()}
						</tbody>
					</table> 
				</div>
			</div>
		)
	};
}

export default UserAccount;
