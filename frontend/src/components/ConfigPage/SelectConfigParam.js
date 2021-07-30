import React from "react";

import classes from "./ConfigParam.module.css";

function SelectConfigParam(props) {
  return (
    <div className={classes.param}>
      <div>{props.name}</div>
      <select>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>{option.name}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectConfigParam;
