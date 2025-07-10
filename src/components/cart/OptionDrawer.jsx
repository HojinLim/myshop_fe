import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content } from 'antd/es/layout/layout';
import { Button, Col, Divider, Flex, message, Select, Typography } from 'antd'; // Typography 추가
import { updateCartOption } from '@/api/cart';
import { useSelector } from 'react-redux';
import { getNonMemberId } from '@/utils';

const OptionDrawer = (props) => {
  const {
    drawerOpen,
    setDrawer,
    options, // 이 options는 이제 현재 상품의 모든 옵션 리스트 (product_options 배열)
    fetchCart,
    selectedCart, // 현재 장바구니에서 선택된 아이템 (product_option_id를 가짐)
  } = props;

  const user = useSelector((state) => state.user.data);
  const [colors, setColors] = useState([]); // 색상 선택 드롭다운에 표시될 옵션
  const [sizes, setSizes] = useState([]); // 사이즈 선택 드롭다운에 표시될 옵션
  const [checkOptions, setCheckOptions] = useState({
    // 사용자가 현재 선택 중인 옵션
    id: null, // 새로운 product_option_id
    color: null,
    size: null,
  });

  // 드로어 열릴 때마다 현재 선택된 장바구니 아이템의 옵션으로 초기화
  useEffect(() => {
    if (drawerOpen && selectedCart && selectedCart.product_option) {
      // 현재 장바구니 아이템의 옵션 정보로 checkOptions 초기화
      setCheckOptions({
        id: selectedCart.product_option.id,
        color: selectedCart.product_option.color,
        size: selectedCart.product_option.size,
      });
    } else {
      // 드로어가 닫히거나 selectedCart가 유효하지 않으면 초기화
      setCheckOptions({ id: null, color: null, size: null });
    }
  }, [drawerOpen, selectedCart]); // drawerOpen과 selectedCart가 변경될 때마다 실행

  // 사용 가능한 색상 옵션을 설정하는 함수
  const setColorOptions = () => {
    if (Array.isArray(options) && options.length > 0) {
      const uniqueColors = [...new Set(options.map((opt) => opt.color))];
      const mappedColors = uniqueColors.map((item) => ({
        value: item,
        label: item,
      }));
      setColors(mappedColors);
    } else {
      setColors([]);
    }
  };

  // 사용 가능한 사이즈 옵션을 설정하는 함수
  const setSizeOptions = () => {
    if (Array.isArray(options) && options.length > 0 && checkOptions.color) {
      const filteredSizes = options
        .filter((opt) => opt.color === checkOptions.color)
        .map((item) => ({
          value: item.size,
          label: labelElement(item), // 커스텀 라벨 엘리먼트 사용
          disabled: item.stock <= 0, // 재고가 0이면 비활성화
        }));
      setSizes(filteredSizes);
    } else {
      setSizes([]);
    }
  };

  // Select 컴포넌트의 label에 들어갈 JSX 엘리먼트 생성 함수
  const labelElement = (item) => {
    const { size, price, stock } = item;
    return (
      <span className="flex justify-between items-center w-full">
        <div className="flex flex-col">
          <span>{size}</span>
          {stock <= 0 ? (
            <span className="text-red-500 text-xs">품절</span>
          ) : null}
          {stock > 0 && stock <= 5 ? (
            <span className="text-orange-500 text-xs">재고 {stock}개</span>
          ) : null}
        </div>
        <span>{Number(price).toLocaleString()}원</span>
      </span>
    );
  };

  // options prop이 변경되거나 드로어가 열릴 때 색상 옵션 초기화
  useEffect(() => {
    setColorOptions();
  }, [options, drawerOpen]); // options 또는 drawerOpen이 변경될 때 실행

  // 선택한 색상이 바뀔 때마다 사이즈 옵션 변경
  useEffect(() => {
    setSizeOptions();
  }, [checkOptions.color, options]); // checkOptions.color 또는 options가 변경될 때 실행

  // 색상 선택 핸들러
  const handleClickColor = (selectedColor) => {
    setCheckOptions((prev) => ({
      ...prev,
      color: selectedColor,
      size: null,
      id: null,
    })); // 색상 변경 시 사이즈 및 ID 초기화
  };

  // 사이즈 선택 핸들러
  const handleClickSize = (selectedSize) => {
    const option = options.find(
      (val) => val.color === checkOptions.color && val.size === selectedSize
    );

    if (option) {
      setCheckOptions((prev) => ({
        ...prev,
        id: option.id,
        size: selectedSize,
      }));
    } else {
      console.error('선택된 색상과 사이즈에 해당하는 옵션을 찾을 수 없습니다.');
      message.error('옵션 선택에 오류가 발생했습니다.');
    }
  };

  // '변경하기' 버튼 클릭 핸들러
  const clickChange = async () => {
    if (!checkOptions.id) {
      message.warning('색상과 사이즈를 모두 선택해주세요.');
      return;
    }

    // 현재 장바구니 아이템의 옵션 ID와 새로 선택된 옵션 ID 비교
    if (selectedCart.product_option.id === checkOptions.id) {
      message.success('이미 선택된 옵션입니다.');
      setDrawer(false); // 드로어 닫기
      return;
    }

    // 재고 확인
    const newOption = options.find((opt) => opt.id === checkOptions.id);
    if (newOption && newOption.stock === 0) {
      message.warning('선택하신 옵션은 품절되었습니다.');
      return;
    }

    // 카트 옵션 업데이트 API 호출
    await updateCartOptions(checkOptions.id);
    setDrawer(false); // 드로어 닫기
  };

  // 카트 옵션을 업데이트하는 비동기 함수
  const updateCartOptions = async (new_option_id) => {
    const params = {
      user_id: user.id || getNonMemberId(),
      product_option_id: new_option_id, // 새로 선택된 옵션의 ID
      cart_id: selectedCart.id, // 변경할 장바구니 항목의 ID
      product_id: selectedCart.product_id,
    };
    try {
      await updateCartOption(params);
      message.success('옵션이 성공적으로 변경되었습니다.');
      fetchCart(); // 장바구니 데이터 새로고침
    } catch (err) {
      console.error('카트 옵션 업데이트 오류:', err);
      message.error(err.message || '옵션 변경에 실패했습니다.');
    }
  };

  return (
    <Content className={`${styles.drawer} ${drawerOpen ? styles.open : ''}`}>
      <Col span={24} className="mb-3">
        <Select
          className="w-full rounded-md"
          placeholder="색상 선택하기"
          options={colors}
          value={checkOptions.color}
          onChange={handleClickColor}
        />
      </Col>
      <Col span={24}>
        <Select
          className="w-full rounded-md"
          placeholder="사이즈 선택하기"
          options={sizes}
          value={checkOptions.size}
          onChange={handleClickSize}
          disabled={!checkOptions.color} // 색상이 선택되어야 사이즈 선택 가능
        />
      </Col>
      <Col span={24} className={styles.drawer_footer}>
        <Divider className="my-2" /> {/* 여백 조정 */}
        <Flex className="gap-3">
          {' '}
          {/* 버튼 사이에 간격 추가 */}
          <Button
            className="w-full rounded-lg"
            size="large"
            onClick={() => {
              setDrawer(false); // 드로어 닫기
            }}
          >
            취소
          </Button>
          <Button
            className="w-full rounded-lg"
            size="large"
            type="primary" // Ant Design primary 버튼 스타일 적용
            onClick={clickChange}
            disabled={
              !checkOptions.size ||
              (selectedCart &&
                selectedCart.product_option &&
                selectedCart.product_option.id === checkOptions.id)
            } // 사이즈가 선택되지 않았거나, 현재 옵션과 동일하면 비활성화
          >
            변경하기
          </Button>
        </Flex>
      </Col>
    </Content>
  );
};

export default OptionDrawer;
