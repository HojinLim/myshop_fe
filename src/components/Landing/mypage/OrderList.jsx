import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import { SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Flex,
  message,
  Pagination,
  Row,
  Typography,
} from 'antd';
import styles from './index.module.css';
import MenuHeader from '@/components/common/MenuHeader';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOrderList } from '@/api/order';
import { returnBucketUrl } from '@/utils';
import dayjs from '@/utils/dayjs';

const OrderList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({ limit: 5, totalCount: 10 });

  const fetchOrderList = async () => {
    console.log(currentPage);

    await getOrderList(user.id, currentPage)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const filterd = res.data.filter((el) => el.order_items.length > 0);

          setOrderList(filterd);
          setPageInfo({ limit: res.limit, totalCount: res.totalCount });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchOrderList();
  }, [currentPage]);
  console.log(pageInfo);

  return (
    <Content className="overflow-x-hidden overflow-y-auto ">
      <MenuHeader title="주문내역" />
      <Divider className="!my-2" />
      <Flex vertical>
        {/* 주문 아이템 */}
        {orderList
          .flatMap((order) => order.order_items)
          .map((item, idx) => (
            <div key={idx} className="mb-6">
              <p className="font-bold text-lg">
                {dayjs(item.createdAt).format('YYYY.MM.DD')}
              </p>
              <Flex className="!mb-5">
                <img
                  width={100}
                  height={10}
                  src={returnBucketUrl(
                    item.product_option.Product.ProductImages[0].imageUrl
                  )}
                />
                <Flex vertical className="!ml-2">
                  <p className="font-bold !mb-3 h-5">{item.status}</p>
                  <p>
                    {Number(item.product_option.price).toLocaleString()}원
                    {item.quantity}개
                  </p>
                  <p className="text-gray-400">
                    {item.product_option.color} | {item.product_option.size}
                  </p>
                </Flex>
              </Flex>
              <Button
                className="w-full"
                onClick={() => {
                  navigate('/mypage/review/upload', {
                    state: item,
                  });
                }}
              >
                리뷰 작성
              </Button>
            </div>
          ))}
        <Pagination
          align="center"
          defaultCurrent={1}
          total={pageInfo.totalCount}
          pageSize={pageInfo.limit}
          current={currentPage}
          onChange={(page) => {
            setCurrentPage(page);

            // fetchOrderList();
          }}
        />
      </Flex>
    </Content>
  );
};

export default OrderList;
