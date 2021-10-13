import React from "react";

import classes from './Inputs.module.css';

function Numeric(props) {
  function changeHandler(event) {
    props.changeHandler(event.target.name, event.target.value, validate(event.target.value));
  }

  function validate(value) {
    if (props.optional && value === "") {
      return true;
    }

    let numeric = +value;
    if (isNaN(+numeric)) {
      return false;
    }

    if (props.lower && numeric < +props.lower) {
      return false;
    }
    if (props.higher && numeric > +props.higher) {
      return false;
    }

    return true;
  }

  return (
    <div className={classes.param}>
      <div>{props.description}</div>
      <input
        className={`${!props.content.valid && classes.invalid}`}
        name={props.name}
        value={props.content.value}
        type={props.type ?? "text"}
        onChange={changeHandler}
      />
    </div>
  );
}

export default Numeric;
