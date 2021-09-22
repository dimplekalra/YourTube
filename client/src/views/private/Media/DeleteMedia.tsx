import React, { Component } from "react";
import Modal from "../../../controls/Modal";
import M, { Openable } from "materialize-css";
import { auth } from "../../../common/utility";
import { remove } from "../../../common/api/media";
import { withRouter } from "react-router-dom";
import stateContext from "../../../context/state-context";
import { IAcceptAll } from "../../../common/interfaces";
import { RouteComponentProps } from "react-router-dom";

interface IState {
  open: boolean;
  redirect: boolean;
}

class DeleteMedia extends Component<IAcceptAll & RouteComponentProps, IState> {
  state = {
    redirect: false,
    open: false,
  };
  modalRef = React.createRef<HTMLDivElement>();

  modalInstance: Openable | null = null;

  static contextType = stateContext;

  componentDidMount() {
    this.context.init("media");
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
  deleteMedia = async () => {
    try {
      const jwt = auth.isAuthenticated();

      if (!jwt) this.props.history.push("/signin");

      this.context.setAPIState({
        InProgress: true,
        Failed: false,
        FailMessage: "",
      });

      const data = await remove(
        {
          mediaId: this.props.mediaId,
        },
        { t: jwt.token }
      );

      if (!data) throw new Error("Failed to Delete selected Media");

      this.context.setAPIState({
        ...this.context.APIStatus,
        InProgress: false,
        Failed: false,
      });

      this.props.history.push("/");
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
    if (this.modalInstance) {
      this.modalInstance.open();
    }
  };
  render() {
    const { mediaTitle } = this.props;
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
          onConfirm={this.deleteMedia}
          title={`Delete ${mediaTitle}`}
        >
          <p>Confirm to delete {mediaTitle} from your account.</p>
        </Modal>
      </span>
    );
  }
}

export default withRouter(DeleteMedia);
