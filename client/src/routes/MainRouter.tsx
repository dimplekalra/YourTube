import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "../core/Home";
import Users from "../views/private/User/Users";
import Signup from "../views/public/Signup";
import Signin from "../views/public/Login";
import PrivateRoute from "../views/public/PrivateRoute";
import Profile from "../views/private/User/Profile";
import EditProfile from "../views/private/User/EditProfile";
import NewMedia from "../views/private/Media/NewMedia";
import EditMedia from "../views/private/Media/EditMedia";
import PlayMedia from "../views/private/Media/PlayMedia";
import ListAllMedia from "../views/private/Media/ListAllMedia";
import UploadByUser from "../views/private/Media/UploadsByUser";
import { IAcceptAll } from "../common/interfaces";

interface IState {
  data: IAcceptAll;
}

class MainRouter extends Component<IAcceptAll, IState> {
  constructor(props: IAcceptAll) {
    super(props);
    this.state = {
      data: props.data,
    };
  }
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={Users} />
          <Route path="/signup" component={Signup} />
          <Route path="/signin" component={Signin} />
          <PrivateRoute path="/user/edit/:userId" component={EditProfile} />
          <PrivateRoute path="/media/new" component={NewMedia} />
          <PrivateRoute path="/media/edit/:mediaId" component={EditMedia} />
          <PrivateRoute path="/media/list" component={ListAllMedia} />
          <PrivateRoute path="/media/by/:userId" component={UploadByUser} />

          <Route path="/user/:userId" component={Profile} />
          <Route
            path="/media/:mediaId"
            render={(props) => <PlayMedia {...props} data={this.state.data} />}
          />
          <Route path="/media/:mediaId" component={PlayMedia} />
        </Switch>
      </div>
    );
  }
}
export default MainRouter;
