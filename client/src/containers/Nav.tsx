import React from "react";
import { auth } from "../common/utility";
import {
  Link,
  withRouter,
  NavLink,
  useHistory,
  RouteComponentProps,
} from "react-router-dom";
import { IAcceptAll } from "../common/interfaces";

export interface ChildComponentProps extends RouteComponentProps<any> {}

const isActive = (history: ChildComponentProps, path: string) => {
  if (history.location.pathname === path) return { color: "#f99085" };
  else return { color: "#efdcd5" };
};

const Navbar: React.FC<IAcceptAll> = (props: IAcceptAll) => {
  const history = useHistory();
  return (
    <div className="row navbar">
      <div className="col">
        <div className="full-height">
          <nav>
            <div className="logo-sec">
              <Link to="/" className="brand-logo">
                <i className="material-icons prefix">ondemand_video</i>
                YourTube
              </Link>
            </div>
            {/* <a href="#" data-target="mobile-nav" className="sidenav-trigger">
        <i className="material-icons">menu</i>
      </a> */}
            <div className="side-nav">
              <ul className="right ">
                {/* <li>
                <NavLink
                  to="/users"
                  activeStyle={isActive(props.history, "/users")}
                >
                  Users
                </NavLink>
              </li> */}

                {!auth.isAuthenticated() ? (
                  <span>
                    <li className="signout pad-top">
                      <NavLink
                        to="/signup"
                        activeStyle={isActive(props.history, "/signup")}
                      >
                        Sign Up
                      </NavLink>
                    </li>
                    <li className="signin pad-top">
                      <NavLink
                        to="/signin"
                        activeStyle={isActive(props.history, "/signin")}
                      >
                        Sign In
                      </NavLink>
                    </li>
                  </span>
                ) : null}
                {auth.isAuthenticated() && auth.isAuthenticated().user ? (
                  <span>
                    <li>
                      <NavLink
                        to="/media/new"
                        activeStyle={isActive(props.history, "/media/new")}
                      >
                        <i className="material-icons">
                          {/* style={isActive(props.history, "/media/new")} */}
                          playlist_add
                        </i>
                        <span>Add</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        to="/media/list"
                        activeStyle={isActive(props.history, "/media/new")}
                      >
                        <i className="material-icons">
                          {/* style={isActive(props.history, "/media/new")} */}
                          list
                        </i>
                        <span>List</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        to={`/media/by/${auth.isAuthenticated().user._id}`}
                        activeStyle={isActive(props.history, "/media/new")}
                      >
                        <i className="material-icons">
                          {/* style={isActive(props.history, "/media/new")} */}
                          file_upload
                        </i>
                        <span>Uploads</span>
                      </NavLink>
                    </li>

                    <li>
                      <NavLink
                        activeStyle={isActive(
                          props.history,
                          "/user/" + auth.isAuthenticated().user._id
                        )}
                        to={"/user/" + auth.isAuthenticated().user._id}
                      >
                        My
                        <br /> Profile
                      </NavLink>
                    </li>
                    <li>
                      <span
                        color="inherit"
                        onClick={() => {
                          auth.signOut(() => history.push("/signin"));
                        }}
                      >
                        Sign out
                      </span>
                    </li>
                  </span>
                ) : null}
              </ul>
            </div>
          </nav>

          <ul className="sidenav" id="mobile-nav">
            <li>
              <Link to="/users" style={isActive(props.history, "/users")}>
                Users
              </Link>
            </li>

            {!auth.isAuthenticated() ? (
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
            ) : null}
            {auth.isAuthenticated() && auth.isAuthenticated().user ? (
              <span>
                <li>
                  <Link
                    to="/media/new"
                    style={isActive(props.history, "/media/new")}
                  >
                    <i
                      className="material-icons"
                      style={isActive(props.history, "/media/new")}
                    >
                      playlist_add
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
                      auth.signOut(() => history.push("/"));
                    }}
                  >
                    Sign out
                  </span>
                </li>
              </span>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Navbar);
