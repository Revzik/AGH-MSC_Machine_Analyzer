import React from "react";
import MainContainer from "../UI/MainContainer";
import RawPanel from "./RawPanel";
import DebugPanel from "./DebugPanel";

function ChartsPage(props) {
  return (
    <MainContainer>
      <RawPanel />
      {/*<DebugPanel />*/}
    </MainContainer>
  );
}

export default ChartsPage;
