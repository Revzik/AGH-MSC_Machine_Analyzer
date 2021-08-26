import React from "react";
import Card from "../../UI/Card";

function StatisticalParams(props) {
  return (
    <Card>
      <span>Frequency: </span>
      <span>{props.data.frequency}</span>
      <span>Hz</span>
      <table>
        <tr>
          <th />
          <th>x</th>
          <th>y</th>
          <th>z</th>
        </tr>
        <tr>
          <td>rms:</td>
          <td>{props.data.x.rms}m/s^2</td>
          <td>{props.data.y.rms}m/s^2</td>
          <td>{props.data.z.rms}m/s^2</td>
        </tr>
        <tr>
          <td>kurtosis:</td>
          <td>{props.data.x.kurtosis}</td>
          <td>{props.data.y.kurtosis}</td>
          <td>{props.data.z.kurtosis}</td>
        </tr>
        <tr>
          <td>peak factor:</td>
          <td>{props.data.x.peakFactor}</td>
          <td>{props.data.y.peakFactor}</td>
          <td>{props.data.z.peakFactor}</td>
        </tr>
      </table>
    </Card>
  );
}

export default StatisticalParams;
