import React from 'react';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

const Loading = () => {
  const loading = useSelector((state) => state.loading.loading);

  return <Spin spinning={loading} fullscreen />;
};

export default Loading;
