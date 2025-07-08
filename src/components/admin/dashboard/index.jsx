import React, { useEffect, useState } from 'react';
import { Breadcrumb, Col, Row, Typography, Layout } from 'antd';
import styles from './index.module.css';

import { Line } from '@ant-design/charts';
import { Pie } from '@ant-design/plots';
import { getSales } from '@/api/order';
import dayjs from '@/utils/dayjs';
import { toWon } from '@/utils';

const index = () => {
  const now = dayjs();
  const [sales, setSales] = useState({ prevSales: 0, curSales: 0 });
  const [monthSalesData, setMonthSalesData] = useState([
    { month: '6', totalSales: 50000 },
    { month: '7', totalSales: 60000 },
  ]);

  const { Header, Content } = Layout;
  const { Text, Title } = Typography;

  const props = {
    data: monthSalesData,
    xField: 'month',
    yField: 'totalSales',
    yAxis: {
      // Y축 설정
      title: {
        // Y축 제목 (여기서 '매출' 라벨을 적용)
        text: '매출 (원)',
        style: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      },
    },
    title: {
      title: '월별 매출 추이',
      // subtitle: 'world',
    },
    meta: {
      totalSales: {
        alias: '매출', // 라벨
      },
    },
  };

  const [pieData, setPieData] = React.useState([
    { category: 'apple', totalSales: 27 },
    { category: 'banana', totalSales: 25 },
    { category: 'kiwi', totalSales: 18 },
  ]);

  const pieConfig = {
    data: pieData,
    angleField: 'totalSales',
    colorField: 'category',
    label: {
      text: 'totalSales',
      style: {
        fontWeight: 'bold',
      },
    },
    tooltip: {
      title: (d) => `${d.category}`,
    },
    title: {
      title: '카테고리별 매출 비중',
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  };
  const fetchSales = async () => {
    await getSales()
      .then((res) => {
        const result = res.result || [];
        if (Array.isArray(res.result) && res.result.length > 0) {
          // 월별 totalSales 합산
          const monthlyTotals = {};

          res.result.forEach((item) => {
            const month = item.month;
            const sales = parseInt(item.totalSales, 10);

            if (!monthlyTotals[month]) {
              monthlyTotals[month] = 0;
            }
            monthlyTotals[month] += sales;
          });

          // 배열로 변환 및 정렬
          const result = Object.entries(monthlyTotals)
            .map(([month, totalSales]) => ({
              month,
              totalSales,
            }))
            .sort((a, b) => (dayjs(a.month).isAfter(dayjs(b.month)) ? 1 : -1));

          setMonthSalesData(result);
          setLastCurSales(result);

          const categoryTotals = {};
          res.result.forEach((item) => {
            const category = item.category;
            const sales = parseInt(item.totalSales, 10);

            if (!categoryTotals[category]) {
              categoryTotals[category] = 0;
            }
            categoryTotals[category] += sales;
          });

          // 배열로 변환 및 정렬
          const categoryResults = Object.entries(categoryTotals)
            .map(([category, totalSales]) => ({
              category,
              totalSales,
            }))
            .sort((a, b) => (dayjs(a.month).isAfter(dayjs(b.month)) ? 1 : -1));
          console.log(categoryResults);
          setPieData(categoryResults);
        }
      })
      .catch(() => {});
  };
  // 지난달, 이번달 매출 적용
  const setLastCurSales = (arr) => {
    const curSales = arr.find((sale) => dayjs(sale.month).isSame(now, 'month'));
    const prevSales = arr.find((sale) =>
      dayjs(sale.month).isSame(now.subtract(1, 'month'), 'month')
    );

    setSales({
      prevSales: prevSales ? toWon(prevSales.totalSales) : 0,
      curSales: curSales ? toWon(curSales.totalSales) : 0,
    });
  };
  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <>
      <Header className={styles.header}>
        <Row>
          <Col span={8}>
            <Breadcrumb
              items={[{ title: '어드민' }, { title: '대쉬보드' }]}
              style={{ margin: '16px 0' }}
            />
          </Col>
          <Col span={8}></Col>
          <Col span={4} className="text-center">
            <Title level={5}>이번달</Title>
            <Text>{sales.curSales}원</Text>
          </Col>
          <Col span={4} className="text-center">
            <Title level={5}>저번달</Title>
            <Text>{sales.prevSales}원</Text>
          </Col>
        </Row>
      </Header>
      <Content className={styles.content}>
        <Row>
          <Col span={24} xl={{ span: 18 }} className={styles.content_container}>
            {/* <Title level={4} className="!mb-4">
              월별 매출 추이
            </Title> */}
            <Line {...props} />
          </Col>
          <Col span={24} xl={{ span: 6 }} className={styles.content_container}>
            {/* <Title level={4} className="!mb-4">
              카테고리별 매출 비중
            </Title> */}
            <Pie {...pieConfig} />
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default index;
