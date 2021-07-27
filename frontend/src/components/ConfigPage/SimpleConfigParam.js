import React from "react";

import classes from "./ConfigParam.module.css";

function SimpleConfigParam(props) {
  return (
    <div className={classes.param}>
      <div>{props.name}</div>
      <input />
    </div>
  );
}

export default SimpleConfigParam;
