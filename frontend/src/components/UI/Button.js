import React from "react";

import classes from "./Button.module.css";

function Button(props) {
  function onClick() {
    if (props.onClickArgs) {
      props.onClick(...props.onClickArgs);
      return;
    }
    
    props.onClick();
  }

  return (
    <button
      className={`${classes.button} ${props.className}`}
      onClick={onClick}
      type={props.type ? props.type : "button"}
    >
      {props.children}
    </button>
  );
}

export default Button;
