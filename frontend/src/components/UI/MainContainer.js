import React from "react";

import classes from "./MainContainer.module.css";

function MainContainer(props) {
  return (
    <main className={`${props.className} ${classes.main}`}>
      {props.children}
    </main>
  );
}

export default MainContainer;
