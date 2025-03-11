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
import UploadProduct from './UploadLayout';
import UploadLayout from './UploadLayout';

const index = () => {
  const imageRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [originCategories, setOriginCategories] = useState([]); // 처음 불러온 값
  const [selectCateogry, setSelectCateogry] = useState([]);

  const [updated, setUpdated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [reset, setReset] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 상품 등록 폼 상태
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
          <a
            onClick={() => {
              setModalOpen(true);
            }}
          >
            옵션 관리
          </a>
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

  return (
    <Content>
      <Row className={styles.product_page_container}>
        {/* <button onClick={test}>test</button> */}
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
        <UploadLayout selectCateogry={selectCateogry} />
      </Row>
      <EditProductModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </Content>
  );
};

export default index;
