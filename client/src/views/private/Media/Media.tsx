import React from "react";
import { auth } from "../../../common/utility";

import { useHistory, RouteComponentProps } from "react-router-dom";

import DeleteMedia from "./DeleteMedia";
import MediaPlayer from "./MediaPlayer";
import { BaseURL } from "../../../common/endpoints";
import { IAcceptAll } from "../../../common/interfaces";

const Media: React.FC<IAcceptAll> = (props) => {
  const { media } = props;

  const history = useHistory<RouteComponentProps>();

  const mediaUrl = props.media._id
    ? `${BaseURL}/media/video/${props.media._id}`
    : null;
  const nextUrl = props.nextUrl;

  return (
    <div className="row section ">
      <div className="col s12">
        <div className="card">
          <div className="card-content">
            <MediaPlayer
              srcUrl={mediaUrl}
              nextUrl={nextUrl}
              handleAutoplay={props.handleAutoplay}
            />
            <div className="card-title">
              <h4>{media.title}</h4>
            </div>
            <div className="row">
              <div className="col s12 m6">
                <h6 className=" grey-text darken-2">{media.genre}</h6>
              </div>
              <div className="col s12 m6">
                <h6 className=" grey-text darken-2 right">
                  {media.views} Views{" "}
                </h6>
              </div>
            </div>

            <div className="user-publish-details">
              <div className="row valign-wrapper">
                <div className="col s1">
                  <img
                    src={`${process.env.PUBLIC_URL}/person.png`}
                    alt=""
                    className="circle responsive-img"
                  />
                </div>
                <div className="col s11">
                  <span className="white-text">{media.postedBy.name}</span>
                </div>
              </div>
              <div className="row">
                <div className="col s3">
                  <p>
                    Published on {new Date(media.createdAt).toDateString()}{" "}
                  </p>
                </div>
                <div className="col s9">
                  {auth.isAuthenticated() &&
                    auth.isAuthenticated().user &&
                    auth.isAuthenticated().user._id ===
                      props.media.postedBy._id && (
                      <div className="card-action">
                        <div className="row">
                          <div className="col  ">
                            <button
                              onClick={() =>
                                history.push(`/media/edit/${media._id}`)
                              }
                              className="btn-floating   green waves-effect waves-light"
                            >
                              {<i className="material-icons">edit</i>}
                            </button>
                          </div>
                          <div className="col ">
                            <DeleteMedia
                              mediaId={media._id}
                              mediaTitle={media.title}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Media;
