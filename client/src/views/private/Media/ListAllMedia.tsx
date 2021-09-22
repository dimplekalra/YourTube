import React, { useEffect, useContext } from "react";
import MediaList from "./Medialist";
import { listAllMedia } from "../../../common/api/media";
import { auth, ItemsPerPage } from "../../../common/utility";
import stateContext, { ContextProps } from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import Pagination from "react-js-pagination";
import { IAcceptAll } from "../../../common/interfaces";

const ListAllMedia: React.FC<IAcceptAll> = (props: IAcceptAll) => {
  const context = useContext(stateContext) as ContextProps;

  useEffect(() => {
    context.init("media");
    getMediaList();
  }, []);

  const getMediaList = async (): Promise<void> => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) props.history.push("/signin");

      await context.loadData(
        async (): Promise<void> => await listAllMedia({ t: jwt.token })
      );

      if (!context.FilteredArray) {
        throw new Error("failed to load");
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const { fetching, FilteredArray, APIStatus, activePage, HandlePageChange } =
    context;

  return (
    <div className="row">
      <div className="card col s12 ">
        <div className="card-content">
          <div className="card-title">
            <h3 className="center-align">All Videos</h3>
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
          prevPageText="<"
          nextPageText=">"
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

export default ListAllMedia;
