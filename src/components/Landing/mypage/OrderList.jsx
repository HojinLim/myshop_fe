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
  Popconfirm,
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
import MenuDrawer from '@/components/common/MenuDrawer';
import { refundProduct } from '@/api/payment';

const OrderList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 기본 5개
  const [pageInfo, setPageInfo] = useState({ limit: 5, totalCount: 10 });

  if (!user?.id) navigate('/login');

  const fetchOrderList = async () => {
    await getOrderList(user.id, currentPage, pageSize)
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const filtered = res.data
            .filter((el) => el.order_items.length > 0)
            .map((data) => ({
              ...data,
              imp_uid: data.imp_uid,
            }));

          setOrderList(filtered);

          setPageInfo({ limit: res.limit, totalCount: res.totalCount });
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchOrderList();
  }, [currentPage, pageSize]);

  const clickRefund = async (imp_uid, amount, reason, order_item_id) => {
    await refundProduct(imp_uid, amount, reason, order_item_id)
      .then((res) => {
        fetchOrderList();
        message.success('환불 완료!');
      })
      .catch((err) => {});
  };

  return (
    <Content className="overflow-x-hidden overflow-y-auto ">
      <MenuHeader title="주문내역" />
      <Divider className="!my-2" />
      <Flex vertical>
        {/* 주문 아이템 */}
        {orderList.map((order) => (
          <div key={order.id} className="mb-6">
            {/* 주문 날짜는 한 번만 출력 */}
            <p className="font-bold text-lg">
              {dayjs(order.createdAt).format('YYYY.MM.DD')} 주문
            </p>

            {/* 주문에 포함된 상품들 */}
            {order.order_items.map((item) => (
              <div key={item.id} className="mb-6">
                <Flex className="!mb-5">
                  <img
                    width={100}
                    height={10}
                    src={
                      item.product_option.Product?.ProductImages?.find(
                        (img) => img.type === 'main'
                      )
                        ? returnBucketUrl(
                            item.product_option.Product?.ProductImages?.find(
                              (img) => img.type === 'main'
                            ).imageUrl
                          )
                        : '/none_logo.png'
                    }
                  />
                  <Flex vertical className="!ml-2">
                    <p className="font-bold !mb-3 h-5">{item.status}</p>
                    <p>
                      {Number(item.product_option.price).toLocaleString()}원{' '}
                      {item.quantity}개
                    </p>
                    <p className="text-gray-400">
                      {item.product_option.color} | {item.product_option.size}
                    </p>
                  </Flex>
                </Flex>

                <Flex className="w-full">
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
                  {item.status !== 'refunded' && (
                    <Popconfirm
                      title="환불하기"
                      description="정말 환불하시겠습니까?"
                      onConfirm={() =>
                        clickRefund(
                          order.imp_uid,
                          item.quantity * item.price,
                          '',
                          item.id
                        )
                      }
                      okText="네"
                      cancelText="아니오"
                    >
                      <Button className="w-full">환불하기</Button>
                    </Popconfirm>
                  )}
                </Flex>
              </div>
            ))}
          </div>
        ))}

        <Pagination
          align="center"
          current={currentPage}
          pageSize={pageSize}
          total={pageInfo.totalCount}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
        />
      </Flex>
    </Content>
  );
};

export default OrderList;
