import React from "react";
import ReactDOM from "react-dom";

import Card from "../../UI/Card";
import Button from "../../UI/Button";
import ModalBackdrop from "../../UI/ModalBackdrop";

import classes from "./LabelModal.module.css";

function ModalOverlay(props) {
  function onChangeHandler(event) {
    props.onChange(event.target.value);
  }

  return (
    <Card className={classes.modal}>
      <header className={classes.header}>
        <h2>{props.title}</h2>
      </header>
      <div className={classes.content}>
        <span>{props.message}</span>
        <input className={`${classes.input} ${!props.valid && classes.invalid}`} onChange={onChangeHandler}></input>
      </div>
      <footer className={classes.actions}>
        <Button onClick={props.onConfirm}>Confirm</Button>
        <Button onClick={props.onCancel}>Cancel</Button>
      </footer>
    </Card>
  );
};

function LabelModal(props) {
  return (
    <React.Fragment>
      {ReactDOM.createPortal(
        <ModalBackdrop />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          title={props.title}
          message={props.message}
          valid={props.valid}
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
          onChange={props.onChange}
        />,
        document.getElementById("overlay-root")
      )}
    </React.Fragment>
  );
};

export default LabelModal;
