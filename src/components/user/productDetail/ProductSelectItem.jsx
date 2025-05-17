import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Flex } from 'antd';

const ProductSelectItem = (props) => {
  const { product, deleteFromCart, handleQuantityChange } = props;

  const totalPrice = product.price * product.quantity;
  return (
    <Col className={styles.select_product_container} span={24}>
      <Flex className="justify-between">
        <span>
          {product.color} / {product.size}
        </span>
        <CloseOutlined
          className="cursor-pointer"
          onClick={() => deleteFromCart(product.color, product.size)}
        />
      </Flex>
      <p className="text-gray-400">일반배송</p>
      <Flex className="justify-between">
        <Flex className="align-middle">
          <Button
            disabled={product.quantity <= 1}
            shape="circle"
            onClick={() =>
              handleQuantityChange(product.color, product.size, 'decrease')
            }
          >
            -
          </Button>
          <span className="my-auto mx-3">{product.quantity}</span>
          <Button
            shape="circle"
            onClick={() =>
              handleQuantityChange(product.color, product.size, 'increase')
            }
          >
            +
          </Button>
        </Flex>
        <span className="font-bold">
          {Number(totalPrice).toLocaleString()}원
        </span>
      </Flex>
    </Col>
  );
};

export default ProductSelectItem;
