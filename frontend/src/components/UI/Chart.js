import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Card from "./Card";

import classes from "./Chart.module.css";

function Chart(props) {
  const [state, setState] = useState({
    data: [
      {
        line: {
          color: "#0064BE",
          width: 1.5,
        },
      },
    ],
    layout: {
      margin: {
        l: 65,
        r: 65,
        t: 15,
        b: 65,
        pad: 4,
      },
      xaxis: {
        title: {
          text: "order",
        },
      },
      yaxis: {
        title: {
          text: `a [${props.unit}]`,
        },
      },
    },
    frames: [],
    config: {
      responsive: true,
    },
  });

  useEffect(() => {
    setState((prevState) => {
      let data = prevState.data[0];
      data.x = props.data.x;
      data.y = props.data.y;
      return { ...prevState, data: [data] };
    });
  }, [props.data]);

  return (
    <Card className={classes.chart} title={props.title}>
      <Plot 
        data={state.data}
        layout={state.layout}
        frames={state.frames}
        config={state.config}
        onInitialized={(figure) => setState(figure)}
        onUpdate={(figure) => setState(figure)}
      />
    </Card>
  );
}

export default Chart;
