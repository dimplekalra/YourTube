import React, { Component } from "react";
// import { create } from "../../common/api/user";
import { create } from "../../common/api/user";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import Input from "../../controls/Input";
import {
  validateName,
  validatePassword,
  validateConfirmPassword,
  validateEmail,
} from "../../common/validateInputs";
import stateContext from "../../context/state-context";
import Loader from "../../controls/Loader";
import { IAcceptAll } from "../../common/interfaces";

interface IState {
  fullName: string;
  password: string;
  email: string;
  confirmPassword: string;
  open: boolean;
  isError: boolean;
  authError: string;
  errors: {
    fullName: string;
    password: string;
    email: string;
    confirmPassword: string;
  };
}

class Signup extends Component<IAcceptAll & RouteComponentProps, IState> {
  state = {
    fullName: "",
    password: "",
    email: "",
    authError: "",
    confirmPassword: "",
    open: false,

    isError: false,
    errors: {
      fullName: "",
      password: "",
      email: "",

      confirmPassword: "",
    },
  };

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
      case "confirmPassword": {
        this.setState({
          confirmPassword: value,
        });
        break;
      }
      default:
        return;
    }
  };

  handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
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
      case "confirmPassword": {
        const { error, message } = validateConfirmPassword(
          this.state.password,
          value
        );
        if (error) {
          errors.confirmPassword = message;
          isError = true;
        } else {
          errors.confirmPassword = "";
        }
        break;
      }
      default:
        return;
    }

    this.setState({ errors, isError: isError });
  };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const { email, password, fullName, confirmPassword } = this.state;
    const user = {
      email,
      password,
      name: fullName,
    };

    if (
      validateName(fullName).error ||
      validateEmail(email).error ||
      validatePassword(password).error ||
      validateConfirmPassword(password, confirmPassword).error
    ) {
      alert("Please fill out the Form Properly");
    } else {
      try {
        this.context.setAPIState({
          ...this.context.APIStatus,
          InProgress: true,
        });
        const result = await create(user);

        this.context.setAPIState({
          ...this.context.APIStatus,
          Failed: false,
          FailMessage: "",
          InProgress: false,
        });

        if (result.error) throw new Error(result.error);
        else this.setState({ authError: "", open: true });

        this.setState({
          email: "",
          fullName: "",
          password: "",

          confirmPassword: "",
          isError: false,
        });

        this.props.history.push("/signin");
      } catch (error: any) {
        this.setState({
          email: "",
          fullName: "",
          password: "",
          authError: error.message,
          confirmPassword: "",
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
      confirmPassword,
      isError,
    } = this.state;

    const { APIStatus } = this.context;

    return (
      <div className="row">
        <div className="col s12">
          <div className="row">
            <div className="col s12 m6 offset-m3">
              <form
                action=""
                className="card form"
                onSubmit={this.handleSubmit}
              >
                <div className="card-content ">
                  <div className="card-title">
                    <h3 className="center-align">Sign up</h3>
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
                        error={errors.fullName}
                        icon="person"
                        disabled={APIStatus.InProgress}
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
                        onBlur={this.handleBlur}
                        error={errors.email}
                        icon="email"
                        disabled={APIStatus.InProgress}
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
                        important={true}
                        onBlur={this.handleBlur}
                        error={errors.password}
                        icon="security"
                        disabled={APIStatus.InProgress}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col s12 input-field">
                      <Input
                        type="password"
                        onChange={this.handleChange}
                        name="confirmPassword"
                        id="Confirm Password"
                        value={confirmPassword}
                        important={true}
                        onBlur={this.handleBlur}
                        error={errors.confirmPassword}
                        icon="verified_user"
                        disabled={APIStatus.InProgress}
                      />
                    </div>
                  </div>

                  {authError || authError.trim().length ? (
                    <p className="red-text center">{authError}</p>
                  ) : null}
                </div>
                <div className="card-action">
                  <div className="row align center">
                    <button
                      className="btn waves-effect waves-light submit"
                      type="submit"
                      disabled={isError || this.context.APIStatus.InProgress}
                    >
                      Submit
                      {/* <i className="material-icons right">send</i> */}
                    </button>
                  </div>

                  <p className="center new-user-sign">
                    Existing User? <Link to="/signin">Login</Link>here
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);
