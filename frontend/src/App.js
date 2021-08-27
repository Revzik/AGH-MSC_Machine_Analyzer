import Header from "./components/Header/Header";
import DataPage from "./components/DataPage/DataPage";
import ConfigPage from "./components/ConfigPage/ConfigPage";
import React, { useState } from "react";
import CalibrationPage from "./components/CalibrationPage/CalibrationPage";
import ChartsPage from "./components/ChartsPage/ChartsPage";

function App() {
  const [currentPage, setCurrentPage] = useState("data");

  let content = <DataPage />;
  if (currentPage === "config") {
    content = <ConfigPage />;
  }
  if (currentPage === "calibrate") {
    content = <CalibrationPage />;
  }
  if (currentPage === "charts") {
    content = <ChartsPage />;
  }
  
  function onNavigation(dest) {
    setCurrentPage(dest);
  }

  return (
    <React.Fragment>
      <Header
        title="Machine diagnostics"
        onSelect={onNavigation}
        currentPage={currentPage}
      />
      {content}
    </React.Fragment>
  );
}

export default App;
