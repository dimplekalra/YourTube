import React, { Component } from "react";
import { auth } from "../../../common/utility";
import { read, update } from "../../../common/api/user";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "../../../common/validateInputs";
import Input from "../../../controls/Input";
import stateContext from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import { IAcceptAll } from "../../../common/interfaces";

interface IState {
  fullName: string;
  password: string;
  email: string;
  authError: string;

  isError: boolean;
  errors: {
    fullName: string;
    password: string;
    email: string;
  };
}

type TParams = { userId: string };
class EditProfile extends Component<
  IAcceptAll & RouteComponentProps<TParams>,
  IState
> {
  state = {
    fullName: "",
    password: "",
    email: "",
    authError: "",

    isError: false,
    errors: {
      fullName: "",
      password: "",
      email: "",
    },
  };
  match = this.props.match;

  static contextType = stateContext;

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    switch (name) {
      case "password": {
        this.setState({
          password: value,
        });
        break;
      }
      case "email": {
        this.setState({
          email: value,
        });
        break;
      }
      case "fullName": {
        this.setState({
          fullName: value,
        });
        break;
      }

      default:
        return;
    }
  };

  handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;
    const errors = this.state.errors;
    let isError = false;

    switch (name) {
      case "fullName": {
        const { error, message } = validateName(value);
        if (error) {
          errors.fullName = message;
          isError = true;
        } else {
          errors.fullName = "";
        }
        break;
      }
      case "email": {
        const { error, message } = validateEmail(value);
        if (error) {
          errors.email = message;
          isError = true;
        } else {
          errors.email = "";
        }
        break;
      }
      case "password": {
        const { error, message } = validatePassword(value);

        if (error) {
          errors.password = message;
          isError = true;
        } else {
          errors.password = "";
        }
        break;
      }
      default:
        return;
    }

    this.setState({ errors, isError: isError });
  };

  fetchUser: () => Promise<void> = async () => {
    try {
      const { userId } = this.match.params;
      const jwt = auth.isAuthenticated();

      if (!jwt) this.props.history.push("/signin");

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: true,
      });

      const data = await read({ userId }, { t: jwt.token });

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: false,
        FailMessage: "",
      });

      if (data) {
        this.setState({ fullName: data.name, email: data.email });
      } else throw new Error("Could not read User please try again latter");
    } catch (error: any) {
      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: true,
        FailMessage: error.message,
      });
      this.setState({ authError: error.message });
    }
  };

  componentDidMount() {
    this.context.init("user");
    this.fetchUser();
  }

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { email, password, fullName } = this.state;
    const user = {
      email: email || undefined,
      password: password || undefined,
      name: fullName || undefined,
    };

    if (
      validateName(fullName).error ||
      validateEmail(email).error
      //  || validatePassword(password).error
    ) {
      alert("Please fill out the Form Properly");
      return;
    } else {
      try {
        const jwt = auth.isAuthenticated();
        if (!jwt) throw new Error("User is not authenticated");

        this.context.setAPIState({
          ...this.context.APIStatus,
          InProgress: true,
        });

        const result = await update(
          {
            userId: this.match.params.userId,
          },
          {
            t: jwt.token,
          },
          user
        );

        this.context.setAPIState({
          ...this.context.APIStatus,
          InProgress: false,
          Failed: false,
          FailMessage: "",
        });

        if (result.error) this.setState({ authError: result.error });
        else this.setState({ authError: "" });

        this.setState({
          email: "",
          fullName: "",
          password: "",

          isError: false,
        });

        this.props.history.push("/");
      } catch (error: any) {
        this.setState({
          email: "",
          fullName: "",
          password: "",
          isError: true,
        });
        this.context.setAPIState({
          ...this.context.APIStatus,
          InProgress: false,
          Failed: true,
          FailMessage: error.message,
        });
      }
    }
  };

  render() {
    const {
      fullName,
      email,
      password,
      authError,
      errors,

      isError,
    } = this.state;

    const { APIStatus } = this.context;

    return (
      <div className="row">
        <div className="col s12 ">
          <div className="row">
            <div className="col s12 m6 offset-m3">
              <form
                action=""
                className="card form"
                onSubmit={this.handleSubmit}
              >
                <div className="card-content ">
                  <div className="card-title">
                    <h3 className="center-align">Edit User</h3>
                  </div>

                  {APIStatus.InProgress ? (
                    <div className="col s12 center-align">
                      <Loader />
                    </div>
                  ) : null}

                  <div className="row">
                    <div className="col s12 input-field">
                      <Input
                        type="text"
                        onChange={this.handleChange}
                        name="fullName"
                        id="Full Name"
                        value={fullName}
                        important={true}
                        onBlur={this.handleBlur}
                        disabled={APIStatus.InProgress}
                        error={errors.fullName}
                        icon="person"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 input-field">
                      <Input
                        type="email"
                        onChange={this.handleChange}
                        name="email"
                        id="Email"
                        value={email}
                        important={true}
                        disabled={APIStatus.InProgress}
                        onBlur={this.handleBlur}
                        error={errors.email}
                        icon="email"
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 input-field">
                      <Input
                        type="password"
                        onChange={this.handleChange}
                        name="password"
                        id="Password"
                        value={password}
                        important={false}
                        // onBlur={this.handleBlur}
                        error={errors.password}
                        icon="security"
                        disabled={true || APIStatus.InProgress}
                      />
                    </div>
                  </div>

                  {authError || authError.trim().length ? (
                    <p className="red-text center">{authError}</p>
                  ) : null}
                </div>
                <div className="card-action">
                  <div className="row center">
                    <button
                      className="btn waves-effect waves-light submit red "
                      type="submit"
                      disabled={isError || APIStatus.InProgress}
                    >
                      Submit
                      {/* <i className="material-icons right">send</i> */}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default withRouter(EditProfile);
