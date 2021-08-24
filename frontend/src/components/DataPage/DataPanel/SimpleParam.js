import React, { useState } from "react";
import Card from "../../UI/Card";

import classes from "./SimpleParam.module.css";

function SimpleParam(props) {
  const [isPrecise, setPrecise] = useState(false);

  function switchPrecision() {
    setPrecise(!isPrecise);
  }

  let value = <div>{props.value}</div>;
  if (!isPrecise) {
    value = <div>{+props.value.toFixed(2)}</div>;
  }

  return (
    <Card className={classes.params} onClick={switchPrecision}>
      <div className={classes.name}>{props.name}:</div>
      {value}
      <div className={classes.unit}>{props.unit}</div>
    </Card>
  );
}

export default SimpleParam;
