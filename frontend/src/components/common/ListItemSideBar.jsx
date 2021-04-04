import React, { Component } from "react";
import "../../styles/sidebar.css";
import { NavLink } from "react-router-dom";

class ListItemSideBar extends Component {
  renderClasses = (label, active) => {
    let defaultClasses = "sidebar-nav-item";

    if (label === "Contact Us") {
      defaultClasses += " bottom-sidebar-nav-item";
    }
    return defaultClasses;
  };

  renderActiveOrInactiveNavLinkClass = (active) => {
    let defaultClasses = "nav-link";

    if (active === "true") {
      defaultClasses += " active";
    }
    return defaultClasses;
  };

  render() {
    let { iconClass, label, path, active = "false" } = this.props;

    iconClass = iconClass + " fa-sidebar-icons";

    return (
      <li className={this.renderClasses(label, active)}>
        <i
          className={iconClass}
          style={{ float: "left" }}
          aria-hidden="true"
        ></i>
        <NavLink
          className={this.renderActiveOrInactiveNavLinkClass(active)}
          to={path}
        >
          <span data-feather="bar-chart-2"></span>
          {label}
        </NavLink>
      </li>
    );
  }
}

export default ListItemSideBar;
