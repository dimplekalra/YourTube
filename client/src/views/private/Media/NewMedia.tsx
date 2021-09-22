import React, { Component } from "react";
import { auth } from "../../../common/utility";

// import { create } from "../../../common/api/media";
import { create } from "../../../common/api/media";
import Input from "../../../controls/Input";
import {
  validateEmptyFields,
  validateFiles,
} from "../../../common/validateInputs";
import { withRouter, RouteComponentProps } from "react-router-dom";
import stateContext from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import { IAcceptAll } from "../../../common/interfaces";

interface IState {
  title: string;
  isError: boolean;
  video: File | Blob | null;
  description: string;
  genre: string;
  redirect: boolean;
  error: string;
  mediaId: string | number;
  errors: {
    title: string;
    genre: string;
  };
}

class NewMedia extends Component<IAcceptAll & RouteComponentProps, IState> {
  state = {
    title: "",
    isError: false,
    video: null,
    description: "",
    genre: "",
    redirect: false,
    error: "",
    mediaId: "",
    errors: {
      title: "",
      genre: "",
    },
  };

  mediaData: any;

  static contextType = stateContext;

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
    this.mediaData = new FormData();
  }
  handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { name } = e.target;

    let value: string;
    value = e.target.value;

    switch (name) {
      case "title": {
        this.setState({
          title: value,
        });
        break;
      }
      case "genre": {
        this.setState({
          genre: value,
        });
        break;
      }
      case "description": {
        this.setState({
          description: value,
        });
        break;
      }

      default:
        return;
    }
  };

  handleChangeFiles = (files: FileList | null) => {
    let value: File | null;
    value = files && files.length ? files[0] : null;
    this.setState({
      video: value,
    });
  };

  clickSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { title, genre, video, description } = this.state;
      // const media = {
      //   title,
      //   description,
      //   genre,
      // };

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: true,
      });

      if (
        validateEmptyFields("title", title).error ||
        validateEmptyFields("genre", genre).error
      ) {
        alert("Please fill out the Fields Properly");
        return;
      }

      if (validateFiles(video).error) {
        throw new Error(validateFiles(video).message);
      }

      // const media = {
      //   title,
      //   description,
      //   genre,
      // };

      let form: any = new FormData();

      form.append("title", title);
      form.append("description", description);
      form.append("genre", genre);
      // form.append("video", video);
      if (video) {
        form.append("video", video);
      }

      const jwt = auth.isAuthenticated();
      if (!jwt) throw new Error("User is not authenticated");

      const data = await create(
        { userId: jwt.user._id },
        { t: jwt.token },
        form
      );

      if (!data) throw new Error("could not post new Video");

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: false,
        FailMessage: "",
      });

      this.setState({ redirect: true, mediaId: data._id });

      this.props.history.push("/");
    } catch (error: any) {
      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: false,
        FailMessage: error.message,
      });
      this.setState({ error: error.message });
    }
  };

  render() {
    const { title, description, genre, errors, error, isError } = this.state;

    let videoName: any = this.state.video ? this.state.video : "";

    const { APIStatus } = this.context;

    return (
      <React.Fragment>
        <main className="section row add-video-sec">
          <div className="col s8 margin-auto ">
            {APIStatus.InProgress ? (
              <Loader />
            ) : (
              <form className="card" onSubmit={this.clickSubmit}>
                <div className="card-title">
                  <h2 className="center-align white-text">New Video</h2>
                </div>
                <div className="card-content">
                  <div className="row">
                    <div className="col s12 file-field input-field center-align">
                      <div className="btn upload-button ">
                        <span>
                          <i className="material-icons">file_upload</i>
                        </span>
                        <input
                          type="file"
                          accept="video/*"
                          name="video"
                          disabled={APIStatus.InProgress}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            this.handleChangeFiles(e.target.files)
                          }
                        />
                      </div>
                      <div className="file-path-wrapper">
                        <span className="file-path">
                          {videoName.name ? videoName.name : null}
                        </span>

                        {/* <input
                          class="file-path validate"
                          type="text"
                          placeholder="Upload one or more files"
                        /> */}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 input-field">
                      <Input
                        type="text"
                        onChange={this.handleChange}
                        name="title"
                        id="Title"
                        value={title}
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
                        value={description}
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
                        value={genre}
                        important={true}
                        onBlur={this.handleBlur}
                        error={errors.genre}
                        icon="video_library"
                        disabled={APIStatus.InProgress}
                      />
                    </div>
                  </div>

                  {error || error.trim().length ? (
                    <p className="red-text center">{error}</p>
                  ) : null}
                </div>
                <div className="card-action">
                  <div className="row align center">
                    <button
                      className="btn waves-effect waves-light submit center center"
                      type="submit"
                      disabled={isError}
                    >
                      Submit
                      {/* <i className="material-icons right">send</i> */}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </React.Fragment>
    );
  }
}

export default withRouter(NewMedia);
