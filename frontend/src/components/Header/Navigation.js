import React from "react";
import NavButton from "../UI/NavButton";

import classes from "./Navigation.module.css";

function Navigation(props) {
  return (
    <nav className={classes.navi}>
      <ul>
        <li>
          <NavButton
            onClick={props.onSelect}
            selected={!props.currentPage || props.currentPage === "data"}
            onClickArgs={["data"]}
          >
            Data
          </NavButton>
        </li>
        <li>
          <NavButton
            onClick={props.onSelect}
            selected={props.currentPage === "config"}
            onClickArgs={["config"]}
          >
            Config
          </NavButton>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
