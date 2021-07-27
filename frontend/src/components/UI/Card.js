import React from "react";

import classes from "./Card.module.css";

function Card(props) {
  return (
    <div
      className={`${props.className} ${classes.card}`}
      onClick={props.onClick}
    >
      {props.title && <div className={classes.title}>{props.title}</div>}
      {props.children}
    </div>
  );
}

export default Card;
