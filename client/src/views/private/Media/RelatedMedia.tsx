import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player";
import { BaseURL } from "../../../common/endpoints";
import { IAcceptAll, IMedia } from "../../../common/interfaces";

const RelatedMedia: React.FC<IAcceptAll> = (props) => {
  // const history = useHistory();

  const media: IMedia[] = props.media;

  const relatedMedias = () => {
    let jsx;

    if (media && media.length) {
      jsx = media.map((med, ind) => {
        return (
          <div className="card horizontal" key={"media - " + ind}>
            <div className="card-image">
              <Link to={"/media/" + med._id}>
                <ReactPlayer
                  url={`${BaseURL}/media/video/${med._id}`}
                  width="160px"
                  height="auto"
                />
              </Link>
            </div>
            <div className="card-stacked">
              <div className="card-content">
                <div className="card-title">
                  <Link to={"/media/" + med._id}>
                    <h5>{med.title}</h5>
                  </Link>
                </div>

                <h6>{med.genre}</h6>
                <p>{new Date(med.createdAt).toDateString()} </p>
                <p className="flow-text">{med.views} Views</p>
              </div>

              {/* <div className="card-action">
                <Link to={"/media/" + med._id}>
                  <i className="material-icons center-align">
                    play_circle_outline
                  </i>
                </Link>
              </div> */}
            </div>
          </div>
        );
      });
    } else jsx = <p>No Media Found</p>;

    return jsx;
  };

  return (
    <div className=" row">
      <div className="col s12 z-index-3">
        <h2 className="center-align">Up Next</h2>
        {relatedMedias()}
      </div>
    </div>
  );
};

RelatedMedia.propTypes = {
  media: PropTypes.array.isRequired,
};

export default RelatedMedia;
