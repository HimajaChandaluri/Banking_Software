import React from "react";
import { Link } from "react-router-dom";
import { loggedIn, user, admin } from "../services/authService";
import ListItemNavBar from "./common/ListItemNavBar";
import "../styles/navbar.css";

const NavBar = () => {
  return (
    <nav
      className="navbar navbar-dark fixed-top flex-md-nowrap p-10 shadow navbar-expand-md"
      style={{ backgroundColor: "#6930c3" }}
    >
      <Link className="navbar-brand col-sm-3 col-md-2 mr-0" to="/">
        Company name
      </Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav px-3 ml-auto">
          {!user && (
            <ListItemNavBar
              iconClass="fa fa-sign-out"
              label="Login"
              path="/login"
            ></ListItemNavBar>
            // <li className="nav-item text-nowrap">
            //   <a className="nav-link" href="#">
            //     Login
            //   </a>
            // </li>
          )}
          {user && (
            <React.Fragment>
              <ListItemNavBar
                iconClass="fa fa-user-circle-o"
                label="Profile"
                path="/"
              ></ListItemNavBar>
              <ListItemNavBar
                iconClass="fa fa-sign-out"
                label="Sign Out"
                path="/"
              ></ListItemNavBar>
            </React.Fragment>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
