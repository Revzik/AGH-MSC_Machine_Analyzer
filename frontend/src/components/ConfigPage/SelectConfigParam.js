import React from "react";

import classes from "./ConfigParam.module.css";

function SelectConfigParam(props) {
  function changeHandler(event) {
    props.changeHandler({ [event.target.name]: event.target.value });
  }

  return (
    <div className={classes.param}>
      <div>{props.description}</div>
      <select name={props.name} onChange={changeHandler}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectConfigParam;
