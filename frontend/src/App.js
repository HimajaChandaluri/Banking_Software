import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import UserRoute from "./components/common/userRoute";
import AdminRoute from "./components/common/adminRoute";

import Home from "./components/home";
import UserAccount from "./components/userAccount";
import UserTransactions from "./components/userTransactions";
import CreateAccount from "./components/createAccount";
import CloseAccount from "./components/closeAccount";
import ManualTransfer from "./components/manualTransfer";
import AdminSettings from "./components/adminSettings";
import Transfer from "./components/transfer";
import UserSettings from "./components/userSettings";
import NewTransfer from "./components/newTransfer";
import SideBar from "./components/sideBar";
import NavBar from "./components/navBar";
import Logout from "./components/logout";
import Login from "./components/Login";

import "./App.css";

class App extends Component {
  state = {};

  render() {
    return (
      <React.Fragment>
        <NavBar></NavBar>
        <div className="container-fluid">
          <div className="row">
            <SideBar></SideBar>
            <main role="main" className="col-md-8 ml-sm-auto col-lg-10">
              <Switch>
                <Route path="/home" component={Home}></Route>
                <UserRoute path="/accounts" component={UserAccount}></UserRoute>
                <UserRoute
                  path="/transactions"
                  component={UserTransactions}
                ></UserRoute>
                <UserRoute
                  path="/newTransfer"
                  component={NewTransfer}
                ></UserRoute>
                <UserRoute
                  path="/userSettings"
                  component={UserSettings}
                ></UserRoute>
                <AdminRoute
                  path="/createAccount"
                  component={CreateAccount}
                ></AdminRoute>
                <AdminRoute
                  path="/closeAccount"
                  component={CloseAccount}
                ></AdminRoute>
                <AdminRoute
                  path="/manualTransfer"
                  component={ManualTransfer}
                ></AdminRoute>
                <AdminRoute
                  path="/adminSettings"
                  component={AdminSettings}
                ></AdminRoute>
                <Route path="/login" component={Login}></Route>
                <Route path="/logout" component={Logout}></Route>
                <Redirect from="/" exact to="/home"></Redirect>
              </Switch>
            </main>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
