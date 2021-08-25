import React from "react";

import classes from "./Button.module.css";

function Button(props) {
  function onClick() {
    if (!props.onClick) {
      return;
    }

    if (props.onClickArgs) {
      if (Array.isArray(props.onClickArgs)) {
        props.onClick(...props.onClickArgs);
      } else {
        props.onClick(props.onClickArgs);
      }
      return;
    }

    props.onClick();
  }

  return (
    <button
      className={`${classes.button} ${props.className}`}
      onClick={onClick}
      type={props.type ? props.type : "button"}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;
