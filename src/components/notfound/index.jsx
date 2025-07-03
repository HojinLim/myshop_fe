import { Button, Result } from 'antd';
import React from 'react';
import { FrownTwoTone } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const index = (props) => {
  const { title, subTitle, type } = props;
  const navigate = useNavigate();
  return (
    <Result
      icon={<FrownTwoTone />}
      title={title || '옳지 않은 경로'}
      subTitle={subTitle || '메인 페이지로 돌아가려면 하단 버튼 클릭!'}
      extra={
        type !== 'noBtn' && (
          <Button
            type="primary"
            onClick={() => {
              navigate('/');
            }}
          >
            메인 페이지
          </Button>
        )
      }
    />
  );
};

export default index;
