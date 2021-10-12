import React, { useEffect, useState } from "react";

import Card from "../UI/Card";
import Loader from "../UI/Loader";
import Button from "../UI/Button";
import Select from "./Inputs/Select";
import Numeric from "./Inputs/Numeric";

import classes from "./ConfigPage.module.css";

const fsOptions = [
  { value: 25, name: "25 Hz" },
  { value: 50, name: "50 Hz" },
  { value: 100, name: "100 Hz" },
  { value: 200, name: "200 Hz" },
  { value: 400, name: "400 Hz" },
  { value: 800, name: "800 Hz" },
  { value: 1600, name: "1600 Hz" },
  { value: 3200, name: "3200 Hz" },
];

const rangeOptions = [
  { value: 2, name: "±2 g" },
  { value: 4, name: "±4 g" },
  { value: 8, name: "±8 g" },
  { value: 16, name: "±16 g" },
];

function ConfigPanel(props) {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isValid, setValid] = useState(true);

  const [config, setConfig] = useState({
    fs: { value: 3200, valid: true },
    range: { value: 16, valid: true },
    dOrder: { value: 0.1, valid: true },
    maxOrder: { value: 10, valid: true },
    windowLength: { value: 1000, valid: true },
    windowOverlap: { value: 50, valid: true },
    averages: { value: 5, valid: true },
  });

  function parseConfig() {
    return JSON.stringify({
      fs: parseInt(config.fs.value),
      range: parseInt(config.range.value),
      dOrder: parseFloat(config.dOrder.value),
      maxOrder: parseFloat(config.maxOrder.value),
      windowLength: parseInt(config.windowLength.value),
      windowOverlap: parseInt(config.windowOverlap.value),
      averages: parseInt(config.windowOverlap.value),
    });
  }

  async function fetchDataHandler() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4200/config/");

      if (!response.ok) {
        throw new Error(`Could not fetch config! ${response}`);
      }

      const body = await response.json();
      setConfig({
        fs: { value: body.fs, valid: true },
        range: { value: body.range, valid: true },
        dOrder: { value: body.dOrder, valid: true },
        maxOrder: { value: body.maxOrder, valid: true },
        windowLength: { value: body.windowLength, valid: true },
        windowOverlap: { value: body.windowOverlap, valid: true },
        averages: { value: body.averages, valid: true },
      });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function applyConfigHandler(event) {
    setLoading(true);

    const configJson = parseConfig();

    try {
      const response = await fetch("http://localhost:4200/config/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: configJson,
      });

      if (!response.ok) {
        throw new Error(`Could not fetch config! ${response}`);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDataHandler();
  }, []);

  useEffect(() => {
    const isEverythingValid = Object.values(config).every(
      (param) => param.valid
    );

    setValid(isEverythingValid);
  }, [config]);

  function parameterUpdated(key, value, valid) {
    setConfig((prevState) => {
      return { ...prevState, [key]: { value: value, valid: valid } };
    });
  }

  let content = <Loader />;
  if (isError) {
    content = <Card>Could not fetch config!</Card>;
  }
  if (!isLoading) {
    content = (
      <Card title="Data processing" className={classes.card}>
        <div className={classes.title_first}>Sensor</div>
        <Select
          name="fs"
          description="Sampling frequency"
          options={fsOptions}
          changeHandler={parameterUpdated}
          value={config.fs.value}
        />
        <Select
          name="range"
          description="Acceleration range"
          options={rangeOptions}
          changeHandler={parameterUpdated}
          value={config.range.value}
        />
        <div className={classes.title}>Order analysis</div>
        <Numeric
          name="dOrder"
          lower="0"
          description="Spectrum step"
          changeHandler={parameterUpdated}
          content={config.dOrder}
        />
        <Numeric
          name="maxOrder"
          lower="0"
          description="Maximum order"
          changeHandler={parameterUpdated}
          content={config.maxOrder}
        />
        <div className={classes.title}>Windowing</div>
        <Numeric
          name="windowLength"
          lower="0"
          description="Length [ms]"
          changeHandler={parameterUpdated}
          content={config.windowLength}
        />
        <Numeric
          name="windowOverlap"
          lower="0"
          higher="100"
          description="Overlap [%]"
          changeHandler={parameterUpdated}
          content={config.windowOverlap}
        />
        <Numeric
          name="averages"
          lower="0"
          description="Number of windows"
          changeHandler={parameterUpdated}
          content={config.averages}
        />
        <Button
          disabled={!isValid}
          className={classes.button}
          onClick={applyConfigHandler}
        >
          Apply config
        </Button>
      </Card>
    );
  }

  return content;
}

export default ConfigPanel;
