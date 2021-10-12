import React, { useEffect, useState } from "react";

import Card from "../UI/Card";
import Loader from "../UI/Loader";
import Button from "../UI/Button";
import Select from "./Inputs/Select";
import TripleNumeric from "./Inputs/TripleNumeric";

import classes from "./ConfigPage.module.css";
import TripleNumericMinMax from "./Inputs/TripleNumericMinMax";

function processNull(value) {
  if (value == null) {
    return "";
  }
}

function processEmpty(value) {
  if (value === "") {
    return null;
  }
}

function ThresholdsPanel(props) {
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [isValid, setValid] = useState(true);

  const [xThresholds, setXThresholds] = useState({
    rms: { value: "", valid: true },
    peak: { value: "", valid: true },
    kurtosisMin: { value: "", valid: true },
    kurtosisMax: { value: "", valid: true },
    crestFactorMin: { value: "", valid: true },
    crestFactorMax: { value: "", valid: true },
  });
  const [yThresholds, setYThresholds] = useState({
    rms: { value: "", valid: true },
    peak: { value: "", valid: true },
    kurtosisMin: { value: "", valid: true },
    kurtosisMax: { value: "", valid: true },
    crestFactorMin: { value: "", valid: true },
    crestFactorMax: { value: "", valid: true },
  });
  const [zThresholds, setZThresholds] = useState({
    rms: { value: "", valid: true },
    peak: { value: "", valid: true },
    kurtosisMin: { value: "", valid: true },
    kurtosisMax: { value: "", valid: true },
    crestFactorMin: { value: "", valid: true },
    crestFactorMax: { value: "", valid: true },
  });
  const [orderThresholds, setOrderThresholds] = useState([
    {
      order: { value: 0, valid: true },
      x: { value: "", valid: true },
      y: { value: "", valid: true },
      z: { value: "", valid: true },
    },
  ]);

  function parseThresholds() {
    let parsedThresholds = {
      x: {
        rms: processEmpty(xThresholds.rms.value),
        peak: processEmpty(xThresholds.peak.value),
        kurtosis: {
          min: processEmpty(xThresholds.kurtosisMin.value),
          max: processEmpty(xThresholds.kurtosisMax.value),
        },
        crestFactor: {
          min: processEmpty(xThresholds.crestFactorMin.value),
          max: processEmpty(xThresholds.crestFactorMax.value),
        },
      },
      y: {
        rms: processEmpty(yThresholds.rms.value),
        peak: processEmpty(yThresholds.peak.value),
        kurtosis: {
          min: processEmpty(yThresholds.kurtosisMin.value),
          max: processEmpty(yThresholds.kurtosisMax.value),
        },
        crestFactor: {
          min: processEmpty(yThresholds.crestFactorMin.value),
          max: processEmpty(yThresholds.crestFactorMax.value),
        },
      },
      z: {
        rms: processEmpty(zThresholds.rms.value),
        peak: processEmpty(zThresholds.peak.value),
        kurtosis: {
          min: processEmpty(zThresholds.kurtosisMin.value),
          max: processEmpty(zThresholds.kurtosisMax.value),
        },
        crestFactor: {
          min: processEmpty(zThresholds.crestFactorMin.value),
          max: processEmpty(zThresholds.crestFactorMax.value),
        },
      },
      orderSpectrum: [],
    };

    orderThresholds.forEach((threshold) => {
      parsedThresholds.orderSpectrum.push({
        order: processEmpty(threshold.order.value),
        x: processEmpty(threshold.x.value),
        y: processEmpty(threshold.y.value),
        z: processEmpty(threshold.z.value),
      });
    });

    return JSON.stringify(parsedThresholds);
  }

  async function fetchDataHandler() {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:4200/config/thresholds");

      if (!response.ok) {
        throw new Error(`Could not fetch thresholds! ${response}`);
      }

      const body = await response.json();
      setXThresholds({
        rms: { value: processNull(body.x.rms), valid: true },
        peak: { value: processNull(body.x.peak), valid: true },
        kurtosisMin: { value: processNull(body.x.kurtosis.min), valid: true },
        kurtosisMax: { value: processNull(body.x.kurtosis.max), valid: true },
        crestFactorMin: { value: processNull(body.x.crestFactor.min), valid: true },
        crestFactorMax: { value: processNull(body.x.crestFactor.max), valid: true },
      });
      setYThresholds({
        rms: { value: processNull(body.y.rms), valid: true },
        peak: { value: processNull(body.y.peak), valid: true },
        kurtosisMin: { value: processNull(body.y.kurtosis.min), valid: true },
        kurtosisMax: { value: processNull(body.y.kurtosis.max), valid: true },
        crestFactorMin: { value: processNull(body.y.crestFactor.min), valid: true },
        crestFactorMax: { value: processNull(body.y.crestFactor.max), valid: true },
      });
      setZThresholds({
        rms: { value: processNull(body.z.rms), valid: true },
        peak: { value: processNull(body.z.peak), valid: true },
        kurtosisMin: { value: processNull(body.z.kurtosis.min), valid: true },
        kurtosisMax: { value: processNull(body.z.kurtosis.max), valid: true },
        crestFactorMin: { value: processNull(body.z.crestFactor.min), valid: true },
        crestFactorMax: { value: processNull(body.z.crestFactor.max), valid: true },
      });
      setOrderThresholds(() => {
        const newThresholds = [];
        body.orderSpectrum.forEach((item) => {
          newThresholds.push({
            order: { max: processNull(item.order), valid: true },
            x: { max: processNull(item.x), valid: true },
            y: { max: processNull(item.y), valid: true },
            z: { max: processNull(item.z), valid: true },
          });
        });
        return newThresholds;
      });
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function applyThresholdsHandler(event) {
    setLoading(true);

    const thresholdsJson = parseThresholds();

    try {
      const response = await fetch("http://localhost:4200/config/thresholds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: thresholdsJson,
      });

      if (!response.ok) {
        throw new Error(`Could not fetch thresholds! ${response}`);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDataHandler();
  }, []);

  useEffect(() => {
    const isXValid = Object.values(xThresholds).every((value) => value.valid);
    const isYValid = Object.values(yThresholds).every((value) => value.valid);
    const isZValid = Object.values(zThresholds).every((value) => value.valid);
    const areOrdersValid = orderThresholds.every((order) =>
      Object.values(order).every((value) => value.valid)
    );

    setValid(isXValid && isYValid && isZValid && areOrdersValid);
  }, [xThresholds, yThresholds, zThresholds, orderThresholds]);

  function xThresholdUpdated(key, value, valid) {
    console.log(`key: ${key}, value: ${value}, valid: ${valid}`);
    setXThresholds((prevState) => {
      return {
        ...prevState,
        [key]: { value: value, valid: valid },
      };
    });
  }

  function yThresholdUpdated(key, value, valid) {
    setYThresholds((prevState) => {
      return {
        ...prevState,
        [key]: { value: value, valid: valid },
      };
    });
  }

  function zThresholdUpdated(key, value, valid) {
    setZThresholds((prevState) => {
      return {
        ...prevState,
        [key]: { value: value, valid: valid },
      };
    });
  }

  function orderThresholdUpdated(key, value, valid) {
    setOrderThresholds((prevState) => {
      return {
        ...prevState,
        [key]: { value: value, valid: valid },
      };
    });
  }

  const axisUpdated = {
    x: xThresholdUpdated,
    y: yThresholdUpdated,
    z: zThresholdUpdated,
  };

  return (
    <Card title="Thresholds" className={classes.card}>
      <div className={classes.title_first}>Statistical parameters</div>
      <div className={classes.header}>
        <div>Axis</div>
        <div>X</div>
        <div>Y</div>
        <div>Z</div>
      </div>
      <TripleNumeric
        name="rms"
        description="RMS [m/s^2]"
        lower="0"
        optional={true}
        changeHandler={axisUpdated}
        content={{ x: xThresholds.rms, y: yThresholds.rms, z: zThresholds.rms }}
      />
      <TripleNumeric
        name="peak"
        description="Peak [m/s^2]"
        lower="0"
        optional={true}
        changeHandler={axisUpdated}
        content={{
          x: xThresholds.peak,
          y: yThresholds.peak,
          z: zThresholds.peak,
        }}
      />
      <div className={classes.header}>
        <div></div>
        <div className={classes.inner}>
          <div>Min</div>
          <div>Max</div>
        </div>
        <div className={classes.inner}>
          <div>Min</div>
          <div>Max</div>
        </div>
        <div className={classes.inner}>
          <div>Min</div>
          <div>Max</div>
        </div>
      </div>
      <TripleNumericMinMax
        name="kurtosis"
        description="Kurtosis"
        optional={true}
        changeHandler={axisUpdated}
        content={{
          xMin: xThresholds.kurtosisMin,
          xMax: xThresholds.kurtosisMax,
          yMin: yThresholds.kurtosisMin,
          yMax: yThresholds.kurtosisMax,
          zMin: zThresholds.kurtosisMin,
          zMax: zThresholds.kurtosisMax,
        }}
      />
      <TripleNumericMinMax
        name="crestFactor"
        description="Crest factor"
        lower="0"
        optional={true}
        changeHandler={axisUpdated}
        content={{
          xMin: xThresholds.crestFactorMin,
          xMax: xThresholds.crestFactorMax,
          yMin: yThresholds.crestFactorMin,
          yMax: yThresholds.crestFactorMax,
          zMin: zThresholds.crestFactorMin,
          zMax: zThresholds.crestFactorMax,
        }}
      />
      <div className={classes.title}>Order spectrum</div>
    </Card>
  );
}

export default ThresholdsPanel;
