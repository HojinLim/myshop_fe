import React, { useState } from 'react';
import { Button, Col, Input, message, Modal, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { RedoOutlined } from '@ant-design/icons';
import { createProductOption } from '@/api/product';
const EditProductModal = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    product_id: '1',
    size: '',
    color: '',
    price: '',
    stock: '',
  });
  const showModal = () => {
    setOpen(true);
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

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal with customized footer
      </Button>

      <Modal
        open={open}
        title="상품 옵션"
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
        <Content>
          <Row>
            <Col span={24}>
              <span>상품 ID / 상품명</span>
            </Col>
            <Col span={24}>
              <Input disabled value="상품 ID / 상품명" />
            </Col>
            {inputArray.map((input, idx) => (
              <Content key={idx}>
                <Col span={24}>
                  <span>{input.label}</span>
                </Col>
                <Col span={24}>
                  <Input
                    onChange={(e) => onChangeForm(e, input.name)}
                    value={input.value}
                    maxLength={input.maxLength}
                  />
                </Col>
              </Content>
            ))}
          </Row>
        </Content>
      </Modal>
    </>
  );
};

export default EditProductModal;
