import Header from "./components/Header/Header";
import MainData from "./components/DataPage/MainData";
import React, { useState } from "react";

import classes from './App.module.css';

function App() {
  const [ currentPage, setCurrentPage ] = useState(null);

  let content = <MainData className={classes.main} />;
  if (currentPage === 'config') {
    content = <div className={classes.main}>Here I will create config page!</div>;
  }

  function onNavigation(dest) {
    setCurrentPage(dest);
  }

  return (
    <React.Fragment>
      <Header title="Machine diagnostics" onSelect={onNavigation}/>
      {content}
    </React.Fragment>
  );
}

export default App;
