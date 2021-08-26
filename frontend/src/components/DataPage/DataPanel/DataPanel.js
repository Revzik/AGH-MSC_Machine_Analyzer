import React, { useEffect, useCallback } from "react";

import StatisticalParams from "./StatisticalParams";
import OrderCharts from "./OrderCharts";

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

  return (
    <React.Fragment>
      <StatisticalParams data={props.data}></StatisticalParams>
      <OrderCharts data={props.data}></OrderCharts>
    </React.Fragment>
  );
}

export default DataPanel;
