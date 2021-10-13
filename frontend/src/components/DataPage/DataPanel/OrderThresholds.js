import React from "react";
import Card from "../../UI/Card";

import classes from "./Params.module.css";

function OrderThresholds(props) {
  let content = null;
  if (props.validations && props.validations.orders.length > 0) {
    content = (
      <Card className={classes.card}>
        <div>
          <span className={classes.name}>Watched orders</span>
        </div>
        <table className={classes.table}>
          <thead>
            <tr className={classes.namerow}>
              <th className={classes.namecol}>Order</th>
              <th className={classes.name}>X</th>
              <th className={classes.name}>Y</th>
              <th className={classes.name}>Z</th>
            </tr>
          </thead>
          <tbody>
            {props.validations.orders.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.order}</td>
                  <td className={`${!item.x.valid && classes.invalid}`}>
                    {+item.x.value.toFixed(3)}
                  </td>
                  <td className={`${!item.y.valid && classes.invalid}`}>
                    {+item.y.value.toFixed(3)}
                  </td>
                  <td className={`${!item.z.valid && classes.invalid}`}>
                    {+item.z.value.toFixed(3)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    );
  }

  return content;
}

export default OrderThresholds;
