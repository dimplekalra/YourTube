import React, { Component } from "react";

import DeleteUser from "./DeleteUser";
import { auth } from "../../../common/utility";

import { read } from "../../../common/api/user";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";
import stateContext from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import { IAcceptAll, IUser } from "../../../common/interfaces";

interface IState {
  user: IUser;
  redirectToSignin: boolean;
}

type TParams = { userId: string };

class Profile extends Component<
  IAcceptAll & RouteComponentProps<TParams>,
  IState
> {
  state = {
    user: { createdAt: "", email: "", name: "", updatedAt: "", _id: "" },
    redirectToSignin: false,
  };
  match = this.props.match;

  static contextType = stateContext;

  init = async (userId?: string | number): Promise<void> => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) this.props.history.push("/signin");

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: true,
      });

      if (!userId) {
        throw new Error("User Not Found");
      }

      const data = await read(
        {
          userId: userId,
        },
        { t: jwt.token }
      );

      this.context.setAPIState({
        ...this.context.APIStatus,
        Failed: false,
        FailMessage: "",
        InProgress: false,
      });

      if (!data) {
        throw new Error("could not load user");
      }

      this.setState({ user: data });
    } catch (error: any) {
      this.context.setAPIState({
        ...this.context.APIStatus,
        Failed: true,
        FailMessage: error.message,
        InProgress: false,
      });
    }
  };
  // componentWillReceiveProps(props) {
  //   this.init(props.match.params.userId);
  // }
  componentDidMount() {
    this.context.init("user");

    if (this.match.params) {
      this.init(this.match.params.userId);
    }
  }
  render() {
    const redirectToSignin = this.state.redirectToSignin;
    if (redirectToSignin) {
      return <Redirect to="/signin" />;
    }

    const { user } = this.state;

    const { APIStatus } = this.context;

    const isAuth = auth.isAuthenticated();

    return (
      <>
        <div className="row user-profile-sec">
          <div className="col s12 ">
            {APIStatus.InProgress ? (
              <div className="col s12 center-align">
                <Loader />
              </div>
            ) : (
              <div className=" card">
                <div className="card-image">
                  <img src={`${process.env.PUBLIC_URL}/person.png`} alt="" />
                </div>
                <div className="card-content">
                  {!user ? null : (
                    <>
                      <span className="card-title grey-text darken-4">
                        {user.name}
                      </span>
                      <p className="flow-text">{user.email}</p>
                      <h6 className="grey-text darken-3">
                        {"Joined on " + new Date(user.createdAt).toDateString()}
                      </h6>
                    </>
                  )}
                </div>
                <div className="card-action">
                  {isAuth &&
                  isAuth.user &&
                  isAuth.user._id === (user ? user._id : null) ? (
                    <div className="row center-align">
                      <div className="col">
                        <button
                          onClick={() =>
                            this.props.history.push(`/user/edit/${user._id}`)
                          }
                          className="btn-floating edit-button waves-effect waves-light"
                        >
                          {<i className="material-icons">edit</i>}
                        </button>
                      </div>
                      <div className="col del-btn">
                        <DeleteUser userId={user._id} />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default withRouter(Profile);
