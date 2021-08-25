import React, { useState } from "react";
import Button from "../UI/Button";
import Card from "../UI/Card";
import MainContainer from "../UI/MainContainer";

import classes from "./CalibrationPage.module.css";

const STATE = {
  IDLE: "idle",
  AWAIT_X_POS: "xPos",
  AWAIT_X_NEG: "xNeg",
  AWAIT_Y_POS: "yPos",
  AWAIT_Y_NEG: "yNeg",
  AWAIT_Z_POS: "zPos",
  AWAIT_Z_NEG: "zNeg",
  CHECK: "check",
};

function CalibrationPage(props) {
  const [state, setState] = useState(STATE.IDLE);
  const [data, setData] = useState({ x: 0.01, y: 1.12, z: 0.0 });
  const calibrationData = {
    xPos: 0,
    xNeg: 0,
    yPos: 0,
    yNeg: 0,
    zPos: 0,
    zNeg: 0,
  };

  function fetchData() {
    console.log("Fetching data from sensor");
  }

  function saveData() {
    console.log("Saving current calibration factors");
  }

  function checkCalibration() {
    setState(STATE.CHECK);
  }

  function apply() {
    saveData();
    setState(STATE.IDLE);
  }

  function cancel() {
    setState(STATE.IDLE);
  }

  function nextCalibration(next) {
    console.log(`Current state: ${state}, Next state: ${next}`);
    switch (state) {
      case STATE.AWAIT_X_POS:
        calibrationData.xPos = data.x;
        break;
      case STATE.AWAIT_X_NEG:
        calibrationData.xNeg = data.x;
        break;
      case STATE.AWAIT_Y_POS:
        calibrationData.yPos = data.y;
        break;
      case STATE.AWAIT_Y_NEG:
        calibrationData.yNeg = data.y;
        break;
      case STATE.AWAIT_Z_POS:
        calibrationData.zPos = data.z;
        break;
      case STATE.AWAIT_Z_NEG:
        calibrationData.zNeg = data.z;
        break;
    }
    setState(next);
  }

  let content = (
    <Card className={classes.card}>
      <Button onClick={checkCalibration}>Check calibration</Button>
    </Card>
  );
  const dataCard = (
    <Card className={classes.card_horizontal}>
      <div className={classes.param}>
        <span className={classes.bold}>x:</span>
        <span>{data.x}</span>
      </div>
      <div className={classes.param}>
        <span className={classes.bold}>y:</span>
        <span>{data.y}</span>
      </div>
      <div className={classes.param}>
        <span className={classes.bold}>z:</span>
        <span>{data.z}</span>
      </div>
    </Card>
  );
  const cancelButton = <Button onClick={cancel}>Cancel</Button>;
  if (state === STATE.CHECK) {
    content = (
      <React.Fragment>
        {dataCard}
        <Card className={classes.card_horizontal}>
          <Button onClick={nextCalibration} onClickArgs={"xPos"}>
            Calibrate
          </Button>
          <Button onClick={apply}>Apply</Button>
        </Card>
      </React.Fragment>
    );
  }
  if (state === STATE.AWAIT_X_POS) {
    content = (
      <React.Fragment>
        {dataCard}
        <Card className={classes.card}>
          Place the sensor facing X axis up
        </Card>
        <Card className={classes.card_horizontal}>
          <Button onClick={nextCalibration} onClickArgs={STATE.AWAIT_Y_POS}>
            Next
          </Button>
          {cancelButton}
        </Card>
      </React.Fragment>
    );
  }
  if (state === STATE.AWAIT_Y_POS) {
    content = (
      <React.Fragment>
        {dataCard}
        <Card className={classes.card}>
          Place the sensor facing Y axis up
        </Card>
        <Card className={classes.card_horizontal}>
          <Button onClick={nextCalibration} onClickArgs={STATE.AWAIT_X_NEG}>
            Next
          </Button>
          {cancelButton}
        </Card>
      </React.Fragment>
    );
  }
  if (state === STATE.AWAIT_X_NEG) {
    content = (
      <React.Fragment>
        {dataCard}
        <Card className={classes.card}>
          Place the sensor facing X axis down
        </Card>
        <Card className={classes.card_horizontal}>
          <Button onClick={nextCalibration} onClickArgs={STATE.AWAIT_Y_NEG}>
            Next
          </Button>
          {cancelButton}
        </Card>
      </React.Fragment>
    );
  }
  if (state === STATE.AWAIT_Y_NEG) {
    content = (
      <React.Fragment>
        {dataCard}
        <Card className={classes.card}>
          Place the sensor facing Y axis down
        </Card>
        <Card className={classes.card_horizontal}>
          <Button onClick={nextCalibration} onClickArgs={STATE.AWAIT_Z_POS}>
            Next
          </Button>
          {cancelButton}
        </Card>
      </React.Fragment>
    );
  }
  if (state === STATE.AWAIT_Z_POS) {
    content = (
      <React.Fragment>
        {dataCard}
        <Card className={classes.card}>
          Place the sensor facing Z axis up
        </Card>
        <Card className={classes.card_horizontal}>
          <Button onClick={nextCalibration} onClickArgs={STATE.AWAIT_Z_NEG}>
            Next
          </Button>
          {cancelButton}
        </Card>
      </React.Fragment>
    );
  }
  if (state === STATE.AWAIT_Z_NEG) {
    content = (
      <React.Fragment>
        {dataCard}
        <Card className={classes.card}>
          Place the sensor facing Z axis down
        </Card>
        <Card className={classes.card_horizontal}>
          <Button onClick={nextCalibration} onClickArgs={STATE.CHECK}>
            Save
          </Button>
          {cancelButton}
        </Card>
      </React.Fragment>
    );
  }

  return <MainContainer>{content}</MainContainer>;
}

export default CalibrationPage;
