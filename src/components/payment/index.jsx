import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content } from 'antd/es/layout/layout';
import {
  Button,
  Col,
  Divider,
  Flex,
  Image,
  Input,
  Row,
  Typography,
} from 'antd';
import Title from 'antd/es/typography/Title';
import {
  UpOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
const index = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const { Text } = Typography;
  return (
    <Content className={styles.payment_container}>
      <Row>
        <Col span={24}>
          <Flex
            justify="space-between"
            align="center"
            className={styles.menu_container}
          >
            <Title level={4}>주문 상품 총 1개</Title>

            <div onClick={(e) => setMenuOpen(!menuOpen)}>
              {menuOpen ? (
                <UpOutlined className="cursor-pointer" />
              ) : (
                <DownOutlined className="cursor-pointer" />
              )}
            </div>
          </Flex>
        </Col>
        <Col span={24} className="p-5">
          {menuOpen && (
            <Flex vertical>
              <Title level={5}>배송 상품 1개</Title>
              <Flex>
                <Image width={50} src="./logo.png"></Image>
                <Flex vertical>
                  <Typography.Text>
                    탄탄 골지 카라 긴팔 니트 (6 COLOR)
                  </Typography.Text>
                  <Flex>
                    <Typography.Text>56,900원</Typography.Text>
                    <Typography.Text>수량 1개</Typography.Text>
                  </Flex>
                </Flex>
              </Flex>
              <Text className={styles.item_container} level={4}>
                검정 / 프리
              </Text>
            </Flex>
          )}
        </Col>
        <Divider />
        <Content>
          <Col span={24}>
            <Flex justify="space-between">
              <h4>배송지 정보</h4>
              <span className="text-blue-500 cursor-pointer">입력하기</span>
            </Flex>
            <div className="text-gray-400">배송지를 입력해주세요.</div>
          </Col>
        </Content>
        <Divider />

        <Col span={24}>
          <h4>쿠폰 / 포인트</h4>
        </Col>
        {/* 쿠폰 input */}
        <Col span={20}>
          <Input variant="underlined" placeholder="쿠폰" />
        </Col>
        <Col span={4}>
          <Button>쿠폰 선택</Button>
        </Col>

        <Col span={20}>
          <Input variant="underlined" placeholder="포인트" />
        </Col>
        <Col span={4}>
          <Button>모두 사용</Button>
        </Col>
      </Row>
      <Divider />
      <Col span={24}>
        <h4>결제 방법</h4>
        <InfoCircleOutlined />
      </Col>
      <Row className={styles.button_container}>
        <Col span={6}>
          <Button>간편결제</Button>
        </Col>
        <Col span={6}>
          <Button>카드</Button>
        </Col>
        <Col span={6}>
          <Button>현금</Button>
        </Col>
        <Col span={6}>
          <Button>휴대폰</Button>
        </Col>
      </Row>
      <div className={styles.bottom_container} span={24}>
        <Divider />
        <Button>56,900원 결제하기</Button>
      </div>
    </Content>
  );
};

export default index;
