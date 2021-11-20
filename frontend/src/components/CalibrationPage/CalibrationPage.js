import React, { useState, useEffect } from "react";
import MainContainer from "../UI/MainContainer";

import CalibrationPanel from "./CalibrationPanel";
import CheckState from "./CheckState";

function CalibrationPage(props) {
  const [data, setData] = useState({ x: 0, y: 0, z: 0 });
  const [action, setAction] = useState({
    check: false,
    cal: false,
  });

  useEffect(() => {
    const interval = setInterval(get, 100);
    getStatus();
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  function updateCheck(checkState) {
    setAction((prevState) => {
      return { ...prevState, check: checkState };
    });
  }

  function updateCal(calState) {
    setAction((prevState) => {
      return { ...prevState, cal: calState };
    });
  }

  async function get() {
    try {
      // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/calibrate/`, {
      const response = await fetch(`http://localhost:4200/calibrate/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`Could not post command ${response}`);
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getStatus() {
    try {
      // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/calibrate/status`, {
      const response = await fetch(`http://localhost:4200/calibrate/status`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Could not post command ${response}`);
      }
      const check = await response.json();
      setAction((prevState) => {
        return {
          ...prevState,
          check: check.status,
        };
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <MainContainer>
      <CheckState
        isRunning={action.check}
        data={data}
        stateHandler={updateCheck}
        disabled={!action.check && action.cal}
      />
      <CalibrationPanel
        data={data}
        stateHandler={updateCal}
        disabled={!action.cal && action.check}
      />
    </MainContainer>
  );
}

export default CalibrationPage;
