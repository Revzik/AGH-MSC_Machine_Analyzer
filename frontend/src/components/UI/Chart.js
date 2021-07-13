import React from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import classes from "./Chart.module.css";

function Chart(props) {
  let data = props.data;

  return (
    <LineChart width={600} height={300} data={data} className={`${props.className}`}>
      <Line type="monotone" dataKey="y" stroke="#000" isAnimationActive={false}/>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="x" />
      <YAxis />
    </LineChart>
  );
}

export default Chart;
