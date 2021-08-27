import React, { useEffect, useCallback } from "react";

import StatisticalParams from "./StatisticalParams";
import Chart from "../../UI/Chart";

function DataPanel(props) {
  const refresh = useCallback(() => {
    props.refreshAction(true);
  }, [props]);

  useEffect(() => {
    const interval = setInterval(refresh, 100);
    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  function getDataArray() {
    return [
      { name: "x", x: props.data.x.orderSpectrum.x, y: props.data.x.orderSpectrum.y },
      { name: "y", x: props.data.y.orderSpectrum.x, y: props.data.y.orderSpectrum.y },
      { name: "z", x: props.data.z.orderSpectrum.x, y: props.data.z.orderSpectrum.y },
    ];
  }

  return (
    <React.Fragment>
      <StatisticalParams data={props.data}></StatisticalParams>
      <Chart
        data={getDataArray()}
        title="Order spectrum"
        xlabel="order"
        ylabel="a [m/s^2]"
      />
    </React.Fragment>
  );
}

export default DataPanel;
