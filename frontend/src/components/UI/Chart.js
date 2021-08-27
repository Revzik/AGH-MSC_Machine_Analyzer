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
      {
        line: {
          color: "#FFC200",
          width: 1.5,
        },
      },
      {
        line: {
          color: "#FF4F00",
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
          text: props.xlabel,
        },
      },
      yaxis: {
        title: {
          text: props.ylabel,
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
      let data = [];
      for (let i = 0; i < props.data.length; i++) {
        data[i] = prevState.data[i];
        if (props.data[i].name) {
          data[i].name = props.data[i].name;
        }
        data[i].x = props.data[i].x;
        data[i].y = props.data[i].y;
      }
      return { ...prevState, data: data };
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
