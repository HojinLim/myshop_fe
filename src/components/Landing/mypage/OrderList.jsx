import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import { SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Flex,
  message,
  Pagination,
  Popconfirm,
  Row,
  Typography,
} from 'antd';
import styles from './index.module.css';
import MenuHeader from '@/components/common/MenuHeader';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderList } from '@/api/order';
import { returnBucketUrl, toWon } from '@/utils'; // toWon 임포트
import dayjs from '@/utils/dayjs';
import MenuDrawer from '@/components/common/MenuDrawer';
import { refundProduct } from '@/api/payment';
import { setLoading } from '@/store/slices/loadingSlice';

const OrderList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.data);
  const [orderList, setOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // 기본 5개
  const [pageInfo, setPageInfo] = useState({ limit: 5, totalCount: 10 });

  const dispatch = useDispatch();

  // 사용자 ID가 없으면 로그인 페이지로 리다이렉트
  // 이 부분은 컴포넌트 최상단보다는 useEffect 내에서 처리하는 것이 일반적입니다.
  // 컴포넌트 렌더링 초기에 user가 null일 수 있기 때문입니다.
  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
    } else {
      fetchOrderList();
    }
  }, [user?.id, currentPage, pageSize]); // 의존성 배열에 user.id 추가

  const fetchOrderList = async () => {
    // user.id가 없으면 API 호출하지 않음
    if (!user?.id) return;

    dispatch(setLoading(true));
    try {
      const res = await getOrderList(user.id, currentPage, pageSize);
      if (Array.isArray(res.data) && res.data.length > 0) {
        // order_items가 있는 주문만 필터링하고 imp_uid를 추가 (이미 있는 것 같지만 명시적)
        const filtered = res.data
          .filter((el) => el.order_items.length > 0)
          .map((data) => ({
            ...data,
            imp_uid: data.imp_uid, // imp_uid가 최상위 order 객체에 있다고 가정
          }));
        setOrderList(filtered);
        setPageInfo({ limit: res.limit, totalCount: res.totalCount });
      } else {
        setOrderList([]); // 데이터가 없으면 빈 배열로 설정
        setPageInfo({ limit: 0, totalCount: 0 }); // 페이지 정보 초기화
      }
    } catch (err) {
      console.error('주문 목록을 불러오는 중 오류 발생:', err);
      message.error('주문 목록을 불러오는 데 실패했습니다.');
      setOrderList([]);
      setPageInfo({ limit: 0, totalCount: 0 });
    }
    dispatch(setLoading(false));
  };

  const clickRefund = async (imp_uid, amount, reason, order_item_id) => {
    dispatch(setLoading(true));
    try {
      await refundProduct(imp_uid, amount, reason, order_item_id);
      fetchOrderList(); // 환불 후 목록 새로고침
      message.success('환불 완료!');
    } catch (err) {
      console.error('환불 처리 중 오류 발생:', err);
      // 백엔드에서 에러 메시지를 넘겨준다면 해당 메시지를 사용
      message.error(err.response?.data?.message || '환불에 실패했습니다.');
    }
    dispatch(setLoading(false));
  };

  return (
    <Content className="overflow-x-hidden overflow-y-auto ">
      <MenuHeader title="주문내역" />
      <Divider className="!my-2" />
      <Flex vertical>
        {/* 주문 아이템 */}
        {orderList.map((order) => (
          <div
            key={order.id}
            className="mb-6 p-4 border border-gray-200 rounded-lg"
          >
            {/* 스타일 추가 */}
            {/* 주문 날짜는 한 번만 출력 */}
            <p className="font-bold text-lg mb-3">
              {dayjs(order.createdAt).format('YYYY.MM.DD')} 주문
            </p>
            {/* 주문에 포함된 상품들 */}
            {order.order_items.map((item) => (
              <div
                key={item.id}
                className="mb-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0"
              >
                {/* 상품별 구분선 */}
                <Flex align="center" className="!mb-3">
                  <img
                    width={100}
                    height={100}
                    src={
                      item.Product.ProductImages.filter(
                        (image) => image.type === 'main'
                      )[0]?.imageUrl
                        ? returnBucketUrl(
                            item.Product.ProductImages.filter(
                              (image) => image.type === 'main'
                            )[0]?.imageUrl
                          )
                        : '/none_logo.png'
                    }
                    alt={item.product_name || '상품 이미지'}
                    className="rounded-md object-cover"
                  />
                  <Flex vertical className="!ml-3 flex-1">
                    {/* flex-1 추가하여 공간 차지 */}
                    {/* 상품 상태 (예: 배송 중, 배송 완료 등) */}
                    <p className="font-bold !mb-2 text-base">{item.status}</p>
                    {/* 상품 이름 */}
                    <Typography.Text className="!mb-1 font-medium">
                      {item.product_name}
                      {/* order_item에 직접 product_name이 있다고 가정 */}
                    </Typography.Text>
                    {/* 가격 및 수량 */}
                    <p className="text-gray-700 !mb-1">
                      {toWon(item.price)}원 {/* toWon 적용 */}
                      {item.quantity}개
                    </p>
                    {/* 옵션 정보 (색상 | 사이즈) */}
                    {item.product_option ? (
                      item.product_option.color || item.product_option.size ? (
                        <p className="text-gray-500 text-sm">
                          {item.product_option.color}
                          {item.product_option.color && item.product_option.size
                            ? ' | '
                            : ''}
                          {item.product_option.size}
                        </p>
                      ) : (
                        <p className="text-gray-500 text-sm">옵션 없음</p>
                      )
                    ) : (
                      <p className="text-gray-500 text-sm">옵션 없음</p>
                    )}
                  </Flex>
                </Flex>
                <Flex className="w-full gap-2">
                  {/* 버튼 사이에 간격 추가 */}
                  <Button
                    className="flex-1" // flex-1 추가하여 공간 균등 분배
                    onClick={() => {
                      navigate('/mypage/review/upload', {
                        state: item, // 리뷰 작성 시 필요한 item 정보 전달
                      });
                    }}
                  >
                    리뷰 작성
                  </Button>
                  {/* 환불 버튼은 'refunded' 상태가 아닐 때만 표시 */}
                  {item.status !== 'refunded' && (
                    <Popconfirm
                      title="환불하기"
                      description="정말 환불하시겠습니까?"
                      onConfirm={() =>
                        clickRefund(
                          order.imp_uid,
                          item.quantity * item.price, // 각 item의 총 금액
                          '고객 단순 변심', // 환불 사유는 일단 고정값으로 설정
                          item.id // 환불할 order_item의 ID
                        )
                      }
                      okText="네"
                      cancelText="아니오"
                    >
                      <Button className="flex-1">환불하기</Button>
                      {/* flex-1 추가 */}
                    </Popconfirm>
                  )}
                </Flex>
              </div>
            ))}
          </div>
        ))}

        {orderList.length === 0 && (
          <Flex justify="center" align="center" className="min-h-[200px]">
            <Typography.Text type="secondary">
              주문 내역이 없습니다.
            </Typography.Text>
          </Flex>
        )}

        <Pagination
          align="center"
          current={currentPage}
          pageSize={pageSize}
          total={pageInfo.totalCount}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          className="mt-6"
        />
      </Flex>
    </Content>
  );
};

export default OrderList;
