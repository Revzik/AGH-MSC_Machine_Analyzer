import React, { useReducer, useState, useEffect } from "react";

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

function settingsReducer(prevState, newSetting) {
  return { ...prevState, ...newSetting };
}

function MainConfig(props) {
  const [error, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [settings, settingsDispatch] = useReducer(settingsReducer, {});

  async function fetchDataHandler() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4200/config/", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Could not fetch config! ${response}`);
      }

      const config = await response.json();
      console.log(`Settings body: ${JSON.stringify(config)}`);
      settingsDispatch(config);
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

  function applyConfigHandler(event) {
    event.preventDefault();
    console.log("Settings:");
    console.log(settings);
    console.log("Event:");
    console.log(event);
  }

  let content = (
    <fieldset className={classes.fieldset} disabled={isLoading}>
      <form className={classes.form} onSubmit={applyConfigHandler}>
        <Card className={classes.card} title="Sensor">
          <SelectConfigParam
            name="lowpass"
            description="Lowpass filter cutoff"
            options={lowpassOptions}
            changeHandler={settingsDispatch}
          />
          <SelectConfigParam
            name="range"
            description="Sensor range"
            options={rangeOptions}
            changeHandler={settingsDispatch}
          />
        </Card>
        <Card className={classes.card} title="Order spectrum">
          <SimpleConfigParam
            name="dOrder"
            description="Step"
            changeHandler={settingsDispatch}
          />
          <SimpleConfigParam
            name="maxOrder"
            description="Maximum order"
            changeHandler={settingsDispatch}
          />
        </Card>
        <Card className={classes.card} title="Windowing">
          <SimpleConfigParam
            name="windowLength"
            description="Length"
            changeHandler={settingsDispatch}
          />
          <SimpleConfigParam
            name="windowOverlap"
            description="Overlap"
            changeHandler={settingsDispatch}
          />
        </Card>
        <Card className={classes.card} title="Others">
          <SimpleConfigParam
            name="tachoPoints"
            description="Tachometer points on the shaft"
            changeHandler={settingsDispatch}
          />
          <SimpleConfigParam
            name="averages"
            description="Number of averages"
            changeHandler={settingsDispatch}
          />
        </Card>
        <Button className={classes.button} type="submit">
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
