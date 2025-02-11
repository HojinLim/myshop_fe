import { Button, Result } from 'antd';
import React from 'react';
import { FrownTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const index = () => {
  const navigate = useNavigate();
  return (
    <Result
      icon={<FrownTwoTone />}
      title="옳지 않은 경로"
      subTitle="메인 페이지로 돌아가려면 하단 버튼 클릭!"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate('/', { replace: true });
          }}
        >
          메인 페이지
        </Button>
      }
    />
  );
};

export default index;
