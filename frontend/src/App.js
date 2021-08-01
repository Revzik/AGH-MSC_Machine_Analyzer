import Header from "./components/Header/Header";
import MainData from "./components/DataPage/MainData";
import MainConfig from "./components/ConfigPage/MainConfig";
import MainCapture from "./components/CapturePage/MainCapture";
import React, { useState } from "react";

function App() {
  const [ currentPage, setCurrentPage ] = useState("data");

  let content = <MainData />;
  if (currentPage === 'config') {
    content = <MainConfig />;
  }
  if (currentPage === 'capture') {
    content = <MainCapture />;
  }

  function onNavigation(dest) {
    setCurrentPage(dest);
  }

  return (
    <React.Fragment>
      <Header title="Machine diagnostics" onSelect={onNavigation} currentPage={currentPage}/>
      {content}
    </React.Fragment>
  );
}

export default App;
