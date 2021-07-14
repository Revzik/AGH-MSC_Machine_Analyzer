import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import Card from "./Card";

import classes from "./Chart.module.css";

function Chart(props) {
  let data = props.data;

  return (
    <Card className={classes.box}>
      <div className={classes.title}>{props.title}</div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} className={`${props.className}`}>
          <Line
            type="monotone"
            dataKey="y"
            stroke="#000"
            isAnimationActive={false}
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis label={{value: "order", offset: -5, position: "insideBottom"}} dataKey="x" />
          <YAxis label={{value: `a [${props.unit}]`, position: "insideLeft", angle: -90}}/>
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export default Chart;
