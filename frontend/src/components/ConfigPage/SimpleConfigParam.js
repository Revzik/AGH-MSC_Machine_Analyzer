import React, { useState } from "react";

import classes from "./ConfigParam.module.css";

function SimpleConfigParam(props) {
  function changeHandler(event) {
    props.changeHandler({ [event.target.name]: event.target.value });
  }

  return (
    <div className={classes.param}>
      <div>{props.description}</div>
      <input
        name={props.name}
        type={props.type ? props.type : "number"}
        onChange={changeHandler}
      />
    </div>
  );
}

export default SimpleConfigParam;
