import React from 'react';
import { Breadcrumb, Col, Row, Typography, Layout } from 'antd';
import styles from './index.module.css';

import { Line } from '@ant-design/charts';
import { Pie } from '@ant-design/plots';
import { AppstoreOutlined } from '@ant-design/icons';

const index = () => {
  const { Header, Content } = Layout;
  const { Text, Title } = Typography;

  const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
  ];
  const props = {
    data,
    xField: 'year',
    yField: 'value',
  };

  const [pieData, setData] = React.useState([]);
  React.useEffect(() => {
    setTimeout(() => {
      setData([
        { type: 'apple', value: 27 },
        { type: 'banana', value: 25 },
        { type: 'kiwi', value: 18 },
        { type: 'orange', value: 15 },
      ]);
    }, 1000);
  }, []);
  const pieConfig = {
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };

  return (
    <>
      <Header className={styles.header}>
        <Row>
          <Col span={7}>
            <Breadcrumb
              items={[{ title: '어드민' }, { title: '대쉬보드' }]}
              style={{ margin: '16px 0' }}
            />
          </Col>
          <Col span={9}></Col>
          <Col span={4} className="text-center">
            <Title level={5}>이번달</Title>
            <Text>00,000원</Text>
          </Col>
          <Col span={4} className="text-center">
            <Title level={5}>저번달</Title>
            <Text>00,000원</Text>
          </Col>
        </Row>
      </Header>
      <Content className={styles.content}>
        <Row>
          <Col span={18} className={styles.content_container}>
            <Line {...props} />
          </Col>
          <Col span={6} className={styles.content_container}>
            <Pie {...pieConfig} />
          </Col>
          <Col
            span={24}
            className={styles.content_container}
            style={{ marginTop: '10px' }}
          >
            <Line {...props} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default index;
