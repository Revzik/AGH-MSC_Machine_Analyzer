import React from "react";
import Card from "../../UI/Card";

import classes from "./StatisticalParams.module.css";

function StatisticalParams(props) {
  return (
    <Card className={classes.card}>
      <div>
        <span className={classes.name}>Frequency: </span>
        <span>{props.data.frequency}</span>
        <span>Hz</span>
      </div>
      <table className={classes.table}>
        <thead>
          <tr className={classes.namerow}>
            <th className={classes.namecol} />
            <th className={classes.name}>x</th>
            <th className={classes.name}>y</th>
            <th className={classes.name}>z</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${classes.name} ${classes.namecol}`}>
              RMS [m/s^2]:
            </td>
            <td>{props.data.x.rms}</td>
            <td>{props.data.y.rms}</td>
            <td>{props.data.z.rms}</td>
          </tr>
          <tr>
            <td className={classes.name}>Kurtosis:</td>
            <td>{props.data.x.kurtosis}</td>
            <td>{props.data.y.kurtosis}</td>
            <td>{props.data.z.kurtosis}</td>
          </tr>
          <tr>
            <td className={classes.name}>Crest factor:</td>
            <td>{props.data.x.peakFactor}</td>
            <td>{props.data.y.peakFactor}</td>
            <td>{props.data.z.peakFactor}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

export default StatisticalParams;
