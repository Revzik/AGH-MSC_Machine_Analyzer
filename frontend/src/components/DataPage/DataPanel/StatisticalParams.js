import React from "react";
import Card from "../../UI/Card";

import classes from "./Params.module.css";

function StatisticalParams(props) {
  return (
    <Card className={classes.card}>
      <div>
        <span className={classes.name}>Frequency: </span>
        <span>{+props.data.f.toFixed(3)}</span>
        <span>Hz</span>
      </div>
      <table className={classes.table}>
        <thead>
          <tr className={classes.namerow}>
            <th className={classes.namecol} />
            <th className={classes.name}>X</th>
            <th className={classes.name}>Y</th>
            <th className={classes.name}>Z</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className={`${classes.name} ${classes.namecol}`}>
              RMS [m/s^2]:
            </td>
            <td className={`${!props.validations.x.rms && classes.invalid}`}>{+props.data.x.rms.toFixed(3)}</td>
            <td className={`${!props.validations.y.rms && classes.invalid}`}>{+props.data.y.rms.toFixed(3)}</td>
            <td className={`${!props.validations.z.rms && classes.invalid}`}>{+props.data.z.rms.toFixed(3)}</td>
          </tr>
          <tr>
            <td className={`${classes.name} ${classes.namecol}`}>
              Peak [m/s^2]:
            </td>
            <td className={`${!props.validations.x.peak && classes.invalid}`}>{+props.data.x.peak.toFixed(3)}</td>
            <td className={`${!props.validations.y.peak && classes.invalid}`}>{+props.data.y.peak.toFixed(3)}</td>
            <td className={`${!props.validations.z.peak && classes.invalid}`}>{+props.data.z.peak.toFixed(3)}</td>
          </tr>
          <tr>
            <td className={classes.name}>Kurtosis:</td>
            <td className={`${!props.validations.x.kurtosis && classes.invalid}`}>{+props.data.x.kurtosis.toFixed(3)}</td>
            <td className={`${!props.validations.y.kurtosis && classes.invalid}`}>{+props.data.y.kurtosis.toFixed(3)}</td>
            <td className={`${!props.validations.z.kurtosis && classes.invalid}`}>{+props.data.z.kurtosis.toFixed(3)}</td>
          </tr>
          <tr>
            <td className={classes.name}>Crest factor:</td>
            <td className={`${!props.validations.x.crestFactor && classes.invalid}`}>{+props.data.x.crestFactor.toFixed(3)}</td>
            <td className={`${!props.validations.y.crestFactor && classes.invalid}`}>{+props.data.y.crestFactor.toFixed(3)}</td>
            <td className={`${!props.validations.z.crestFactor && classes.invalid}`}>{+props.data.z.crestFactor.toFixed(3)}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}

export default StatisticalParams;
