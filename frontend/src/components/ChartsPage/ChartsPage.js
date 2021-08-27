import React, { useState, useEffect } from "react";
import MainContainer from "../UI/MainContainer";
import RawPanel from "./RawPanel";
import Loader from "../UI/Loader";
import Card from "../UI/Card";

function ChartsPage(props) {
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  async function fetchDataHandler() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:4200/data/raw/");

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

  let content = <Card>No data</Card>;
  if (data) {
    content = <RawPanel data={data} />;
  }
  if (isLoading) {
    content = <Loader />
  }
  if (error) {
    content = <Card>Could not fetch data!</Card>
  }

  return <MainContainer>{content}</MainContainer>;
}

export default ChartsPage;
