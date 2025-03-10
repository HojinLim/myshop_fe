import React, { useEffect, useState } from 'react';
import {
  Breadcrumb,
  Button,
  Col,
  Flex,
  Image,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { RedoOutlined } from '@ant-design/icons';
import { createProductOption } from '@/api/product';
import logo from '@/assets/images/logo.png';
const EditProductModal = (props) => {
  const { modalOpen, setModalOpen } = props;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(modalOpen);

  const [form, setForm] = useState({
    product_id: '1',
    size: '',
    color: '',
    price: '',
    stock: '',
  });
  useEffect(() => {
    setOpen(modalOpen);
  }, [modalOpen]);
  const showModal = () => {
    setOpen(true);
    setModalOpen(true);
  };

  const handleOk = () => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   setOpen(false);
    // }, 3000);
  };
  const reset = () => {
    setForm({ product_id: '1', size: '', color: '', price: '', stock: '' });
  };
  const handleCancel = () => {
    setOpen(false);
    setModalOpen(false);
  };
  const onChangeForm = (e, type) => {
    setForm({ ...form, [type]: e.target.value });
  };
  const createOption = async () => {
    setLoading(true);
    try {
      const res = await createProductOption(form);
      console.log('✅ 응답 데이터:', res);
      message.success('옵션 생성 완료!');
    } catch (error) {
      console.error('⚠️ 옵션 생성 실패:', error.message);
      message.error(`옵션 생성 실패: ${error.message}`);
    }
    setLoading(false);
  };
  const inputArray = [
    { name: 'size', label: '사이즈', maxLength: '5', value: form.size },
    { name: 'color', label: '색상', maxLength: '15', value: form.color },
    { name: 'price', label: '가격', maxLength: '35', value: form.price },
    { name: 'stock', label: '재고', maxLength: '5', value: form.stock },
  ];

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
      key: 'color',
      title: '색상',
      dataIndex: 'color',
      render: (text) => <Input value={text} />,
    },
    {
      key: 'size',
      title: '사이즈',
      dataIndex: 'size',
      render: (text) => <Input value={text} />,
    },
    {
      key: 'price',
      title: '가격',
      dataIndex: 'price',
      render: (text) => <Input value={text} />,
    },
    {
      title: '관리',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>이미지 관리</a>
          <Popconfirm
            title={`${record.name}을(를) 정말 삭제합니까?`}
            // onConfirm={() => handleDelete(record.key)}
          >
            {/* <a>Delete</a> */}
            <a>옵션 삭제</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const data = [
    {
      id: '1',
      color: 'black',
      size: 'XL',
      price: '5,000원',
    },
    {
      id: '2',
      color: 'black',
      size: 'XL',
      price: '5,000원',
    },
  ];
  const InputField = () => {
    return (
      <Flex justify="space-between">
        <Flex>
          <Space>
            <div>사이즈</div>
            <Input src="dd" style={{ width: '155px', marginRight: '20px' }} />
          </Space>
          <Space>
            <div>색상</div>
            <Input src="dd" style={{ width: '155px', marginRight: '20px' }} />
          </Space>
          <Space>
            <div>가격</div>
            <Input src="dd" style={{ width: '155px' }} />
          </Space>
        </Flex>
        <Button>만들기</Button>
      </Flex>
    );
  };

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
                {
                  title: '고유 번호: 3',
                },
                {
                  title: '목걸이',
                },
              ]}
              params={{ id: 1 }}
            />
          </Flex>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            나중에 하기
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={reset}
            icon={<RedoOutlined />}
          >
            리셋
          </Button>,
          <Button type="primary" loading={loading} onClick={createOption}>
            추가하기
          </Button>,
        ]}
      >
        <Table
          columns={columns}
          dataSource={data}
          footer={() => <InputField />}
        />
      </Modal>
    </>
  );
};

export default EditProductModal;
