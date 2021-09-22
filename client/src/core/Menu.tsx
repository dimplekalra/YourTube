import React from "react";

import { auth } from "../common/utility";
import { Link, withRouter } from "react-router-dom";
import { ChildComponentProps } from "../containers/Nav";
import { IAcceptAll } from "../common/interfaces";

const isActive = (history: ChildComponentProps, path: string) => {
  if (history.location.pathname === path) return { color: "#f99085" };
  else return { color: "#efdcd5" };
};
const Menu: React.FC<IAcceptAll> = (props: IAcceptAll) => (
  <div className="navbar-fixed">
    <nav>
      <Link to="/" className="brand-logo left">
        <i className="material-icons prefix">ondemand_video</i>
        YourTube
      </Link>

      <a href="#" data-target="mobile-nav" className="sidenav-trigger">
        <i className="material-icons">menu</i>
      </a>

      <ul className="right hide-on-med-and-down">
        <li>
          <Link to="/users" style={isActive(props.history, "/users")}>
            Users
          </Link>
        </li>

        {!auth.isAuthenticated() && (
          <span>
            <li>
              <Link to="/signup" style={isActive(props.history, "/signup")}>
                Sign Up
                {/* <Button style={isActive(history, "/signup")}>Sign up</Button> */}
              </Link>
            </li>
            <li>
              <Link to="/signin" style={isActive(props.history, "/signin")}>
                Sign In
                {/* <Button style={isActive(history, "/signin")}>Sign In</Button> */}
              </Link>
            </li>
          </span>
        )}
        {auth.isAuthenticated() && (
          <span>
            <li>
              <Link
                to="/media/new"
                style={isActive(props.history, "/media/new")}
              >
                <i className="material-icons">
                  style={isActive(props.history, "/media/new")}playlist_add
                </i>
                {/* <Button style={isActive(history, "/media/new")}>
                <AddBoxIcon style={{ marginRight: "8px" }} /> Add Media
              </Button> */}
              </Link>
            </li>
            <li>
              <Link
                style={isActive(
                  props.history,
                  "/user/" + auth.isAuthenticated().user._id
                )}
                to={"/user/" + auth.isAuthenticated().user._id}
              >
                My Profile
                {/* <Button
                style={isActive(
                  history,
                  "/user/" + auth.isAuthenticated().user._id
                )}
              >
                My Profile
              </Button> */}
              </Link>
            </li>
            <li>
              <span
                color="inherit"
                onClick={() => {
                  auth.signOut(() => props.history.push("/"));
                }}
              >
                Sign out
              </span>
            </li>
          </span>
        )}
      </ul>
    </nav>

    <ul className="sidenav" id="mobile-nav">
      <li>
        <Link to="/users" style={isActive(props.history, "/users")}>
          Users
        </Link>
      </li>

      {!auth.isAuthenticated() && (
        <span>
          <li>
            <Link to="/signup" style={isActive(props.history, "/signup")}>
              Sign Up
            </Link>
          </li>
          <li>
            <Link to="/signin" style={isActive(props.history, "/signin")}>
              Sign In
            </Link>
          </li>
        </span>
      )}
      {auth.isAuthenticated() && (
        <span>
          <li>
            <Link to="/media/new" style={isActive(props.history, "/media/new")}>
              <i className="material-icons">
                style={isActive(props.history, "/media/new")}playlist_add
              </i>
            </Link>
          </li>
          <li>
            <Link
              style={isActive(
                props.history,
                "/user/" + auth.isAuthenticated().user._id
              )}
              to={"/user/" + auth.isAuthenticated().user._id}
            >
              My Profile
            </Link>
          </li>
          <li>
            <span
              color="inherit"
              onClick={() => {
                auth.signOut(() => props.history.push("/"));
              }}
            >
              Sign out
            </span>
          </li>
        </span>
      )}
    </ul>
  </div>
);

export default withRouter(Menu);
