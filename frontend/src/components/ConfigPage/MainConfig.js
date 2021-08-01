import React, { useState, useEffect } from "react";

import MainContainer from "../UI/MainContainer";
import Card from "../UI/Card";
import Button from "../UI/Button";
import SimpleConfigParam from "./SimpleConfigParam";
import SelectConfigParam from "./SelectConfigParam";

import classes from "./MainConfig.module.css";
import Loader from "../UI/Loader";

const lowpassOptions = [
  { value: 32, name: "32 Hz" },
  { value: 64, name: "64 Hz" },
  { value: 125, name: "125 Hz" },
  { value: 250, name: "250 Hz" },
  { value: 500, name: "500 Hz" },
  { value: 1000, name: "1000 Hz" },
];
const rangeOptions = [
  { value: 2, name: "2 g" },
  { value: 4, name: "4 g" },
  { value: 8, name: "8 g" },
  { value: 16, name: "16 g" },
];

function MainConfig(props) {
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    lowpass: "",
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

    try {
      const response = await fetch("http://localhost:4200/config/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
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
            name="lowpass"
            description="Lowpass filter cutoff"
            options={lowpassOptions}
            changeHandler={onChangeHandler}
            value={settings.lowpass}
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
            type="float:positive:nonZero"
            description="Step"
            changeHandler={onChangeHandler}
            value={settings.dOrder}
            isValid={validity.dOrder}
          />
          <SimpleConfigParam
            name="maxOrder"
            type="float:positive:nonZero"
            description="Maximum order"
            changeHandler={onChangeHandler}
            value={settings.maxOrder}
            isValid={validity.maxOrder}
          />
        </Card>
        <Card className={classes.card} title="Windowing">
          <SimpleConfigParam
            name="windowLength"
            type="int:positive:nonZero"
            description="Length [ms]"
            changeHandler={onChangeHandler}
            value={settings.windowLength}
            isValid={validity.windowLength}
          />
          <SimpleConfigParam
            name="windowOverlap"
            type="float:between,0,100"
            description="Overlap [%]"
            changeHandler={onChangeHandler}
            value={settings.windowOverlap}
            isValid={validity.windowOverlap}
          />
        </Card>
        <Card className={classes.card} title="Others">
          <SimpleConfigParam
            name="tachoPoints"
            type="int:positive:nonZero"
            description="Tachometer points on the shaft"
            changeHandler={onChangeHandler}
            value={settings.tachoPoints}
            isValid={validity.tachoPoints}
          />
          <SimpleConfigParam
            name="averages"
            type="int:positive:nonZero"
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

export default MainConfig;
