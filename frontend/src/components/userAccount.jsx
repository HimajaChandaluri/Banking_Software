import React, { Component } from "react";

class UserAccount extends Component {
  constructor(props) {
	super(props);
	this.state = {
		users: [
			{ Name: "XXXXXX1234", Type: "Checking", Balance: "$100" },
			{ Name: "XXXXXX2345", Type: "Savings", Balance: "$500" },
		]
	}
  }

	renderTableHeader(){
		let header = Object.keys(this.state.users[0])
		return header.map((key, index) => {
			return <th key={index}>{key.toUpperCase()}</th>
		})
	}

	renderTableData() {
		return this.state.users.map((user, index) => {
			const { Name, Type, Balance } = user
			return (
				<tr key={Name}>
					<td>{Name}</td>
					<td>{Type}</td>
					<td>{Balance}</td>
				</tr>
			)
		})
	}

	state = {};
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
