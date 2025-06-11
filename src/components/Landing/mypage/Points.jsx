import MenuHeader from '@/components/common/MenuHeader';
import styles from './index.module.css';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import { Divider, Flex } from 'antd';
import { useSelector } from 'react-redux';
import { toWon } from '@/utils';
import dayjs from '@/utils/dayjs';
import { getPoints } from '@/api/points';

const Points = () => {
  const user = useSelector((state) => state.user.data);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    await getPoints(user.id)
      .then((res) => {
        console.log(res.data);
        setPoints(res.data);
      })
      .catch(() => {});
  };
  return (
    <Content>
      <MenuHeader title="포인트" />
      <p className="text-gray-400 text-lg">현재 포인트</p>
      <p className="text-2xl font-bold">Ⓟ {toWon(user.points)}원</p>
      <Divider />
      {/* 포인트 전체 내역 */}
      <Flex vertical className={styles.point_list_container}>
        {points.map((point, idx) => (
          <div>
            <Flex className={styles.point_item}>
              <p>{dayjs(point.createdAt).format('MM.DD')}</p>
              <div className="flex flex-col">
                <p>관리자의 선물</p>
                <p>{dayjs(point.createdAt).format('HH:MM')}</p>
              </div>
              <p>
                {Math.sign(point.point) ? '+' : '-'}
                {point.point}P
              </p>
            </Flex>
            <Divider />
          </div>
        ))}
      </Flex>
    </Content>
  );
};

export default Points;
