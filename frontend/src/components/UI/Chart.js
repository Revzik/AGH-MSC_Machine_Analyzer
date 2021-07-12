import React from "react";
import { Line, LineChart, XAxis, YAxis } from 'recharts';

import classes from './Chart.module.css';

function Chart(props) {
  let data = props.data;
  let { x, y } = data;

  return (<LineChart data={data}>
    <Line type='monotone' dataKey='y' />
    <XAxis dataKey='x' />
    <YAxis />
  </LineChart>);
}

export default Chart;
