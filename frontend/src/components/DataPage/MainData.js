import React from "react";
import Chart from "../UI/Chart";

import classes from "./MainData.module.css";
import SimpleParam from "./SimpleParam";

function MainData(props) {
  return (
    <main className={`${props.className} ${classes.main}`}>
      <div>
        <SimpleParam name={"Frequency"} unit={"Hz"} value={0.5} />
        <SimpleParam name={"RMS"} unit={"m/s^2"} value={0.5} />
        <SimpleParam name={"Kurtosis"} value={2} />
        <SimpleParam name={"Peak factor"} unit={""} value={2.5} />
      </div>
      <Chart
        title="Order spectrum"
        unit="m/s^2"
        data={[
          { x: 1, y: 0.1 },
          { x: 2, y: 1 },
          { x: 3, y: 0.8 },
          { x: 4, y: 0.7 },
          { x: 5, y: 1.3 },
        ]}
      />
    </main>
  );
}

export default MainData;
