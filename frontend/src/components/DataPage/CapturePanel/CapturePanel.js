import React, { useState, useEffect } from "react";

import Button from "../../UI/Button";
import Card from "../../UI/Card";
import Loader from "../../UI/Loader";
import LabelModal from "./LabelModal";

import classes from "./CapturePanel.module.css";

function CapturePanel(props) {
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

  const acquisitionContent = (
    <div className={classes.button_block}>
      <div className={classes.status}>
        {`Data acquisition: ${isAcquiring ? "on" : "off"}`}
      </div>
      <Button onClick={toggleAcquisition}>
        {isAcquiring ? "Stop acquisition" : "Start acquisition"}
      </Button>
    </div>
  );

  let captureContent = null;
  if (isAcquiring) {
    captureContent = (
      <div className={classes.button_block}>
        <div className={classes.status}>
          {`Data capture: ${isCapturing ? "on" : "off"}`}
        </div>
        <Button onClick={toggleCapture}>
          {isCapturing ? "Stop capture" : "Start capture"}
        </Button>
      </div>
    );
  }

  return (
    <React.Fragment>
      {showModal && labelModal}
      <Card className={classes.card}>
        {isCapturing && <div>Label: {label}</div>}
        <div className={classes.button_space}>
          {acquisitionContent}
          {captureContent}
        </div>
        {isLoading && <Loader />}
      </Card>
    </React.Fragment>
  );
}

export default CapturePanel;
