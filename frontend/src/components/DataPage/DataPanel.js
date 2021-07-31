import React, { useEffect, useCallback } from "react";

import SimpleParam from "./SimpleParam";
import Chart from "../UI/Chart";

function DataPanel(props) {
  const refresh = useCallback(() => {
    props.refreshAction(true);
  }, [props]);

  useEffect(() => {
    const interval = setInterval(refresh, 2000);
    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  return (
    <React.Fragment>
      <div>
        <SimpleParam name="Frequency" unit="Hz" value={props.data.frequency} />
        <SimpleParam name="RMS" unit="m/s^2" value={props.data.rms} />
        <SimpleParam name="Kurtosis" value={props.data.kurtosis} />
        <SimpleParam name="Peak factor" unit="" value={props.data.peakFactor} />
      </div>
      <Chart title="Order spectrum" unit="m/s^2" data={props.data.orderSpectrum} />
    </React.Fragment>
  );
}

export default DataPanel;
