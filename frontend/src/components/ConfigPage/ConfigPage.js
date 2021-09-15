import React, { useState, useEffect } from "react";

import MainContainer from "../UI/MainContainer";
import Card from "../UI/Card";
import Button from "../UI/Button";
import SimpleConfigParam from "./SimpleConfigParam";
import SelectConfigParam from "./SelectConfigParam";

import classes from "./ConfigPage.module.css";
import Loader from "../UI/Loader";

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
  { value: 2, name: "2 g" },
  { value: 4, name: "4 g" },
  { value: 8, name: "8 g" },
  { value: 16, name: "16 g" },
];

function ConfigPage(props) {
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    fs: "",
    range: "",
    dOrder: "",
    maxOrder: "",
    windowLength: "",
    windowOverlap: "",
    tachoPoints: "",
    averages: "",
  });
  const [validity, setValidity] = useState({
    dOrder: true,
    maxOrder: true,
    windowLength: true,
    windowOverlap: true,
    tachoPoints: true,
    averages: true,
  });
  const types = {
    dOrder: "float:positive:nonZero",
    maxOrder: "float:positive:nonZero",
    windowLength: "int:positive:nonZero",
    windowOverlap: "float:between,0,100",
    tachoPoints: "int:positive:nonZero",
    averages: "int:positive:nonZero",
  };
  const [isValid, setValid] = useState(true);

  function onChangeHandler(key, value, validity) {
    setSettings((prevState) => {
      return { ...prevState, [key]: value };
    });
    if (typeof validity !== "undefined")
      setValidity((prevState) => {
        return { ...prevState, [key]: validity };
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

      const config = await response.json();
      setSettings(config);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function applyConfigHandler(event) {
    event.preventDefault();
    setLoading(true);

    const settingsJson = parseSettings();

    try {
      const response = await fetch("http://localhost:4200/config/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: settingsJson,
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

  function parseSettings() {
    let fixedSettings = {};
    for (const key in settings) {
      if (!types[key]) {
        fixedSettings[key] = parseInt(settings[key]);
      } else if (types[key].includes("int")) {
        fixedSettings[key] = parseInt(settings[key]);
      } else if (types[key].includes("float")) {
        fixedSettings[key] = parseFloat(settings[key]);
      }
    }
    return JSON.stringify(fixedSettings);
  }

  useEffect(() => {
    fetchDataHandler();
  }, []);

  useEffect(() => {
    const isEverythingValid = Object.values(validity).every(
      (value) => value === true
    );

    setValid(isEverythingValid);
  }, [validity]);

  let content = (
    <fieldset className={classes.fieldset} disabled={isLoading}>
      <form className={classes.form} onSubmit={applyConfigHandler}>
        <Card className={classes.card} title="Sensor">
          <SelectConfigParam
            name="fs"
            description="Sampling frequency"
            options={fsOptions}
            changeHandler={onChangeHandler}
            value={settings.fs}
          />
          <SelectConfigParam
            name="range"
            description="Sensor range"
            options={rangeOptions}
            changeHandler={onChangeHandler}
            value={settings.range}
          />
        </Card>
        <Card className={classes.card} title="Order spectrum">
          <SimpleConfigParam
            name="dOrder"
            type={types.dOrder}
            description="Step"
            changeHandler={onChangeHandler}
            value={settings.dOrder}
            isValid={validity.dOrder}
          />
          <SimpleConfigParam
            name="maxOrder"
            type={types.maxOrder}
            description="Maximum order"
            changeHandler={onChangeHandler}
            value={settings.maxOrder}
            isValid={validity.maxOrder}
          />
        </Card>
        <Card className={classes.card} title="Windowing">
          <SimpleConfigParam
            name="windowLength"
            type={types.windowLength}
            description="Length [ms]"
            changeHandler={onChangeHandler}
            value={settings.windowLength}
            isValid={validity.windowLength}
          />
          <SimpleConfigParam
            name="windowOverlap"
            type={types.windowOverlap}
            description="Overlap [%]"
            changeHandler={onChangeHandler}
            value={settings.windowOverlap}
            isValid={validity.windowOverlap}
          />
        </Card>
        <Card className={classes.card} title="Others">
          <SimpleConfigParam
            name="tachoPoints"
            type={types.tachoPoints}
            description="Tachometer points on the shaft"
            changeHandler={onChangeHandler}
            value={settings.tachoPoints}
            isValid={validity.tachoPoints}
          />
          <SimpleConfigParam
            name="averages"
            type={types.averages}
            description="Number of averages"
            changeHandler={onChangeHandler}
            value={settings.averages}
            isValid={validity.averages}
          />
        </Card>
        <Button className={classes.button} type="submit" disabled={!isValid}>
          Apply
        </Button>
      </form>
    </fieldset>
  );
  if (isLoading) {
    content = <Loader />;
  }
  if (error) {
    content = <Card>Error: could not fetch data!</Card>;
  }

  return <MainContainer>{content}</MainContainer>;
}

export default ConfigPage;
