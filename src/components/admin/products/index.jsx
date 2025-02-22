import { Avatar, Button, Col, Form, Image, Input, Row, Typography } from 'antd';
import Layout, { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import styles from './index.module.css';
import logo from '@/assets/images/logo.png';
import { CameraFilled } from '@ant-design/icons';
import { AdminMenuItem } from '@/components/common/AdminMenuItem';
const index = () => {
  const [productnForm, setForm] = useState({
    image: null,
    name: '',
    category: '',
    originPrice: '',
    discountPrice: '',
  });
  const productList = [
    { index: 1, image: logo, category: '전체' },
    { index: 2, image: logo, category: '신발' },
    { index: 3, image: logo, category: '양말' },
    { index: 4, image: logo, category: '상의' },
    { index: 5, image: logo, category: '하의' },
    { index: 6, image: logo, category: '아우터' },
    { index: 7, image: logo, category: '악세사리' },
    { index: 8, image: logo, category: '반지' },
    { index: 9, image: logo, category: '주얼리' },
    { index: 10, image: logo, category: 'etc' },
  ];
  const [products, setProducts] = useState(productList);
  return (
    <Content>
      <Row className={styles.product_page_container}>
        {/* 상품 리스트 디스플레이 영역 */}
        <Col span={14} className="border-r">
          <Row>
            <Col span={2}></Col>
            {products.slice(0, 5).map((item, idx) => (
              <AdminMenuItem
                products={products}
                setProducts={setProducts}
                item={item}
              />
            ))}

            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            {products.slice(5, 10).map((item, idx) => (
              <AdminMenuItem
                products={products}
                setProducts={setProducts}
                item={item}
              />
            ))}
            <Col span={2}></Col>
          </Row>
          <Col span={24}>
            <Button className={styles.update_button}>업데이트</Button>
          </Col>
        </Col>
        {/* 상품 추가 영역 */}
        <Col span={10}>
          <Row>
            <Col span={24} className="text-center">
              <Image
                src={logo}
                width={300}
                forceRender={false}
                preview={false}
              />
            </Col>
            <Col span={24} className="text-center">
              <Button onClick={() => clcikUpload()}>
                <CameraFilled /> 사진 올리기
              </Button>{' '}
            </Col>
            <Col span={24}>
              <Form
                className="form_container"
                name="basic"
                // {...theme.commonFormProps}
                labelAlign="left"
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 24,
                }}
                initialValues={{
                  remember: true,
                }}
                // onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Typography.Title level={5}>상품명</Typography.Title>
                <Form.Item
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '폼을 입력해주세요!',
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>

                <Typography.Title level={5}>카테고리</Typography.Title>
                <Form.Item
                  name="category"
                  rules={[
                    {
                      required: true,
                      message: '폼을 입력해주세요!',
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
                <Typography.Title level={5}>기존 가격</Typography.Title>
                <Form.Item
                  name="originPrice"
                  rules={[
                    {
                      required: true,
                      message: '폼을 입력해주세요!',
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
                <Typography.Title level={5}>할인된 가격</Typography.Title>
                <Form.Item
                  name="discountPrice"
                  rules={[
                    {
                      required: true,
                      message: '폼을 입력해주세요!',
                    },
                  ]}
                >
                  <Input type="text" />
                </Form.Item>
              </Form>
            </Col>
            <Col span={24}>
              <Button type="primary" htmlType="submit" className="w-full">
                상품 등록
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Content>
  );
};

export default index;
