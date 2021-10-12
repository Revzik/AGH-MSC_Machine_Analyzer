import React from "react";

import classes from "./Inputs.module.css";

function TripleNumericMinMax(props) {
  function xMinChangeHandler(event) {
    props.changeHandler.x(`${event.target.name}Min`, event.target.value, validate(event.target.value));
  }
  
  function xMaxChangeHandler(event) {
    props.changeHandler.x(`${event.target.name}Max`, event.target.value, validate(event.target.value));
  }

  function yMinChangeHandler(event) {
    props.changeHandler.y(`${event.target.name}Min`, event.target.value, validate(event.target.value));
  }

  function yMaxChangeHandler(event) {
    props.changeHandler.y(`${event.target.name}Max`, event.target.value, validate(event.target.value));
  }

  function zMinChangeHandler(event) {
    props.changeHandler.z(`${event.target.name}Min`, event.target.value, validate(event.target.value));
  }

  function zMaxChangeHandler(event) {
    props.changeHandler.z(`${event.target.name}Max`, event.target.value, validate(event.target.value));
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
      <div className={classes.inner}>
        <input
          className={`${!props.content.xMin.valid && classes.invalid}`}
          name={props.name}
          value={props.content.xMin.value}
          type={props.type ?? "text"}
          onChange={xMinChangeHandler}
        />
        <input
          className={`${!props.content.xMax.valid && classes.invalid}`}
          name={props.name}
          value={props.content.xMax.value}
          type={props.type ?? "text"}
          onChange={xMaxChangeHandler}
        />
      </div>
      <div className={classes.inner}>
        <input
          className={`${!props.content.yMin.valid && classes.invalid}`}
          name={props.name}
          value={props.content.yMin.value}
          type={props.type ?? "text"}
          onChange={yMinChangeHandler}
        />
        <input
          className={`${!props.content.yMax.valid && classes.invalid}`}
          name={props.name}
          value={props.content.yMax.value}
          type={props.type ?? "text"}
          onChange={yMaxChangeHandler}
        />
      </div>
      <div className={classes.inner}>
        <input
          className={`${!props.content.zMin.valid && classes.invalid}`}
          name={props.name}
          value={props.content.zMin.value}
          type={props.type ?? "text"}
          onChange={zMinChangeHandler}
        />
        <input
          className={`${!props.content.zMax.valid && classes.invalid}`}
          name={props.name}
          value={props.content.zMax.value}
          type={props.type ?? "text"}
          onChange={zMaxChangeHandler}
        />
      </div>
    </div>
  );
}

export default TripleNumericMinMax;
