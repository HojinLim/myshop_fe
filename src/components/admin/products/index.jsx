import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  Upload,
} from 'antd';
import Layout, { Content } from 'antd/es/layout/layout';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import logo from '@/assets/images/logo.png';
import { CameraFilled, PlusOutlined } from '@ant-design/icons';
import { AdminMenuItem } from '@/components/common/AdminMenuItem';
import { getCategories, updateCategories } from '@/api/category';
import { capitalizeJs } from '@/functions';
import { uploadProduct } from '@/api/product';
import EditProductModal from './EditProductModal';

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

  // 이미지 상태 관리
  const [mainImages, setMainImages] = useState([]);
  const [detailImages, setDetailImages] = useState([]);
  const [mainFileList, setMainFileList] = useState([]);
  const [detailFileList, setDetailFileList] = useState([]);

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

  // 상품 테이블 관련
  const columns = [
    {
      key: 'id',
      title: '번호',
      dataIndex: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '이미지',
      key: 'action',
      render: (_, record) => <Image src={logo} width="50px" />,
    },
    {
      key: 'name',
      title: '상품명',
      dataIndex: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      key: 'category',
      title: '카테고리',
      dataIndex: 'category',
    },
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>이미지 관리</a>
          <a>옵션 관리</a>
          <Popconfirm
            title={`${record.name}을(를) 정말 삭제합니까?`}
            // onConfirm={() => handleDelete(record.key)}
          >
            {/* <a>Delete</a> */}
            <a>상품 삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: '1',
      name: '갈색 셔츠',
      category: '옷',
    },
    {
      id: '2',
      name: '영롱한 목걸이',
      category: '악세사리',
    },
  ];
  const UploadButton = () => {
    return (
      <button style={{ border: 0, background: 'none' }} type="button">
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </button>
    );
  };
  return (
    <Content>
      <Row className={styles.product_page_container}>
        {/* 상품 리스트 디스플레이 영역 */}
        <Col span={14} className="border-r">
          <h4>카테고리 관리</h4>
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
            <Flex>
              <Button
                className={styles.button}
                onClick={updateCategoriesHandler}
              >
                업데이트
              </Button>
              <Button
                className={styles.button}
                onClick={resetHandler}
                disabled={!changed}
              >
                초기화
              </Button>
            </Flex>
          </Col>
          <Col span={24} className="mt-3">
            <Flex justify="space-between">
              <h4>상품 관리</h4>
              <Select
                // defaultValue="전체"
                style={{ width: '50%' }}
                options={selectCateogry}
                onChange={(value) => {
                  onChangeForm(value, 'category');
                }}
              />
              {/* 상품 관리 테이블 */}
            </Flex>
            <Table columns={columns} dataSource={data} />
          </Col>
        </Col>
        {/* 상품 추가 영역 */}
        <Col span={10}>
          <Row>
            <Col span={24} className="text-center">
              <Image src={productPreview} width={300} preview={false} />
            </Col>
            <Col span={24}>
              <Upload
                action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                listType="picture-card"
                fileList={mainFileList}
                // onPreview={handlePreview}
                // onChange={handleChange}
              >
                {mainFileList.length >= 8 ? null : <UploadButton />}
              </Upload>
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
      <EditProductModal />
    </Content>
  );
};

export default index;
