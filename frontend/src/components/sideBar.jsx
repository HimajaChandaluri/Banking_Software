import React from "react";
import { loggedIn, user, admin } from "../services/authService";
import ListItemSideBar from "./common/ListItemSideBar";
// import "../styles/sidebar.css";

const SideBar = () => {
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="side-nav-item">
            <img src="../images/logo.png" alt="LOGO"></img>
          </li>

          {loggedIn && user && admin && (
            <React.Fragment>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="Create Account"
                active="true"
                path="./createAccount"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="CloseAccount"
                path="./closeAccount"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="Manual Transfer"
                path="/manualTransfer"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="Settings"
                path="/adminSettings"
              ></ListItemSideBar>
            </React.Fragment>
          )}
          {loggedIn && user && !admin && (
            <React.Fragment>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="Accounts"
                path="/accounts"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="Transactions"
                path="/transactions"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="Transfers"
                path="/transfer"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-user-circle-o"
                label="Settings "
                path="/userSettings"
              ></ListItemSideBar>
            </React.Fragment>
          )}
          <ListItemSideBar
            iconClass="fa fa-user-circle-o"
            label="Contact Us"
            path="/home"
          ></ListItemSideBar>
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;
