import Header from "./components/Header/Header";
import MainData from "./components/DataPage/MainData";
import React from "react";

import classes from './App.module.css';

function App() {
  return (
    <React.Fragment>
      <Header title="Machine diagnostics" />
      <MainData className={classes.main} />
    </React.Fragment>
  );
}

export default App;
