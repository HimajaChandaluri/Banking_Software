import React from "react";
import auth from "../services/authService";
import ListItemSideBar from "./common/ListItemSideBar";
import logo from "../images/teamLogo.png";
// import "../styles/sidebar.css";

const SideBar = () => {
  const user = auth.getCurrentUser();
  console.log("Got user data again in ADMIN ROUTE: ", user);

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <li className="side-nav-item">
            <img
              src={logo}
              alt="LOGO"
              style={{
                width: "100%",
                marginLeft: "10px",
                marginTop: "40px",
              }}
            ></img>
          </li>

          {user && user.isAdmin && (
            <React.Fragment>
              <ListItemSideBar
                iconClass="fa fa-credit-card"
                label="Create Account"
                path="/createAccount"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-window-close"
                label="Close Account"
                path="/closeAccount"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-exchange"
                label="Manual Transfer"
                path="/manualTransfer"
              ></ListItemSideBar>
              {/* <ListItemSideBar
                iconClass="fa fa-cog"
                label="Settings"
                path="/adminSettings"
              ></ListItemSideBar> */}
            </React.Fragment>
          )}
          {user && !user.isAdmin && (
            <React.Fragment>
              <ListItemSideBar
                iconClass="fa fa-credit-card"
                label="Accounts"
                path="/accounts"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-list-ul"
                label="Transactions"
                path="/transactions"
              ></ListItemSideBar>
              <ListItemSideBar
                iconClass="fa fa-exchange"
                label="Transfers"
                path="/newTransfer"
              ></ListItemSideBar>
              {/* <ListItemSideBar
                iconClass="fa fa-cog"
                label="Settings "
                path="/userSettings"
              ></ListItemSideBar> */}
            </React.Fragment>
          )}
          {/* <ListItemSideBar
            iconClass="fa fa-mobile"
            label="Contact Us"
            path="/home"
          ></ListItemSideBar> */}
        </ul>
      </div>
    </nav>
  );
};

export default SideBar;
