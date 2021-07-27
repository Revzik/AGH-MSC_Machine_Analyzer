import React from "react";

import classes from "./NavButton.module.css";

function NavButton(props) {
  function onClick() {
    if (props.onClickArgs) {
      props.onClick(...props.onClickArgs);
      return;
    }
    
    props.onClick();
  }

  return (
    <button
      className={`${classes.default} ${props.selected && classes.selected}`}
      onClick={onClick}
    >
      {props.children}
    </button>
  );
}

export default NavButton;
