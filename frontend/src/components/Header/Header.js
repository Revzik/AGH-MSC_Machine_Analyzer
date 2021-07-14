import React from "react";

import classes from "./Header.module.css";
import Navigation from "./Navigation";

function Header(props) {
  return (
    <header className={classes.header}>
      <h2>{props.title}</h2>
      <Navigation />
    </header>
  );
}

export default Header;