import React from "react";
import { Route, Redirect } from "react-router-dom";
import { loggedIn, user, admin } from "../../services/authService";

const UserRoute = ({ path, component: Component, render, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        if (loggedIn && user && !admin)
          return Component ? <Component {...props}></Component> : render(props);
        else if (admin) return <h1>Forbidden</h1>;
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

export default UserRoute;
