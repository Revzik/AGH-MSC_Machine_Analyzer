import React, { useReducer, useState, useEffect } from "react";

import MainContainer from "../UI/MainContainer";
import Card from "../UI/Card";
import Button from "../UI/Button";
import SimpleConfigParam from "./SimpleConfigParam";
import SelectConfigParam from "./SelectConfigParam";

import classes from "./MainConfig.module.css";
import Loader from "../UI/Loader";

function MainConfig(props) {
  const lowpassOptions = [
    { value: 32, name: "32 Hz" },
    { value: 64, name: "64 Hz" },
    { value: 125, name: "125 Hz" },
    { value: 250, name: "250 Hz" },
    { value: 500, name: "500 Hz" },
    { value: 1000, name: "1 kHz" },
  ];
  const rangeOptions = [
    { value: 2, name: "2 g" },
    { value: 4, name: "4 g" },
    { value: 8, name: "8 g" },
    { value: 16, name: "16 g" },
  ];

  let content = <Card>No data</Card>;
  if (isError) {
    content = <Card>Error: could not fetch data!</Card>;
  } else {
    content = (
      <fieldset className={classes.fieldset} disabled={isAnyLoading}>
        <form className={classes.form} onSubmit={applyConfigHandler}>
          <Card className={classes.card} title="Sensor">
            <SelectConfigParam
              active={!isLoading}
              name="Lowpass filter cutoff"
              options={dropdownValues.lowpass}
            />
            <SelectConfigParam
              active={!isLoading}
              name="Sensor range"
              options={dropdownValues.range}
            />
          </Card>
          <Card className={classes.card} title="Order spectrum">
            <SimpleConfigParam name="Order step" />
            <SimpleConfigParam name="Maximum order" />
          </Card>
          <Card className={classes.card} title="Windowing">
            <SimpleConfigParam name="Step" />
            <SimpleConfigParam name="Overlap" />
          </Card>
          <Card className={classes.card} title="Others">
            <SimpleConfigParam name="Tachometer points on the shaft" />
            <SimpleConfigParam name="Number of averages" />
          </Card>
          <Button className={classes.button} type="submit">
            Apply
          </Button>
        </form>
      </fieldset>
    );
  }

  return (
    <MainContainer>
      {content}
    </MainContainer>
  );
}

export default MainConfig;
