import React, { useState } from "react";
import Button from "../UI/Button";
import Card from "../UI/Card";

import classes from "./CalibrationPage.module.css";

function CheckState(props) {
  const [isRunning, setRunning] = useState(false);
  const [isError, setError] = useState(false);

  async function post(path) {
    try {
      const response = await fetch(
        `http://localhost:4200/calibrate/${path}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error(`Could not post command ${response}`);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setError(false);
  }

  function start() {
    setRunning(true);
    props.stateHandler(true);
    post("start");
  }

  function stop() {
    setRunning(false);
    props.stateHandler(false);
    post("stop");
  }

  let content = <Button onClick={start} disabled={props.disabled}>Start</Button>;
  if (isRunning) {
    content = (
      <React.Fragment>
        <div className={classes.horizontal}>
          <div className={classes.param}>
            <span className={classes.bold}>x:</span>
            <span>{+props.data.x.toFixed(2)} m/s^2</span>
          </div>
          <div className={classes.param}>
            <span className={classes.bold}>y:</span>
            <span>{+props.data.y.toFixed(2)} m/s^2</span>
          </div>
          <div className={classes.param}>
            <span className={classes.bold}>z:</span>
            <span>{+props.data.z.toFixed(2)} m/s^2</span>
          </div>
        </div>
        <Button onClick={stop}>Stop</Button>
      </React.Fragment>
    );
  }
  if (isError) {
    content = <div>Could not obtain data!</div>;
  }

  return (
    <Card className={classes.card}>
      <div className={classes.title}>Check calibration</div>
      {content}
    </Card>
  );
}

export default CheckState;
