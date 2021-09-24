import React, { useEffect, useCallback, useState } from "react";
import Card from "../UI/Card";
import Chart from "../UI/Chart";
import Loader from "../UI/Loader";
import Button from "../UI/Button";

import classes from "./DebugPanel.module.css";

function DebugPanel(props) {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function fetchDataHandler(isPeriodic) {
    setLoading(isPeriodic && true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4200/data/debug/");

      if (!response.ok) {
        throw new Error(`Response status ${response.status}`);
      }
      const data = await response.json();

      setData(data);
    } catch (error) {
      setError(error.message);
      setData(null);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDataHandler(false);
  }, []);

  const refresh = useCallback(() => {
    fetchDataHandler();
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 100);
    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  function getFftDataArray() {
    return [
      { name: "x", x: data.fft.t, y: data.fft.x },
      { name: "y", x: data.fft.t, y: data.fft.y },
      { name: "z", x: data.fft.t, y: data.fft.z },
    ];
  }

  function getOrderDataArray() {
    return [
      { name: "x", x: data.order.t, y: data.order.x },
      { name: "y", x: data.order.t, y: data.order.y },
      { name: "z", x: data.order.t, y: data.order.z },
    ];
  }

  const button = (
    <Button onClick={fetchDataHandler} onClickArgs={[false]}>
      Refresh
    </Button>
  );

  let content = (
    <Card className={classes.card}>
      No data!
      {button}
    </Card>
  );
  if (data) {
    content = (
      <React.Fragment>
        <Chart
          data={getFftDataArray()}
          title="FFT data"
          xlabel="f [Hz]"
          ylabel="a [m/s^2]"
        />
        <Chart
          data={getOrderDataArray()}
          title="Order data"
          xlabel="order"
          ylabel="a [m/s^2]"
        />
      </React.Fragment>
    );
  }
  if (isLoading) {
    content = <Loader />;
  }
  if (error) {
    content = (
      <Card className={classes.card}>
        Could not fetch data!
        {button}
      </Card>
    );
  }

  return content;
}

export default DebugPanel;
