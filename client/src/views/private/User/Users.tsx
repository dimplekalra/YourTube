import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { Link } from "react-router-dom";
import { list } from "../../../common/api/user";
import stateContext from "../../../context/state-context";
import Loader from "../../../controls/Loader";
import Pagination from "react-js-pagination";
import { ItemsPerPage } from "../../../common/utility";
import { IAcceptAll, IUser } from "../../../common/interfaces";

class Users extends Component<IAcceptAll & RouteComponentProps, IAcceptAll> {
  static contextType = stateContext;

  componentDidMount() {
    this.context.init("user");
    this.FetchData();
  }

  FetchData: () => Promise<void> = async () => {
    try {
      this.context.loadData(async () => await list());
    } catch (err: any) {
      console.log(err.message);
    }
  };

  renderList = (array: IUser[]) => {
    // const { fetching, FilteredArray, APIStatus } = this.state;

    const { fetching, APIStatus } = this.context;

    return (
      <>
        <ul className="collection ">
          {APIStatus.Failed ? (
            <p className="flow-text red-text">{APIStatus.FailMessage}</p>
          ) : null}
          {fetching ? (
            <li className="collection-item center-align">
              <Loader />
            </li>
          ) : null}
          {array.length === 0 && !fetching ? (
            <li className="list-item">
              <p className="flow-text"> No Matching Records Found </p>
            </li>
          ) : (
            array.map((user: IUser, idx: number) => {
              return (
                <li
                  key={`users - ${idx}`}
                  className="collection-item avatar"
                  onClick={() => {
                    this.props.history.push("/user/" + user._id);
                  }}
                >
                  <img
                    src={`${process.env.PUBLIC_URL}/person.png`}
                    alt=""
                    className="circle responsive"
                  ></img>
                  <span className="title">{user.name}</span>
                  <p>{user.email}</p>
                  <Link
                    to={`/user/${user._id}`}
                    className="secondary-content grey-text"
                  >
                    <i className="material-icons">send</i>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </>
    );
  };

  render() {
    const { FilteredArray, activePage, HandlePageChange } = this.context;

    let array = ItemsPerPage(FilteredArray, activePage);

    return (
      <main className="section z-depth-2 all-users ">
        <h3 className="center-align">All Users</h3>
        {this.renderList(array)}
        <div className="row">
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
      </main>
    );
  }
}

export default withRouter(Users);
