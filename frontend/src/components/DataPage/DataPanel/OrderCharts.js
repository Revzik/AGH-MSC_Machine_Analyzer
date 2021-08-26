import React from "react";
import Card from "../../UI/Card";
import Chart from "../../UI/Card";

function OrderCharts(props) {
  return (
    <Card>
      <span>Order spectra</span>
      <Chart title="x" unit="m/s^2" data={props.data.x.orderSpectrum} />
      <Chart title="y" unit="m/s^2" data={props.data.y.orderSpectrum} />
      <Chart title="z" unit="m/s^2" data={props.data.z.orderSpectrum} />
    </Card>
  );
}

export default OrderCharts;
