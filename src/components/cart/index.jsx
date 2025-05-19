import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import {
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Input,
  Layout,
  Popconfirm,
  Row,
  Select,
  Typography,
} from 'antd';

import {
  HomeOutlined,
  UserOutlined,
  LeftOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import MenuHeader from '../common/MenuHeader';
import { MenuItem } from '../common/MenuItem';
import { Content, Footer, Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
const index = () => {
  const navi = useNavigate();
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <LeftOutlined />
        <div className={styles.title_container}>
          <p>장바구니</p>
        </div>
        <div className={styles.navi_icon_container}>
          <HomeOutlined
            onClick={() => {
              navi('/');
            }}
          />
          <UserOutlined
            className="ml-3"
            onClick={() => {
              navi('/mypage');
            }}
          />
        </div>
      </Header>
      <Content className={styles.content_layout}>
        <Flex justify="space-between" className={styles.select_container}>
          <div className="flex">
            <input type="checkbox" />
            <p>전체선택(1/2)</p>
          </div>
          <p>선택삭제</p>
        </Flex>
        <Divider />
        {/* 장바구니 상품들 */}
        <Flex className={styles.product_item}>
          <input className={styles.select_btn} type="checkbox" />
          <Flex vertical className="w-full">
            <Flex>
              <Image height={50} src="logo.png" />
              <p>벨로아 머슬핏 카라 반팔티</p>
              <Popconfirm
                title="삭제"
                description="선택한 상품을 삭제하시겠어요?"
                // onConfirm={confirm}
                // onCancel={cancel}
                okText="확인"
                cancelText="취소"
              >
                <CloseOutlined className={styles.close_btn} />
              </Popconfirm>
            </Flex>
            {/* 옵션 선택 */}
            <Select
              className={styles.select}
              defaultValue="lucy"
              style={{ width: 120 }}
              options={[{ value: 'lucy', label: 'Lucy' }]}
            />
            <Flex justify="space-between">
              <div className="flex items-center">
                <Button shape="circle" disabled>
                  -
                </Button>
                <p className="mx-3 font-bold">1</p>
                <Button shape="circle">+</Button>
              </div>
              {/* 상품 아이템 가격 */}
              <div className="flex items-center">
                <p className="line-through mr-1 text-xs text-gray-300">
                  59,800원
                </p>
                <p className="font-bold">59,800원</p>
              </div>
            </Flex>
          </Flex>
        </Flex>

        <Divider className={styles.custom_divider} />

        {/* 결제 컨테이너 */}
        <Flex vertical className={styles.pay_container}>
          <p className={styles.pay_title}>예상 결제금액</p>
          <Flex justify="space-between">
            <p>총 상품금액</p>
            <p>59,800원</p>
          </Flex>
          <Flex justify="space-between">
            <p>상품할인</p>
            <p>-29,800원</p>
          </Flex>
          <Flex justify="space-between">
            <p>쿠폰할인</p>
            <Button>쿠폰 선택</Button>
          </Flex>
          <Flex justify="space-between">
            <p>배송비</p>
            <p>무료배송</p>
          </Flex>
          <Divider />
          <Flex justify="space-between">
            <p>총 1개 주문금액</p>
            <p>29,900원</p>
          </Flex>
        </Flex>
      </Content>
      <Footer className={styles.footer}>
        <Button className={styles.buy_button}>29,900원 주문하기</Button>
      </Footer>
    </Layout>
  );
};

export default index;
