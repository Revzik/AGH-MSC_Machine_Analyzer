import React from "react";

import MainContainer from "../UI/MainContainer";
import ConfigPanel from "./ConfigPanel";
import ThresholdsPanel from "./ThresholdsPanel";

function ConfigPage(props) {
  return (
    <MainContainer>
      <ConfigPanel />
      <ThresholdsPanel />
    </MainContainer>
  );
}

export default ConfigPage;
