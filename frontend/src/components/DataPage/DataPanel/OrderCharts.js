import React from "react";
import Card from "../../UI/Card";
import Chart from "../../UI/Chart";

import classes from "./OrderCharts.module.css";

function OrderCharts(props) {
  const x = props.data.x.orderSpectrum;
  const y = props.data.y.orderSpectrum;
  const z = props.data.z.orderSpectrum;

  return (
    <Card className={classes.card}>
      <div className={classes.title}>Order spectra</div>
      <div className={classes.charts}>
        <Chart title="x" unit="m/s^2" data={x} />
        <Chart title="y" unit="m/s^2" data={y} />
        <Chart title="z" unit="m/s^2" data={z} />
      </div>
    </Card>
  );
}

export default OrderCharts;
