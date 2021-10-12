import React from "react";

import classes from "./Toggle.module.css";

function Toggle(props) {
  function onChange(event) {
    props.onChange(event.target.checked);
  }

  return (
    <label class={classes.switch}>
      <input type="checkbox" onChange={onChange}/>
      <span class={`${classes.slider} ${classes.round}`}></span>
    </label>
  );
}

export default Toggle;
