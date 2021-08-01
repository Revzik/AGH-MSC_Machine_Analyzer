import React, { useState, useEffect } from "react";

import MainContainer from "../UI/MainContainer";
import Button from "../UI/Button";
import Card from "../UI/Card";
import Loader from "../UI/Loader";
import LabelModal from "./LabelModal";

import classes from "./MainCapture.module.css";

function MainCapture(props) {
  const [isAcquiring, setAcquiring] = useState(false);
  const [isCapturing, setCapturing] = useState(false);
  const [label, setLabel] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isValid, setValid] = useState(true);

  function toggleAcquisition() {
    if (isAcquiring) {
      post("stop");
    } else {
      post("start");
    }
    fetchData();
  }

  function toggleCapture() {
    if (isCapturing) {
      post("capture/stop");
    } else {
      setShowModal(true);
    }
    fetchData();
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

  async function startCapture() {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:4200/acquire/capture/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ label: label }),
        }
      );
      if (!response.ok) {
        throw new Error(`Could not post command ${response}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      fetchData();
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

  function labelChangedHandler(newLabel) {
    setValid(true);
    setLabel(newLabel);
  }

  function labelConfirmHandler() {
    if (validateLabel()) {
      startCapture();
      setShowModal(false);
    }
  }

  function labelCancelHandler() {
    setValid(true);
    setShowModal(false);
  }

  function validateLabel() {
    const valid =
      label &&
      label.length > 0 &&
      label.length < 32 &&
      label.match("^[A-Za-z0-9_]+$");
    setValid(valid);
    return valid;
  }

  useEffect(() => {
    fetchData();
  }, []);

  const labelModal = (
    <LabelModal
      title="Set label"
      message="Label:"
      valid={isValid}
      onChange={labelChangedHandler}
      onConfirm={labelConfirmHandler}
      onCancel={labelCancelHandler}
    />
  );

  const acquisitionCard = (
    <Card className={classes.card}>
      <div className={classes.status}>
        {`Data acquisition: ${isAcquiring ? "on" : "off"}`}
      </div>
      <Button onClick={toggleAcquisition}>
        {isAcquiring ? "Stop acquisition" : "Start acquisition"}
      </Button>
    </Card>
  );

  let captureCard = null;
  if (isAcquiring) {
    captureCard = (
      <Card className={classes.card}>
        <div className={classes.status}>
          {`Data capture: ${isCapturing ? "on" : "off"}`}
        </div>
        {isCapturing && <div>Label: {label}</div>}
        <Button onClick={toggleCapture}>
          {isCapturing ? "Stop capture" : "Start capture"}
        </Button>
      </Card>
    );
  }

  return (
    <MainContainer>
      {showModal && labelModal}
      {acquisitionCard}
      {captureCard}
      {isLoading && <Loader />}
    </MainContainer>
  );
}

export default MainCapture;
