import React, { useState, useEffect } from "react";
import DataPanel from "./DataPanel";
import Card from "../UI/Card";

import classes from "./MainData.module.css";

function MainData(props) {
  const [isError, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function fetchDataHandler() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/data");

      if (!response.ok) {
        throw new Error("Not ok");
      }
      const data = await response.json();

      setData(data);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDataHandler();
  }, []);

  let content = <Card>No data</Card>;
  if (data) {
    content = <DataPanel data={data} />;
  }
  if (isError) {
    content = <Card>Error: could not fetch data!</Card>;
  }
  if (isLoading) {
    content = <Card>Loading data...</Card>;
  }

  return (
    <main className={`${props.className} ${classes.main}`}>
      {content}
      <button onClick={fetchDataHandler}>Refresh</button>
    </main>
  );
}

export default MainData;
