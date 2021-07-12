import React from "react";

import classes from "./Navigation.module.css";

function Navigation() {
  return (
    <nav className={classes.navi}>
      <ul>
        <li>
          <a href="/">Data</a>
        </li>
        <li>
          <a href="/">Config</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
