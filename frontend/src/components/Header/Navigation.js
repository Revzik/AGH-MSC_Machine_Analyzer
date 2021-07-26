import React from "react";
import NavButton from "./NavButton";

import classes from "./Navigation.module.css";

function Navigation(props) {
  return (
    <nav className={classes.navi}>
      <ul>
        <li>
          <NavButton onClick={props.onSelect} onClickArgs={["data"]}>
            Data
          </NavButton>
        </li>
        <li>
          <NavButton onClick={props.onSelect} onClickArgs={["config"]}>
            Config
          </NavButton>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
