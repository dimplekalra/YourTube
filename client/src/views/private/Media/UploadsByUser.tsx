import React, { useContext, useEffect } from "react";
import MediaList from "./Medialist";
import { listByUser } from "../../../common/api/media";
import { auth, ItemsPerPage } from "../../../common/utility";
import { useHistory, useParams, RouteComponentProps } from "react-router-dom";
import stateContext, { ContextProps } from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import Pagination from "react-js-pagination";
import { IAcceptAll, TParams } from "../../../common/interfaces";

const Uploads: React.FC<IAcceptAll & RouteComponentProps<TParams>> = () => {
  const context = useContext(stateContext) as ContextProps;

  useEffect(() => {
    context.init("media");
    getMediaList();
  }, []);

  const history = useHistory<RouteComponentProps>();
  const params = useParams<TParams>();

  const getMediaList = async () => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) history.push("/signin");

      const { userId } = params;

      await context.loadData(
        async () => await listByUser({ userId }, { t: jwt.token })
      );

      if (!context.FilteredArray || !context.FilteredArray.length) {
        throw new Error("failed to load");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const { fetching, APIStatus, FilteredArray, activePage, HandlePageChange } =
    context;

  return (
    <div className="row">
      <div className="card col s12 ">
        <div className="card-content">
          <div className="card-title">
            <h3 className="center-align">Videos</h3>
          </div>
          {fetching ? (
            <div className="col s12 center-align">
              <Loader />
            </div>
          ) : null}
          {FilteredArray.length === 0 && !fetching ? (
            <li className="list-item">
              <p className="flow-text"> No Matching Records Found </p>
            </li>
          ) : (
            <MediaList
              media={ItemsPerPage(context.FilteredArray, activePage)}
            />
          )}
          {APIStatus.Failed ? (
            <p className="red-text">{APIStatus.FailMessage}</p>
          ) : null}
        </div>
      </div>
      <div className="col s12 right-align">
        <Pagination
          hideFirstLastPages
          prevPageText="Prev"
          nextPageText="Next"
          activePage={activePage}
          itemsCountPerPage={9}
          totalItemsCount={FilteredArray.length}
          pageRangeDisplayed={5}
          onChange={HandlePageChange}
          innerClass="custom_pagination"
        />
      </div>
    </div>
  );
};

export default Uploads;
