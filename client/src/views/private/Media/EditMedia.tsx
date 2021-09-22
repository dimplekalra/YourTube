import React, { Component } from "react";
import { auth } from "../../../common/utility";
import { read, update } from "../../../common/api/media";

import { withRouter, RouteComponentProps } from "react-router-dom";
import { validateEmptyFields } from "../../../common/validateInputs";
import Loader from "../../../controls/Loader";
import stateContext from "../../../context/state-context";
import { IAcceptAll, IMedia, TParams } from "../../../common/interfaces";
import Input from "../../../controls/Input";

interface IState {
  media: IMedia;
  redirect: boolean;
  mediaError: string;
  isError: boolean;
  errors: {
    title: string;
    genre: string;
  };
}

class EditMedia extends Component<
  IAcceptAll & RouteComponentProps<TParams>,
  IState
> {
  state = {
    media: {
      createdAt: "",
      description: "",
      genre: "",
      postedBy: {
        _id: "",
        name: "",
      },
      title: "",
      updatedAt: "",
      views: 0,
      _id: "",
    },
    redirect: false,
    mediaError: "",
    isError: false,

    errors: {
      title: "",
      genre: "",
    },
  };

  static contextType = stateContext;

  fetchMedia = async () => {
    try {
      const { mediaId } = this.props.match.params;
      const jwt = auth.isAuthenticated();

      if (!jwt) this.props.history.push("/signin");

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: true,
      });

      const data = await read({ mediaId });
      if (data) {
        this.setState({ media: data });
      } else throw new Error("Could not load Media please try again later");

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
      });
    } catch (error: any) {
      console.log(error.message);
      this.setState({
        mediaError: error.message,
      });
      this.context.setAPIState({
        Failed: true,
        InProgress: false,
        FailMessage: error.message,
      });
    }
  };

  handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;
    const errors = this.state.errors;
    let isError = false;

    switch (name) {
      case "title": {
        const { error, message } = validateEmptyFields(name, value);
        if (error) {
          errors.title = message;
          isError = true;
        } else {
          errors.title = "";
        }
        break;
      }
      case "genre": {
        const { error, message } = validateEmptyFields(name, value);
        if (error) {
          errors.genre = message;
          isError = true;
        } else {
          errors.genre = "";
        }
        break;
      }
      default:
        return;
    }

    this.setState({ errors, isError: isError });
  };

  componentDidMount() {
    this.context.init("media");
    this.fetchMedia();
  }

  clickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { media } = this.state;
      const { title, genre } = media;

      if (
        validateEmptyFields("title", title).error ||
        validateEmptyFields("genre", genre).error
      ) {
        alert("Please fill out the Fields Properly");
        return;
      }

      const jwt = auth.isAuthenticated();
      if (!jwt) throw new Error("User is not authenticated");

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: true,
      });

      const data = await update(
        {
          mediaId: this.state.media._id,
        },
        {
          t: jwt.token,
        },
        this.state.media
      );

      if (!data) throw new Error("could not update video");

      this.setState({
        mediaError: "",
        redirect: true,
        media: data,
      });

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: false,
        FailMessage: "",
      });

      this.props.history.push(`/media/${this.state.media._id}`);
    } catch (error: any) {
      this.setState({
        mediaError: error.message,
      });
      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: true,
        FailMessage: error.message,
      });
    }
  };

  handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    let updatedMedia = this.state.media;

    switch (name) {
      case "title": {
        updatedMedia.title = value;
        break;
      }
      case "genre": {
        updatedMedia.genre = value;
        break;
      }
      case "description": {
        updatedMedia.description = value;
        break;
      }

      default:
        return;
    }
    this.setState({ media: updatedMedia });
  };
  render() {
    const { media, errors, mediaError, isError } = this.state;

    const { APIStatus } = this.context;

    return (
      <main className="section row">
        <div className="col s12 m6 offset-m3">
          {APIStatus.InProgress ? (
            <div className="row ">
              <div className="col s12 center-align ">
                <Loader />
              </div>
            </div>
          ) : (
            <form className="card" onSubmit={this.clickSubmit}>
              <div className="card-title">
                <h2 className="center-align grey-text">Edit Video Details</h2>
              </div>
              <div className="card-content">
                <div className="row">
                  <div className="col s12 input-field">
                    <Input
                      type="text"
                      onChange={this.handleChange}
                      name="title"
                      id="Title"
                      value={media.title}
                      important={true}
                      onBlur={this.handleBlur}
                      error={errors.title}
                      icon="title"
                      disabled={APIStatus.InProgress}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col s12 input-field">
                    <i className="material-icons prefix">description</i>
                    <textarea
                      id="description"
                      rows={2}
                      onChange={this.handleChange}
                      name="description"
                      value={media.description}
                      className="materialize-textarea"
                      disabled={APIStatus.InProgress}
                    ></textarea>
                    <label htmlFor="description">Description</label>
                  </div>
                </div>

                <div className="row">
                  <div className="col s12 input-field">
                    <Input
                      type="text"
                      onChange={this.handleChange}
                      name="genre"
                      id="Genre"
                      value={media.genre}
                      important={true}
                      onBlur={this.handleBlur}
                      error={errors.genre}
                      icon="video_library"
                      disabled={APIStatus.InProgress}
                    />
                  </div>
                </div>

                {mediaError && mediaError.trim().length ? (
                  <p className="red-text center">{mediaError}</p>
                ) : null}
              </div>
              <div className="card-action">
                <div className="row">
                  <button
                    className="btn waves-effect waves-light submit red center right"
                    type="submit"
                    disabled={isError || APIStatus.InProgress}
                  >
                    Update
                    <i className="material-icons right">send</i>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    );
  }
}

export default withRouter(EditMedia);
