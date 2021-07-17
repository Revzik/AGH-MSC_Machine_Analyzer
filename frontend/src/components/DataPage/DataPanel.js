import React from "react";

import SimpleParam from "./SimpleParam";
import Chart from "../UI/Chart";

function DataPanel(props) {
  return (
    <React.Fragment>
      <div>
        <SimpleParam name="Frequency" unit="Hz" value={props.data.freq} />
        <SimpleParam name="RMS" unit="m/s^2" value={props.data.rms} />
        <SimpleParam name="Kurtosis" value={props.data.kurt} />
        <SimpleParam name="Peak factor" unit="" value={props.data.peak} />
      </div>
      <Chart
        title="Order spectrum"
        unit="m/s^2"
        data={props.data.spec}
      />
    </React.Fragment>
  );
}

export default DataPanel;
