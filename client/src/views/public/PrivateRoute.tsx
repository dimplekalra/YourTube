import React from "react";
import { Route, Redirect } from "react-router-dom";
import { IAcceptAll } from "../../common/interfaces";
import { auth } from "../../common/utility";
const PrivateRoute: React.FC<IAcceptAll> = ({ Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      auth.isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/signin",
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default PrivateRoute;
