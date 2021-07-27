import React from "react";

import MainContainer from "../UI/MainContainer";
import Card from "../UI/Card";
import Button from "../UI/Button";
import SimpleConfigParam from "./SimpleConfigParam";
import SelectConfigParam from "./SelectConfigParam";

import classes from "./MainConfig.module.css";

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

  return (
    <MainContainer>
      <form>
        <Card className={classes.card} title="Sensor">
          <SelectConfigParam name="Lowpass filter cutoff" options={lowpassOptions} />
          <SelectConfigParam name="Sensor range" options={rangeOptions} />
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
        <Button className={classes.button} type="submit">Apply</Button>
      </form>
    </MainContainer>
  );
}

export default MainConfig;
