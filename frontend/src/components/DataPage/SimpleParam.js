import React from "react";
import Card from "../UI/Card";

import classes from './SimpleParam.module.css';

function SimpleParam(props) {
  return (
    <Card className={classes.params}>
      <div className={classes.name}>{props.name}:</div>
      <div>{props.value}</div>
      <div className={classes.unit}>{props.unit}</div>
    </Card>
  );
}

export default SimpleParam;
