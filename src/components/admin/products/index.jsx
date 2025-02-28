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
import { getCategories, updateCategories } from '@/api/category';

const index = () => {
  const [categories, setCategories] = useState([]);
  const [originCategories, setOriginCategories] = useState([]); // 처음 불러온 값
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [originText, setOriginText] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [reset, setReset] = useState(false);

  const getCategoryList = async () => {
    await getCategories()
      .then((res) => {
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
          setOriginCategories(res.categories);
          console.log('res.categories', res.categories);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const resetHandler = () => {
    setCategories(originCategories);
    setChanged(false);
    setReset(true);
  };

  const compareDiff = () => {
    let isChanged = categories.some(
      (category, index) => category.name !== originCategories[index].name
    );

    isChanged = categories.some((category, index) => category.upload_photo);

    setChanged(isChanged); // 변경 여부 업데이트
    setUpdated(false);
  };

  const updateCategoriesHandler = async () => {
    const changedArr = categories.filter(
      (changeItem, index) =>
        // 기존 텍스트와 다른거나 (name업데이트), 사진 업로드 있을 시 (photo 업데이트)
        changeItem.name !== originCategories[index].name ||
        changeItem.upload_photo
    );

    await updateCategories(changedArr)
      .then((res) => {
        console.log(res);
        // 업데이트 성공시 다시 불러오기
        getCategoryList();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  useEffect(() => {
    compareDiff();
  }, [updated, categories]);
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
                reset={reset}
                setReset={setReset}
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
                reset={reset}
                setReset={setReset}
              />
            ))}
            <Col span={2}></Col>
          </Row>
          <Col span={24}>
            <Button className={styles.button} onClick={updateCategoriesHandler}>
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
