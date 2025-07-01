import React, { useEffect, useState, useMemo } from 'react';
import {
  Breadcrumb,
  Button,
  Flex,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import {
  createProductOption,
  deleteProductOptions,
  getProductOption,
  updateProductOption,
} from '@/api/product';
import logo from '@/assets/images/logo.png';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/loadingSlice';
import { returnBucketUrl } from '@/utils';

const EditProductModal = ({
  modalOpen,
  setModalOpen,
  productInfo,
  setProductInfo,
}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(modalOpen);
  const [productOptions, setProductOptions] = useState([]);

  // ✅ 상품 옵션 조회 입력 폼 상태 (여러 개 관리)
  const [formList, setFormList] = useState([]);

  // ✅ 상품 옵션 추가 입력 폼 상태
  const [form, setForm] = useState({
    product_id: productInfo?.id || '',
    size: '',
    color: '',
    price: '',
    stock: '',
  });

  useEffect(() => {
    setOpen(modalOpen);
  }, [modalOpen]);

  // ✅ 상품 옵션 목록 가져오기
  const fetchProductOptions = async () => {
    if (!productInfo?.id) return;

    try {
      const res = await getProductOption(productInfo.id);
      setProductOptions(res.product_option ?? []);
      setFormList(res.product_option ?? []); // ✅ `formList`에 옵션 데이터 저장
    } catch (err) {
      console.error('⚠️ 옵션 가져오기 실패:', err);
    }
  };

  useEffect(() => {
    if (productInfo?.id) {
      fetchProductOptions();
    }
  }, [productInfo]);

  // ✅ 입력 값 변경 핸들러 (`formList`에서 해당 옵션 수정)
  const onChangeFormList = (id, field, value) => {
    setFormList((prevList) =>
      prevList.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };
  // ✅ 입력 값 변경 핸들러
  const onChangeForm = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: value }));
  };

  // ✅ 상품 옵션 업데이트
  const handleUpdate = async (option) => {
    try {
      const res = await updateProductOption(option); // ✅ 개별 옵션 업데이트
      fetchProductOptions(); // ✅ 수정 후 목록 업데이트
      message.success(`옵션 ${option.id} 업데이트 완료!`);
    } catch (error) {
      message.error(`옵션 ${option.id} 업데이트 실패: ${error.message}`);
    }
  };
  // ✅ 상품 옵션 생성
  const createOption = async () => {
    try {
      const res = await createProductOption(form);
      fetchProductOptions();
      resetField();
      message.success('옵션 생성 완료!');
    } catch (error) {
      message.error(`옵션 생성 실패: ${error.message}`);
    }
  };
  // ✅ 상품 옵션 삭제
  const handleDelete = async (id) => {
    try {
      await deleteProductOptions(id);
      dispatch(setLoading(true));
      fetchProductOptions();
    } finally {
      dispatch(setLoading(false));
    }
  };
  const resetField = () => {
    setForm({
      product_id: productInfo.id,
      size: '',
      color: '',
      price: productInfo.discountPrice, // ✅ 기본값 설정
      stock: '',
    });
  };
  useEffect(() => {
    resetField();
  }, [modalOpen]);
  // ✅ 상품 옵션 테이블 컬럼
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
      render: (_, record) => {
        record;

        return (
          <Image
            src={
              record.Product?.ProductImages[0].imageUrl
                ? returnBucketUrl(record.Product?.ProductImages[0]?.imageUrl)
                : '/none_logo.png'
            }
            width="50px"
          />
        );
      },
    },
    {
      key: 'color',
      title: '색상',
      dataIndex: 'color',
      render: (_, record) => (
        <Input
          value={record.color}
          onChange={(e) => {
            onChangeFormList(record.id, 'color', e.target.value);
          }}
        />
      ),
    },
    {
      key: 'size',
      title: '사이즈',
      dataIndex: 'size',
      render: (_, record) => (
        <Input
          value={record.size}
          onChange={(e) => onChangeFormList(record.id, 'size', e.target.value)}
        />
      ),
    },
    {
      key: 'price',
      title: '가격',
      dataIndex: 'price',
      render: (_, record) => (
        <Input
          value={record.price}
          suffix="원"
          onChange={(e) => onChangeFormList(record.id, 'price', e.target.value)}
        />
      ),
    },
    {
      key: 'stock',
      title: '재고',
      dataIndex: 'stock',
      render: (_, record) => (
        <Input
          value={record.stock}
          suffix="개"
          onChange={(e) => onChangeFormList(record.id, 'stock', e.target.value)}
        />
      ),
    },
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title={`${record.id}번 옵션을 정말 수정합니까?`}
            onConfirm={() => handleUpdate(record)}
          >
            <a>옵션 수정</a>
          </Popconfirm>
          <Popconfirm
            title={`${record.id}번 옵션을 정말 삭제합니까?`}
            onConfirm={() => handleDelete(record.id)}
          >
            <a>옵션 삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const inputFieldMemo = useMemo(() => {
    return (
      <Flex justify="space-between">
        <Flex>
          <Space>
            <div>색상</div>
            <Input
              style={{ width: '155px', marginRight: '20px' }}
              value={form.color}
              name="color"
              onChange={onChangeForm}
            />
          </Space>
          <Space>
            <div>사이즈</div>
            <Input
              style={{ width: '155px', marginRight: '20px' }}
              value={form.size}
              name="size"
              onChange={onChangeForm}
            />
          </Space>
          <Space>
            <div>가격</div>
            <Input
              style={{ width: '155px', marginRight: '20px' }}
              value={form.price}
              suffix="원"
              name="price"
              onChange={onChangeForm}
            />
          </Space>
          <Space>
            <div>재고</div>
            <Input
              style={{ width: '155px' }}
              value={form.stock}
              suffix="개"
              name="stock"
              onChange={onChangeForm}
            />
          </Space>
        </Flex>
        <Button onClick={createOption}>옵션 추가</Button>
      </Flex>
    );
  }, [form]); // ✅ `form`이 변경될 때만 `InputField` 리렌더링

  return (
    <>
      <Modal
        width="fit-content"
        open={open}
        title={
          <Flex justify="space-between">
            <h4>상품 옵션</h4>
            <Breadcrumb
              style={{ marginRight: '15px' }}
              items={[
                { title: `고유 번호: ${productInfo?.id || 'N/A'}` },
                { title: productInfo?.name || '상품명 없음' },
              ]}
            />
          </Flex>
        }
        onCancel={() => {
          setOpen(false);
          setModalOpen(false);
          setProductInfo({});
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              setOpen(false);
              setModalOpen(false);
            }}
          >
            나중에 하기
          </Button>,
          <Button
            key="reset"
            type="primary"
            onClick={resetField}
            icon={<RedoOutlined />}
          >
            리셋
          </Button>,
        ]}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={formList}
          footer={() => inputFieldMemo}
        />
      </Modal>
    </>
  );
};

export default EditProductModal;
