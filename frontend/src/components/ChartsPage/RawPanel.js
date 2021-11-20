import React, { useEffect, useCallback, useState } from "react";
import Card from "../UI/Card";
import Chart from "../UI/Chart";
import Loader from "../UI/Loader";
import Button from "../UI/Button";

import classes from "./RawPanel.module.css";

function RawPanel(props) {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function fetchDataHandler(isPeriodic) {
    setLoading(isPeriodic && true);
    setError(null);

    try {
      // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/data/raw/`, {
      const response = await fetch(`http://localhost:4200/data/raw/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

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

  function getDataArray() {
    return [
      { name: "x", x: data.t, y: data.x },
      { name: "y", x: data.t, y: data.y },
      { name: "z", x: data.t, y: data.z },
    ];
  }

  function getFreqArray() {
    return [{ name: "f", x: data.ft, y: data.f }];
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
          data={getDataArray()}
          title="Raw data"
          xlabel="t [s]"
          ylabel="a [m/s^2]"
        />
        <Chart
          data={getFreqArray()}
          title="Frequency"
          xlabel="t [s]"
          ylabel="f [Hz]"
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

export default RawPanel;
