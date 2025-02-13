import React, { useEffect } from 'react';
import { Button, Spin } from 'antd';

const Loading = () => {
  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState(0);

  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;

    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);

      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
        setPercent(0);
      }
    }, 100);
  };
  useEffect(() => {
    showLoader();
  }, []);

  return (
    <>
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

export default Loading;
