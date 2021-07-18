import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Card from "./Card";

import classes from "./Chart.module.css";

function Chart(props) {
  const [state, setState] = useState({
    data: [props.data],
    layout: {},
    frames: [],
    config: {},
  });

  useEffect(() => {
    setState((prevState) => {
      return { ...prevState, data: [props.data] };
    });
  }, [props.data]);

  return (
    <Card className={classes.box}>
      <div className={classes.title}>{props.title}</div>
      <Plot
        data={state.data}
        layout={state.layout}
        frames={state.frames}
        config={state.config}
        onInitialized={(figure) => setState(figure)}
        onUpdate={(figure) => setState(figure)}
      />
      {/* Recharts part - pretty but hard to work with, unintuative 
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={props.data} className={`${props.className}`}>
          <Line
            type="monotone"
            dataKey="y"
            stroke="#000"
            isAnimationActive={false}
          />
          <CartesianGrid stroke="#ccc" />
          <XAxis label={{value: "order", offset: -5, position: "insideBottom"}} dataKey="x" tick={getTicks(props.data)} />
          <YAxis label={{value: `a [${props.unit}]`, position: "insideLeft", angle: -90}} />
        </LineChart>
      </ResponsiveContainer> */}
    </Card>
  );
}

export default Chart;
