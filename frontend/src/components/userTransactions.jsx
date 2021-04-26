import React, { Component } from "react";
import "../App.css";

class UserTransactions extends Component {
  constructor(props) {
    super(props) //since we are extending class Table so we have to use super in order to override Component class constructor
    this.state = { //state is by default an object
       users: [
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
  let header = Object.keys(this.state.users[0])
  return header.map((key, index) => {
     return <th key={index}>{key.toUpperCase()}</th>
  })
}
 renderTableData() {
  return this.state.users.map((user, index) => {
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
  render() {
	var { account="" } = this.props.location.state || {};
	let accountNameHidden = "XXXX" + (account).toString().slice(4);
	if(accountNameHidden === ""){
		// TODO: Replace with primary checking account
		accountNameHidden = "Primary Checking";
	}
    return (
    <div className="container">
      <div className="row justify-content-center">
          <h1 className="mt-4 mb-4">Account {accountNameHidden}</h1>
      </div>
      <h3>Summary</h3>
      <h2>Available Balance (as of today):  900$</h2><br></br>
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
