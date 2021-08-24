import React, { useState, useEffect } from "react";
import DataPanel from "./DataPanel/DataPanel";
import CapturePanel from "./CapturePanel/CapturePanel";
import Card from "../UI/Card";
import Loader from "../UI/Loader";
import Button from "../UI/Button";
import MainContainer from "../UI/MainContainer";

import classes from "./MainData.module.css";

function MainData(props) {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function fetchDataHandler(isPeriodic) {
    setLoading(!isPeriodic && true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4200/data/");

      if (!response.ok) {
        throw new Error(`Response status ${response.status}`);
      }
      const data = await response.json();

      setData(data);
    } catch (error) {
      setError(error.message);
      setData(null);
    }
    setLoading(!isPeriodic && false);
  }

  useEffect(() => {
    fetchDataHandler(false);
  }, []);

  const button = (
    <Button
      className={classes.button}
      onClick={fetchDataHandler}
      onClickArgs={[false]}
    >
      Refresh
    </Button>
  );

  let dataContent = (
    <React.Fragment>
      <Card>No data</Card>
      {button}
    </React.Fragment>
  );
  if (data) {
    dataContent = <DataPanel refreshAction={fetchDataHandler} data={data} />;
  }
  if (error) {
    dataContent = (
      <React.Fragment>
        <Card>Error: could not fetch data!</Card>
        {button}
      </React.Fragment>
    );
  }

  return (
    <MainContainer>
      <CapturePanel/>
      {dataContent}
      {isLoading && <Loader />}
    </MainContainer>
  );
}

export default MainData;
