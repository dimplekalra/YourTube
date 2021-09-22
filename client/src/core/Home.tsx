import React, { useContext, useEffect } from "react";
import MediaList from "../views/private/Media/Medialist";
import { listPopular } from "../common/api/media";
import stateContext, { ContextProps } from "../context/state-context";
import Loader from "../controls/Loader";
import { IAcceptAll } from "../common/interfaces";

const Home: React.FC<IAcceptAll> = () => {
  const context = useContext(stateContext) as ContextProps;

  useEffect(() => {
    context.init("media");

    getMediaList();
  }, []);

  const getMediaList = async () => {
    try {
      await context.loadData(async () => await listPopular());

      if (!context.FilteredArray || !context.FilteredArray.length)
        throw new Error("could not load videos please try again later");

      // if (result.error) {
      //   console.log(result.error);
      //   return;
      // }
      // setMedia(result);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const { APIStatus, FilteredArray } = context;

  return (
    <div className="row main-sec">
      <div className="card col s12 ">
        <div className="card-content">
          <div className="card-title">
            <h3 className="center-align">Popular Videos</h3>
          </div>
          {APIStatus.InProgress ? (
            <div className="col s12 center-align">
              <Loader />
            </div>
          ) : (
            <MediaList media={FilteredArray} />
          )}
        </div>
      </div>
      {APIStatus.Failed ? (
        <p className="flow-text red-text center">{APIStatus.FailMessage}</p>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
