import {
  Button,
  Col,
  Flex,
  Image,
  message,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import Layout, { Content } from 'antd/es/layout/layout';
import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import logo from '@/assets/images/logo.png';
import { AdminMenuItem } from '@/components/common/AdminMenuItem';
import { getCategories, updateCategories } from '@/api/category';
import { capitalizeJs, returnBucketUrl } from '@/utils';
import { deleteProduct, getProducts, uploadProduct } from '@/api/product';
import EditProductModal from './EditProductModal';
import UploadProduct from './UploadLayout';
import UploadLayout from './UploadLayout';
import { setLoading } from '@/store/slices/loadingSlice';
import { useDispatch } from 'react-redux';
import EditProductPicModal from './EditProductPicModal';

const index = () => {
  const dispath = useDispatch();
  const [categories, setCategories] = useState([]);
  const [originCategories, setOriginCategories] = useState([]); // 처음 불러온 값
  const [selectCateogry, setSelectCateogry] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [changed, setChanged] = useState(false);
  const [reset, setReset] = useState(false);
  const [imageEditModalOpen, setImageEditModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState();

  // 상품 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(null);

  // 상품 관리- 클릭한 상품 정보
  const [productInfo, setProductInfo] = useState('');

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
    dispath(setLoading(true));
    await getCategories()
      .then((res) => {
        if (Array.isArray(res.categories) && res.categories.length > 0) {
          setCategories(res.categories);
          setOriginCategories(res.categories);

          // select에 들어간 카테고리 배열
          const arr = res.categories
            // .filter((category) => category.name !== '전체')
            .map((el) => ({
              value: el.name,
              label: capitalizeJs(el.name),
            }));
          // arr.unshift({ value: '', label: '전체' });
          setSelectCateogry(arr);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        dispath(setLoading(false));
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
        message.success('카테고리 업데이트 완료');
      })
      .catch((err) => {
        if (err.response?.data?.error?.errors[0]?.message.includes('unique')) {
          message.warning('카테고리 이름이 중복됩니다.');
        }
      });
  };
  // 상품 가져오기
  const fetchProduct = async () => {
    await getProducts('category', productForm.category, currentPage)
      .then((res) => {
        dispath(setLoading(true));
        if (res.products && res.products.length > 0) {
          const productArr = res.products.map((product, index) => {
            const {
              id,
              category,
              ProductImages = [],
              name,
              discountPrice,
            } = product; //  객체 구조 분해 할당

            return {
              index: index + 1,
              id,
              category,
              imageUrl: ProductImages?.[0]?.imageUrl || null, //  첫 번째 이미지가 없으면 `null` 반환
              name,
              discountPrice,
            };
          });

          setProducts(productArr);
          setTotalCount(res.totalCount);
        } else {
          setProducts([]);
          setCurrentPage(1);
          setTotalCount(res.totalCount);
        }
      })
      .finally(() => {
        dispath(setLoading(false));
      });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id)
      .then((res) => {
        dispath(setLoading(true));
        fetchProduct();
        message.success('상품 삭제 완료');
      })

      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        dispath(setLoading(false));
      });
  };

  useEffect(() => {
    getCategoryList();
    fetchProduct();
  }, []);
  useEffect(() => {
    fetchProduct();
  }, [productForm.category, currentPage]);

  useEffect(() => {
    compareDiff();
  }, [updated, categories]);

  // 상품 테이블 관련
  const columns = [
    {
      key: 'index',
      title: '인덱스',
      dataIndex: 'index',
      render: (text) => <a>{text}</a>,
    },
    {
      key: 'id',
      title: '고유 번호',
      dataIndex: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      key: 'image',
      title: '이미지',
      key: 'action',
      render: (_, record) => (
        <Image
          src={
            record?.imageUrl
              ? returnBucketUrl(record.imageUrl)
              : '/none_logo.png'
          }
          width="50px"
        />
      ),
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
        <Space className={styles.manage_layout} size="middle">
          <a
            onClick={() => {
              setImageEditModalOpen(true);
              setProductId(record.id);
            }}
          >
            이미지 관리
          </a>
          <a
            onClick={() => {
              setModalOpen(true);
              setProductInfo(record);
            }}
          >
            옵션 관리
          </a>
          <Popconfirm
            title={`${record.name}을(를) 정말 삭제합니까?`}
            onConfirm={() => handleDelete(record.id)}
          >
            <a>상품 삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="w-full">
      <Row className={styles.product_page_container}>
        {/* 상품 리스트 디스플레이 영역 */}
        <Col span={24} xl={{ span: 14 }} className="px-12">
          <h4>카테고리 관리</h4>
          <Row>
            <Col span={2}></Col>
            {categories.slice(0, 5).map((category, idx) => (
              <AdminMenuItem
                key={category.id}
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
            <Flex gap={12}>
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
          <Col span={24} className="mt-3 ">
            <Flex justify="space-between">
              <h4>상품 관리</h4>
              <Select
                defaultValue="전체"
                style={{ width: '50%' }}
                options={selectCateogry}
                onChange={(value) => {
                  onChangeForm(value, 'category');
                }}
              />
              {/* 상품 관리 테이블 */}
            </Flex>
            <div className="overflow-x-auto overflow-y-hidden">
              <Table
                rowKey="id"
                className={styles.table}
                columns={columns}
                dataSource={products}
                pagination={{
                  current: currentPage,
                  pageSize: 6,
                  total: totalCount,
                  onChange: (page) => setCurrentPage(page),
                }}
              />
            </div>
          </Col>
        </Col>
        {/* 상품 추가 영역 */}
        <UploadLayout
          selectCateogry={selectCateogry}
          fetchProduct={fetchProduct}
        />
      </Row>
      <EditProductPicModal
        imageEditModalOpen={imageEditModalOpen}
        setImageEditModalOpen={setImageEditModalOpen}
        productId={productId}
      />
      <EditProductModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        productInfo={productInfo}
        setProductInfo={setProductInfo}
      />
    </Layout>
  );
};

export default index;
