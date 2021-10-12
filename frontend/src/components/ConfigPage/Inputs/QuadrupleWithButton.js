import React from "react";
import Button from "../../UI/Button";

import classes from "./Inputs.module.css";

function QuadrupleWithButton(props) {
  function changeHandler(event) {
    const keyAndId = event.target.name.split("_");
    props.changeHandler(
      keyAndId[1],
      keyAndId[0],
      event.target.value,
      validate(event.target.value)
    );
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
    <div className={`${classes.param} ${classes.large_inputs}`}>
      <input
        className={`${!props.content.order.valid && classes.invalid}`}
        name={`order_${props.index}`}
        value={props.content.order.value}
        type={props.type ?? "text"}
        onChange={changeHandler}
      />
      <input
        className={`${!props.content.x.valid && classes.invalid}`}
        name={`x_${props.index}`}
        value={props.content.x.value}
        type={props.type ?? "text"}
        onChange={changeHandler}
      />
      <input
        className={`${!props.content.y.valid && classes.invalid}`}
        name={`y_${props.index}`}
        value={props.content.y.value}
        type={props.type ?? "text"}
        onChange={changeHandler}
      />
      <input
        className={`${!props.content.z.valid && classes.invalid}`}
        name={`z_${props.index}`}
        value={props.content.z.value}
        type={props.type ?? "text"}
        onChange={changeHandler}
      />
      <Button small={true} onClick={props.onRemove} onClickArgs={props.index}>X</Button>
    </div>
  );
}

export default QuadrupleWithButton;
