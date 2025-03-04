import {
  Avatar,
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Typography,
} from 'antd';
import Layout, { Content } from 'antd/es/layout/layout';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import logo from '@/assets/images/logo.png';
import { CameraFilled } from '@ant-design/icons';
import { AdminMenuItem } from '@/components/common/AdminMenuItem';
import { getCategories, updateCategories } from '@/api/category';
import { capitalizeJs } from '@/functions';
import { uploadProduct } from '@/api/product';

const index = () => {
  const [form] = Form.useForm();
  const imageRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [originCategories, setOriginCategories] = useState([]); // 처음 불러온 값
  const [selectCateogry, setSelectCateogry] = useState([]);
  const [productPreview, setProductPreview] = useState(logo);

  const [updated, setUpdated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [reset, setReset] = useState(false);

  // const [messageApi, contextHolder] = message.useMessage();

  // 상품 등록 폼 상태태
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    originPrice: '',
    discountPrice: '',
    photoUrl: null,
  });
  // 상품 등록 폼 핸들러
  const onChangeForm = (value, type) => {
    setProductForm({ ...productForm, [type]: value });
  };

  // 상품 이미지 변경
  const changeProductImage = (e) => {
    const file = e.target.files[0];
    setProductForm({ ...productForm, photoUrl: file });
    if (!file) return;

    setProductPreview(URL.createObjectURL(file)); // 이미지 미리보기
  };
  // 상품 사진 삭제
  const deleteProductImage = () => {
    setProductPreview(logo);
    setProductForm({ ...productForm, photo: null });
  };
  // 상품 업로드
  const uploadProductHandler = async () => {
    await uploadProduct(productForm)
      .then((res) => {
        console.log(res);

        message
          .open({
            type: 'success',
            content: '상품 등록 완료 :)',
            duration: 2,
          })
          .then(() => {
            // 초기화
            setProductForm({
              name: '',
              category: '',
              originPrice: '',
              discountPrice: '',
              photoUrl: null,
            });
            form.resetFields();
            setProductPreview(logo);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 카테고리 리스트 가져오기
  const getCategoryList = async () => {
    await getCategories()
      .then((res) => {
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
          setOriginCategories(res.categories);

          // select에 들어간 카테고리 배열
          const arr = res.categories
            .filter((category) => category.name !== '전체')
            .map((el) => ({
              value: el.name,
              label: capitalizeJs(el.name),
            }));

          setSelectCateogry(arr);
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

    isChanged = categories.some(
      (category, index) =>
        category.upload_photo || category.upload_photo === null
    );

    setChanged(isChanged); // 변경 여부 업데이트
    setUpdated(false);
  };

  const updateCategoriesHandler = async () => {
    const changedArr = categories.filter(
      (changeItem, index) =>
        // 기존 텍스트와 다른거나 (name업데이트), 사진 업로드 있을 시 (photo 업데이트)
        changeItem.name !== originCategories[index].name ||
        changeItem.upload_photo ||
        changeItem.upload_photo === null
    );

    await updateCategories(changedArr)
      .then((res) => {
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
              <Image src={productPreview} width={300} preview={false} />
            </Col>
            <Col span={24} className="text-center">
              <Button onClick={() => imageRef.current.click()}>
                <CameraFilled /> 사진 올리기
              </Button>
              <input
                ref={imageRef}
                hidden
                type="file"
                accept="image/*"
                onChange={changeProductImage}
              />
            </Col>
            <Col span={24} className="underline mt-1 text-center">
              {productPreview && (
                <Typography.Text
                  className="cursor-pointer"
                  onClick={deleteProductImage}
                >
                  현재 사진 삭제
                </Typography.Text>
              )}
            </Col>
            <Col span={24}>
              <Form
                form={form}
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
                  <Input
                    type="text"
                    onChange={(e) => onChangeForm(e.target.value, 'name')}
                  />
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
                  <Select
                    // defaultValue="전체"
                    style={{ width: '100%' }}
                    options={selectCateogry}
                    onChange={(value) => {
                      onChangeForm(value, 'category');
                    }}
                  />
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
                    onChange={(e) => onChangeForm(e, 'originPrice')}
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
                    onChange={(e) => onChangeForm(e, 'discountPrice')}
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                onClick={uploadProductHandler}
              >
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
