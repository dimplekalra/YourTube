import React, { Component } from "react";
import M, { Openable } from "materialize-css";
import { auth } from "../../../common/utility";
import { remove } from "../../../common/api/user";
import Modal from "../../../controls/Modal";
import { withRouter, RouteComponentProps } from "react-router-dom";
import stateContext from "../../../context/state-context";
import { IAcceptAll } from "../../../common/interfaces";

interface IState {
  open: boolean;
  redirect: boolean;
}

class DeleteUser extends Component<IAcceptAll & RouteComponentProps, IState> {
  state = {
    redirect: false,
    open: false,
  };
  modalRef = React.createRef<HTMLDivElement>();

  modalInstance: Openable | null = null;

  static contextType = stateContext;

  componentDidMount() {
    this.context.init("user");
    if (!auth.isAuthenticated()) this.props.history.push("/signin");

    if (this.modalRef.current) {
      this.modalInstance = M.Modal.init(this.modalRef.current);
    }
  }

  clickButton = () => {
    if (this.modalInstance) {
      this.modalInstance.open();
    }
  };
  deleteAccount = async () => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) this.props.history.push("/signin");

      this.context.setAPIState({
        InProgress: true,
        Failed: false,
        FailMessage: "",
      });

      const result = await remove(
        {
          userId: this.props.userId,
        },
        { t: jwt.token }
      );

      if (result) {
        auth.signOut(() => console.log("deleted"));

        this.context.setAPIState({
          ...this.context.APIStatus,
          InProgress: false,
          Failed: false,
        });

        this.props.history.push("/signin");
      } else throw new Error("Could not Delete User");
    } catch (error: any) {
      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: true,
        FailMessage: error.message,
      });
    }
  };

  handleRequestClose = () => {
    if (this.modalInstance) this.modalInstance.close();
  };
  render() {
    const { APIStatus } = this.context;
    return (
      <span>
        <button
          className="btn-floating center red waves-effect waves-light"
          disabled={APIStatus.InProgress}
        >
          <i className="material-icons" onClick={this.clickButton}>
            delete
          </i>
        </button>

        <Modal
          ref={this.modalRef}
          onCancel={this.handleRequestClose}
          onConfirm={this.deleteAccount}
          title="Delete Account"
        >
          <p>Confirm to delete your account.</p>
        </Modal>

        {/* <Dialog open={this.state.open} onClose={this.handleRequestClose}>
          <DialogTitle>{"Delete Account"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRequestClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.deleteAccount}
              color="secondary"
              autoFocus="autoFocus"
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog> */}
      </span>
    );
  }
}

export default withRouter(DeleteUser);
