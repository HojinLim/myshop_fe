import { Col, Flex, Input, Row } from 'antd';
import Title from 'antd/es/typography/Title';
import React, { useRef, useState } from 'react';
import {
  CloseCircleOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';

export const AdminMenuItem = (props) => {
  const { item, products, setProducts } = props;
  const [edit, setEdit] = useState(false);
  const imageRef = useRef(null);

  const onChangeCategory = (e) => {
    const list = products.map((value, idx) => {
      if (value.index === item.index) {
        return { ...value, category: e.target.value };
      } else {
        return value;
      }
    });
    setProducts(list);
  };
  const changeProduct = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const blobUrl = URL.createObjectURL(file);

    const list = products.map((value, idx) => {
      if (value.index === item.index) {
        return { ...value, image: blobUrl };
      } else {
        return value;
      }
    });
    setProducts(list);
  };

  return (
    <Col key={item.index} className="text-center" span={4}>
      <CloseCircleOutlined className="cursor-pointer right-0 absolute" />
      <img
        src={item.image}
        className="cursor-pointer"
        // style={{ maxWidth: '150px', maxHeight: '150px' }}
        onClick={() => {
          imageRef.current.click();
        }}
      />
      <input
        ref={imageRef}
        hidden
        type="file"
        accept="image/*"
        onChange={changeProduct}
      />
      {edit ? (
        <Row>
          <Col span={18}>
            <Input value={item.category} onChange={onChangeCategory} />
          </Col>

          <Col span={6} className="place-self-center">
            <Flex vertical>
              <CheckOutlined
                className="cursor-pointer"
                onClick={() => setEdit(false)}
              />
              <CloseOutlined
                className="cursor-pointer"
                onClick={() => setEdit(false)}
              />
            </Flex>
          </Col>
        </Row>
      ) : (
        <Title
          level={5}
          onClick={() => {
            setEdit(true);
          }}
        >
          {item.category}
        </Title>
      )}
    </Col>
  );
};
