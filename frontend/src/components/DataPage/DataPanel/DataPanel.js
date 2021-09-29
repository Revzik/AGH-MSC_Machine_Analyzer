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
      { name: "x", x: props.data.orders, y: props.data.x.orderSpectrum },
      { name: "y", x: props.data.orders, y: props.data.y.orderSpectrum },
      { name: "z", x: props.data.orders, y: props.data.z.orderSpectrum },
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
