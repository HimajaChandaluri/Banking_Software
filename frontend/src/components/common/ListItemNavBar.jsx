import React from "react";
import { NavLink } from "react-router-dom";

const ListItemNabBar = ({ iconClass, label, path }) => {
  iconClass = iconClass + " fa-navbar-icons";
  return (
    <li className="nav-item px-3 text-nowrap">
      <i className={iconClass} style={{ float: "left" }} aria-hidden="true"></i>

      <NavLink className="nav-link" to={path}>
        {label}
      </NavLink>
    </li>
  );
};

export default ListItemNabBar;
