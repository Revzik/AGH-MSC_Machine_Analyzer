import React from "react";

import classes from "./Inputs.module.css";

function Select(props) {
  function changeHandler(event) {
    props.changeHandler(event.target.name, event.target.value, true);
  }

  return (
    <div className={classes.param}>
      <div>{props.description}</div>
      <select value={props.value} name={props.name} onChange={changeHandler}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Select;
