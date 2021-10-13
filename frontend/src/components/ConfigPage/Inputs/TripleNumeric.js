import React from "react";

import classes from "./Inputs.module.css";

function TripleNumeric(props) {
  function xChangeHandler(event) {
    props.changeHandler.x(event.target.name, event.target.value, validate(event.target.value));
  }

  function yChangeHandler(event) {
    props.changeHandler.y(event.target.name, event.target.value, validate(event.target.value));
  }

  function zChangeHandler(event) {
    props.changeHandler.z(event.target.name, event.target.value, validate(event.target.value));
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
        className={`${!props.content.x.valid && classes.invalid}`}
        name={props.name}
        value={props.content.x.value}
        type={props.type ?? "text"}
        onChange={xChangeHandler}
      />
      <input
        className={`${!props.content.y.valid && classes.invalid}`}
        name={props.name}
        value={props.content.y.value}
        type={props.type ?? "text"}
        onChange={yChangeHandler}
      />
      <input
        className={`${!props.content.z.valid && classes.invalid}`}
        name={props.name}
        value={props.content.z.value}
        type={props.type ?? "text"}
        onChange={zChangeHandler}
      />
    </div>
  );
}

export default TripleNumeric;
