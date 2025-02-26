import {
  Avatar,
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Typography,
} from 'antd';
import Layout, { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import logo from '@/assets/images/logo.png';
import { CameraFilled } from '@ant-design/icons';
import { AdminMenuItem } from '@/components/common/AdminMenuItem';
import { getCategories } from '@/api/category';

const index = () => {
  const [categories, setCategories] = useState([]);
  const [originCategories, setOriginCategories] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [originText, setOriginText] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [changed, setChanged] = useState(false);

  const getCategoryList = async () => {
    await getCategories()
      .then((res) => {
        console.log(res);
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
          setOriginCategories(res.categories);

          const nameList = res.categories.map((category) => ({
            id: category.id,
            name: category.name,
          }));

          console.log('nameList', nameList);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const resetHandler = () => {
    setCategories(originCategories);
    setChanged(false);
  };
  const compareDiff = () => {
    const isChanged = originCategories.some(
      (oldItem, index) => oldItem.name !== categories[index].name
    );
    setChanged(isChanged);
    setUpdated(false);
    console.log('변함', isChanged);
  };
  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    if (updated) {
      compareDiff();
    }
  }, [updated]);
  return (
    <Content>
      <Row className={styles.product_page_container}>
        {/* 상품 리스트 디스플레이 영역 */}
        <Col span={14} className="border-r">
          <Row>
            <Col span={2}></Col>
            {categories.slice(0, 5).map((category, idx) => (
              <AdminMenuItem
                key={idx}
                category={category}
                categories={categories}
                setCategories={setCategories}
                setUpdated={setUpdated}
              />
            ))}

            <Col span={2}></Col>
          </Row>
          <Row>
            <Col span={2}></Col>
            {categories.slice(5, 10).map((category, idx) => (
              <AdminMenuItem
                key={idx}
                category={category}
                categories={categories}
                setCategories={setCategories}
                setUpdated={setUpdated}
              />
            ))}
            <Col span={2}></Col>
          </Row>
          <Col span={24}>
            <Button className={styles.button} onClick={compareDiff}>
              업데이트
            </Button>
            <Button
              className={styles.button}
              onClick={resetHandler}
              disabled={!changed}
            >
              초기화
            </Button>
          </Col>
        </Col>
        {/* 상품 추가 영역 */}
        <Col span={10}>
          <Row>
            <Col span={24} className="text-center">
              <Image src={logo} width={300} preview={false} />
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
                  <InputNumber
                    className={styles.inputNumber}
                    type="text"
                    suffix={<div className={styles.circle_icon}>원</div>}
                    formatter={(value) =>
                      value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    }
                    parser={(value) => value.replace(/\D/g, '')}
                    controls={false}
                  />
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
                  <InputNumber
                    className={styles.inputNumber}
                    type="text"
                    suffix={<div className={styles.circle_icon}>원</div>}
                    formatter={(value) =>
                      value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                    }
                    parser={(value) => value.replace(/\D/g, '')}
                    controls={false}
                  />
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
