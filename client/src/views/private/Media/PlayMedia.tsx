import React, { ReactElement, useContext, useEffect, useState } from "react";
import { useParams, withRouter, RouteComponentProps } from "react-router-dom";
import { read, listRelated } from "../../../common/api/media";
import { IAcceptAll, IMedia } from "../../../common/interfaces";
import stateContext, { ContextProps } from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import Media from "./Media";
import RelatedMedia from "./RelatedMedia";

type TParams = { userId: string; mediaId: string };

const PlayMedia: React.FC<IAcceptAll & RouteComponentProps> =
  (): ReactElement => {
    const [media, setMedia] = useState<IMedia>({
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
    });
    const [autoPlay, setAutoPlay] = useState<boolean>(false);

    const [relatedMedia, setRelatedMedia] = useState<IMedia[]>([]);
    const [error, setError] = useState<string>("");

    const params = useParams<TParams>();

    const context = useContext(stateContext) as ContextProps;

    const { mediaId } = params;

    const loadMedia = async (mediaId: string | number): Promise<void> => {
      try {
        context.setAPIState({
          ...context.APIStatus,
          InProgress: true,
        });

        const result = await read({ mediaId });

        if (!result) throw new Error("could not load media");

        setMedia(result);

        const relatedList = await listRelated({ mediaId: result._id });
        if (!relatedList) throw new Error("could not load related list ");

        context.setAPIState({
          ...context.APIStatus,
          InProgress: false,
          Failed: false,
          FailMessage: "",
        });

        setRelatedMedia(relatedList);
      } catch (error: any) {
        setError(error.message);
        context.setAPIState({
          ...context.APIStatus,
          InProgress: false,
          Failed: true,
          FailMessage: error.message,
        });
      }
    };

    useEffect(() => {
      context.init("media");
      loadMedia(mediaId);
    }, [mediaId]);

    // static getDerivedStateFromProps(props, state) {
    //   loadMedia(props.match.params.mediaId);
    // }

    // componentWillReceiveProps(props) {
    //   this.loadMedia(this.match.params.mediaId);
    // }

    /*
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setAutoPlay(event.target.checked);
    };
    */

    const handleAutoplay = async (updateMediaControls: () => void) => {
      let playList = relatedMedia;
      let playMedia = playList[0];
      if (!autoPlay || playList.length === 0) return updateMediaControls();

      if (playList.length > 1) {
        playList.shift();
        setMedia(playMedia);
        setRelatedMedia(playList);
      } else {
        const result = await listRelated({ mediaId: playMedia._id });
        if (!result) throw new Error("failed to load related list");
        setMedia(playMedia);
        setRelatedMedia(result);
      }
    };

    const { APIStatus } = context;
    const nextUrl = relatedMedia.length ? `/media/${relatedMedia[0]._id}` : "";
    return (
      <div className="row play-media-sec">
        <div className="col s12">
          {APIStatus.InProgress ? (
            <div className="col s12 center-align">
              <Loader />
            </div>
          ) : (
            <div className="row">
              <div className="col s12 m8">
                <Media
                  media={media}
                  nextUrl={nextUrl}
                  handleAutoplay={handleAutoplay}
                />
              </div>

              <div className="col s12 m3 related-media-sec">
                {/* <div className="switch">
                <label htmlFor="Autoplay">
                  Off
                  <input
                    onChange={handleChange}
                    checked={autoPlay}
                    type="checkbox"
                    name="autoplay"
                    id="Autoplay"
                  />
                  <span className="lever"></span>
                  On
                </label>
              </div> */}
                <div className="row related-video-sec">
                  <div className="col s12">
                    <RelatedMedia media={relatedMedia} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error ? <p className="flow-text center red-text">{error}</p> : null}
        </div>
      </div>
    );
  };

export default withRouter(PlayMedia);
