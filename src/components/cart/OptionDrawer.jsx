import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content } from 'antd/es/layout/layout';
import { Button, Col, Divider, Flex, message, Select } from 'antd';
import { updateCartOption } from '@/api/cart';
import { useSelector } from 'react-redux';
import { getNonMemberId } from '@/utils';

const OptionDrawer = (props) => {
  const {
    drawerOpen,
    setDrawer,
    options,
    setOptions,
    fetchCart,
    selectedCart,
  } = props;

  const user = useSelector((state) => state.user.data);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [checkOptions, setCheckOptions] = useState({
    id: null,
    color: null,
    size: null,
  });

  const setColorOptions = () => {
    if (Array.isArray(options) && options.length > 0) {
      const arr = [...new Set(options.map((opt) => opt.color))];

      // Antd 형식에 맞게 arr대입
      const filtered = arr.map((item) => ({
        value: item,
        label: item,
      }));
      setColors(filtered);
    }
  };
  const setSizeOptions = () => {
    if (Array.isArray(options) && options.length > 0) {
      const arr = options
        .filter((opt) => opt.color === checkOptions.color)
        .map((item) => ({
          value: item.size,
          label: labelElement(item),
          disabled: item.stock <= 0 ? true : false,
        }));

      setSizes(arr);
    }
  };
  const labelElement = (item) => {
    const { size, price, stock } = item;
    return (
      <span className="flex justify-between items-center">
        <div className="flex flex-col ">
          <span>{size}</span>
          {/* stock이 0이면 품절 */}
          <span>{stock <= 0 ? '품절' : ''}</span>
        </div>
        <span>{price}원</span>
      </span>
    );
  };
  // 체크된 옵션 초기화
  const setInitOption = () => {
    if (Array.isArray(options) && options.length > 0) {
      const arr = options.find((item) => item.checked === true);
      setCheckOptions(arr);
    }
  };
  useEffect(() => {
    setColorOptions();
    setInitOption();
  }, [options]);

  // 선택한 색상이 바뀔때마다 size옵션 변경
  useEffect(() => {
    setSizeOptions();
  }, [checkOptions.color]);

  const handleClickColor = (selectedColor) => {
    setSizeOptions();
    setCheckOptions((prev) => ({ ...prev, color: selectedColor, size: null }));
  };
  const handleClickSize = (selectedSize) => {
    const option = options.find(
      (val) => val.color === checkOptions.color && val.size === selectedSize
    );

    setCheckOptions((prev) => ({ ...prev, id: option.id, size: selectedSize }));
  };

  const clickChange = () => {
    setOptions(checkOptions);
    fetchCart();
    setDrawer(false);

    const checked = options.find((val) => val.checked === true);
    if (checked.id === checkOptions.id) {
      message.success('이미 담겨있는 옵션입니다.');
    } else {
      updateCartOptions(checkOptions.id);
    }
  };
  const updateCartOptions = async (option_id) => {
    selectedCart;

    const params = {
      user_id: user.id || getNonMemberId(),
      product_option_id: option_id,
      cart_id: selectedCart.id,
    };
    await updateCartOption(params)
      .then((res) => {
        fetchCart();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
  return (
    <Content className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}>
      <Col span={24} className="mb-3">
        <Select
          placeholder="색상 선택하기"
          options={colors}
          value={checkOptions.color}
          onChange={handleClickColor}
        />
      </Col>
      <Col span={24}>
        <Select
          placeholder="사이즈 선택하기"
          options={sizes}
          value={checkOptions.size}
          onChange={handleClickSize}
        />
      </Col>
      <Col span={24} className={styles.drawer_footer}>
        <Divider />

        <Flex>
          <Button
            className="w-full"
            onClick={() => {
              setDrawer(false);
            }}
          >
            취소
          </Button>
          <Button
            className="w-full"
            onClick={clickChange}
            disabled={!checkOptions.size}
          >
            변경하기
          </Button>
        </Flex>
      </Col>
    </Content>
  );
};

export default OptionDrawer;
