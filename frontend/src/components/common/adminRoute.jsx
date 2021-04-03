import React from "react";
import { Route, Redirect } from "react-router-dom";
import { loggedIn, user, admin } from "../../services/authService";

const AdminRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        if (loggedIn && user && admin)
          return Component ? <Component {...props}></Component> : render(props);
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          ></Redirect>
        );
      }}
    ></Route>
  );
};

export default AdminRoute;
