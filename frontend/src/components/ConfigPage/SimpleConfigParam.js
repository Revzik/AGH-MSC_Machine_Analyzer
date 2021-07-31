import React from "react";

import classes from "./ConfigParam.module.css";

function SimpleConfigParam(props) {
  function validate(value) {
    const validations = props.type.split(":");

    if (validations[0] === "" || validations[0] === "text") {
      return true;
    }

    value = +value;
    if (
      isNaN(value) ||
      (validations[0] === "int" && value !== parseInt(value))
    ) {
      return false;
    }

    for (let i = 1; i < validations.length; i++) {
      if (validations[i] === "positive" && value < 0) {
        return false;
      } else if (validations[i] === "nonZero" && value === 0) {
        return false;
      } else if (validations[i].includes("between")) {
        const allowed = validations[i].split(",");
        if (value < +allowed[1] || value > +allowed[2]) {
          return false;
        }
      }
    }

    return true;
  }

  function changeHandler(event) {
    props.changeHandler(
      event.target.name,
      event.target.value,
      validate(event.target.value)
    );
  }

  return (
    <div className={`${classes.param} ${!props.isValid && classes.invalid}`}>
      <div>{props.description}</div>
      <input
        name={props.name}
        value={props.value}
        type={props.type ? props.type : "number"}
        onChange={changeHandler}
      />
    </div>
  );
}

export default SimpleConfigParam;
