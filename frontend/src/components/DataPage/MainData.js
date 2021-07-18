import React, { useState, useEffect } from "react";
import DataPanel from "./DataPanel";
import Card from "../UI/Card";
import Loader from "../UI/Loader";
import Button from "../UI/Button";

import classes from "./MainData.module.css";

function MainData(props) {
  const [isError, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function fetchDataHandler(isPeriodic) {
    setLoading(!isPeriodic && true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4200/data");

      if (!response.ok) {
        throw new Error("Not ok");
      }
      const data = await response.json();

      setData(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(!isPeriodic && false);
  }

  useEffect(() => {
    fetchDataHandler(false);
  }, []);

  let content = <Card>No data</Card>;
  if (data) {
    content = <DataPanel refreshAction={fetchDataHandler} data={data} />;
  }
  if (isError) {
    content = <Card>Error: could not fetch data!</Card>;
  }

  return (
    <main className={`${props.className} ${classes.main}`}>
      {content}
      <Button className={classes.button} onClick={fetchDataHandler} onClickArgs={[false]}>Refresh</Button>
      {isLoading && <Loader />}
    </main>
  );
}

export default MainData;
