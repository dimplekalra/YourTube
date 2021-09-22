import React from "react";
import { useHistory, RouteComponentProps } from "react-router-dom";
import ReactPlayer from "react-player";
import { BaseURL } from "../../../common/endpoints";
import { IAcceptAll, IMedia } from "../../../common/interfaces";

const MediaList: React.FC<IAcceptAll> = (props: IAcceptAll) => {
  const media: IMedia[] = props.media;

  const history = useHistory<RouteComponentProps>();

  const renderList = () => {
    if (!media || media.length === 0) return null;

    return (
      <div className="video-list">
        <ul className="collection">
          {media.map((tile, idx) => {
            return (
              <li
                key={idx}
                className="col s3 collection-item "
                onClick={() => history.push(`/media/${tile._id}`)}
              >
                <div className="row">
                  <div className="col s12">
                    <ReactPlayer
                      url={`${BaseURL}/media/video/${tile._id}`}
                      width="100%"
                      height="inherit"
                      style={{ maxHeight: "100%" }}
                      // image={`${BaseURL}/media/video/${tile._img}`}
                    />
                  </div>
                  <div className="col c12 ">
                    <h5 className="title">{tile.title}</h5>

                    <span>
                      <span>{tile.views} views</span>
                      <span>
                        <em>{tile.genre}</em>
                      </span>
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="row">{media && media.length > 0 ? renderList() : null}</div>
  );
};

export default MediaList;
