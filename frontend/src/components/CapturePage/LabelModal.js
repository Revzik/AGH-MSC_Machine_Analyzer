import React from "react";
import ReactDOM from "react-dom";

import Card from "../UI/Card";
import Button from "../UI/Button";
import ModalBackdrop from "../UI/ModalBackdrop";

import classes from "./LabelModal.module.css";

function ModalOverlay(props) {
  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.title}</h2>
      </header>
      <div className={classes.content}>
        <p>{props.message}</p>
      </div>
      <footer className={classes.actions}>
        <Button onClick={props.onConfirm}>Okay</Button>
      </footer>
    </Card>
  );
};

function LabelModal(props) {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <ModalBackdrop onConfirm={props.onConfirm} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default LabelModal;
