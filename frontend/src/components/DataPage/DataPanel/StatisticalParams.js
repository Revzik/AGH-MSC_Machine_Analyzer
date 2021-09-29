import React from "react";
import Card from "../../UI/Card";

import classes from "./StatisticalParams.module.css";

function StatisticalParams(props) {
  return (
    <Card className={classes.card}>
      <div>
        <span className={classes.name}>Frequency: </span>
        <span>{+props.data.f.toFixed(2)}</span>
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
            <td>{+props.data.x.rms.toFixed(2)}</td>
            <td>{+props.data.y.rms.toFixed(2)}</td>
            <td>{+props.data.z.rms.toFixed(2)}</td>
          </tr>
          <tr>
            <td className={`${classes.name} ${classes.namecol}`}>
              Peak [m/s^2]:
            </td>
            <td>{+props.data.x.peak.toFixed(2)}</td>
            <td>{+props.data.y.peak.toFixed(2)}</td>
            <td>{+props.data.z.peak.toFixed(2)}</td>
          </tr>
          <tr>
            <td className={classes.name}>Kurtosis:</td>
            <td>{+props.data.x.kurtosis.toFixed(2)}</td>
            <td>{+props.data.y.kurtosis.toFixed(2)}</td>
            <td>{+props.data.z.kurtosis.toFixed(2)}</td>
          </tr>
          <tr>
            <td className={classes.name}>Crest factor:</td>
            <td>{+props.data.x.crestFactor.toFixed(2)}</td>
            <td>{+props.data.y.crestFactor.toFixed(2)}</td>
            <td>{+props.data.z.crestFactor.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

export default StatisticalParams;
