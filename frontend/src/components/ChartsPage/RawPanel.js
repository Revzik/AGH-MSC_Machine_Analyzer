import React, { useEffect, useCallback } from "react";
import Chart from "../UI/Chart";

function RawPanel(props) {
  const refresh = useCallback(() => {
    props.refreshAction();
  }, [props]);

  useEffect(() => {
    const interval = setInterval(refresh, 100);
    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  function getDataArray() {
    return [
      { name: "x", x: [0, 0.2, 0.4, 0.6], y: [1, -2, 5, -3] },
      { name: "y", x: [0, 0.2, 0.4, 0.6], y: [1, -1, 1, -1] },
      { name: "z", x: [0, 0.2, 0.4, 0.6], y: [-7, -3, 6, -3] },
    ];
  }

  return (
    <Chart
      data={getDataArray()}
      title="Raw data"
      xlabel="t [s]"
      ylabel="a [m/s^2]"
    />
  );
}

export default RawPanel;
