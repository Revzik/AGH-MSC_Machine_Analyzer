import React from "react";
import NavButton from "../UI/NavButton";

import classes from "./Navigation.module.css";

function Navigation(props) {
  const pages = [
    { title: "Data", key: "data" },
    { title: "Charts", key: "charts" },
    { title: "Calibration", key: "calibrate" },
    { title: "Config", key: "config" },
  ];

  return (
    <nav className={classes.navi}>
      <ul>
        {pages.map((page) => {
          return (
            <li key={page.key}>
              <NavButton
                onClick={props.onSelect}
                selected={props.currentPage === page.key}
                onClickArgs={[page.key]}
              >
                {page.title}
              </NavButton>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Navigation;
