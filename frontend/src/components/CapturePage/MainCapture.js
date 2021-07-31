import React, { useState, useEffect } from "react";

import MainContainer from "../UI/MainContainer";
import Button from "../UI/Button";
import Card from "../UI/Card";
import LabelModal from "./LabelModal";

import classes from "./MainCapture.module.css";

function MainCapture(props) {
  const [acquiring, setAcquiring] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [label, setLabel] = useState("");
  const [settingLabel, setSettingLabel] = useState(true);
  const [isLoading, setLoading] = useState(false);

  function toggleAcquisition() {
    if (acquiring) {
      post("stop");
    } else {
      post("start");
    }
    fetchData();
  }

  function toggleCapture() {
    if (capturing) {
      post("capture/stop");
    } else {
      post("capture/start");
    }
  }

  async function post(path) {
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4200/acquire/${path}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`Could not post command ${response}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4200/acquire");
      if (!response.ok) {
        throw new Error(`Could not post command ${response}`);
      }

      const statuses = await response.json();
      setAcquiring(statuses.acquiring);
      setCapturing(statuses.capturing);
      setLabel(statuses.label);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const labelModal = <LabelModal title="Set label"/>

  const acquisitionCard = (
    <Card className={classes.card}>
      <div className={classes.status}>
        {acquiring ? "Sensor acquiring" : "Sensor not acquiring"}
      </div>
      <Button onClick={toggleAcquisition}>
        {acquiring ? "Stop acquisition" : "Start acquisition"}
      </Button>
    </Card>
  );

  let captureCard = null;
  if (acquiring) {
    captureCard = (
      <Card className={classes.card}>
        <div className={classes.status}>
          {capturing ? "Data capturing" : "Data not capturing"}
        </div>
        {capturing && <div>Label: {label}</div>}
        <Button onClick={toggleCapture}>
          {capturing ? "Stop capture" : "Start capture"}
        </Button>
      </Card>
    );
  }

  return (
    <MainContainer>
      {settingLabel && labelModal}
      {acquisitionCard}
      {captureCard}
    </MainContainer>
  );
}

export default MainCapture;
