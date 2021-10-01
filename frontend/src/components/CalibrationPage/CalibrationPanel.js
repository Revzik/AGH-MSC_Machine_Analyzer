import React, { useState } from "react";
import Card from "../UI/Card";
import Button from "../UI/Button";

import classes from "./CalibrationPage.module.css";

const STEP = {
  IDLE: 0,
  X: 1,
  Y: 2,
  Z: 3,
  FINAL: 4,
};

function CalibrationPanel(props) {
  const [currentStep, setCurrentStep] = useState(STEP.IDLE);
  const [isError, setError] = useState(false);
  const [calibrationData, setCalibrationData] = useState({
    x0y: 0,
    x0z: 0,
    x1: 0,
    y0x: 0,
    y0z: 0,
    y1: 0,
    z0x: 0,
    z0y: 0,
    z1: 0,
  });

  async function post(path) {
    try {
      const response = await fetch(`http://localhost:4200/calibrate/${path}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Could not post command ${response}`);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setError(false);
  }

  async function postData() {
    try {
      const response = await fetch(`http://localhost:4200/calibrate/cal/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calibrationData),
      });

      if (!response.ok) {
        throw new Error(`Could not fetch config! ${response}`);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setError(false);
  }

  function start() {
    props.stateHandler(true);
    setCurrentStep(STEP.X);
    post("startCal");
  }

  function setX() {
    setCalibrationData((prevState) => {
      return {
        ...prevState,
        x1: +props.data.x,
        y0x: +props.data.y,
        z0x: +props.data.z,
      };
    });
    setCurrentStep(STEP.Y);
  }

  function setY() {
    setCalibrationData((prevState) => {
      return {
        ...prevState,
        x0y: +props.data.x,
        y1: +props.data.y,
        z0y: +props.data.z,
      };
    });
    setCurrentStep(STEP.Z);
  }

  function setZ() {
    setCalibrationData((prevState) => {
      return {
        ...prevState,
        x0z: +props.data.x,
        y0z: +props.data.y,
        z1: +props.data.z,
      };
    });
    setCurrentStep(STEP.FINAL);
  }

  function apply() {
    setCurrentStep(STEP.IDLE);
    props.stateHandler(false);
    post("stop");
    postData();
  }

  function cancel() {
    setCurrentStep(STEP.IDLE);
    props.stateHandler(false);
    post("stop");
  }

  let content = (
    <Button onClick={start} disabled={props.disabled}>
      Start
    </Button>
  );
  let dataContent = null;
  if (currentStep !== STEP.IDLE) {
    dataContent = (
      <div className={classes.horizontal}>
        <div className={classes.param}>
          <span className={classes.bold}>x:</span>
          <span>{+props.data.x.toFixed(2)} lsb</span>
        </div>
        <div className={classes.param}>
          <span className={classes.bold}>y:</span>
          <span>{+props.data.y.toFixed(2)} lsb</span>
        </div>
        <div className={classes.param}>
          <span className={classes.bold}>z:</span>
          <span>{+props.data.z.toFixed(2)} lsb</span>
        </div>
      </div>
    );
  }
  if (currentStep === STEP.X) {
    content = (
      <React.Fragment>
        <div>Place the sensor x axis up</div>
        <Button onClick={setX}>Next</Button>
        <Button onClick={cancel}>Cancel</Button>
      </React.Fragment>
    );
  }
  if (currentStep === STEP.Y) {
    content = (
      <React.Fragment>
        <div>Place the sensor y axis up</div>
        <Button onClick={setY}>Next</Button>
        <Button onClick={cancel}>Cancel</Button>
      </React.Fragment>
    );
  }
  if (currentStep === STEP.Z) {
    content = (
      <React.Fragment>
        <div>Place the sensor z axis up</div>
        <Button onClick={setZ}>Next</Button>
        <Button onClick={cancel}>Cancel</Button>
      </React.Fragment>
    );
  }
  if (currentStep === STEP.FINAL) {
    content = (
      <React.Fragment>
        <div>Press apply to finish calibration</div>
        <Button onClick={apply}>Apply</Button>
        <Button onClick={cancel}>Cancel</Button>
      </React.Fragment>
    );
  }
  if (isError) {
    content = <div>Could not obtain data!</div>;
  }

  return (
    <Card className={classes.card}>
      <div className={classes.title}>Start calibration</div>
      {dataContent}
      {content}
    </Card>
  );
}

export default CalibrationPanel;
