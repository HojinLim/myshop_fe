const back_url = import.meta.env.VITE_BACK_URL;

const testPayment = async (
  pgName,
  usedPoint,
  userId,
  order_items,
  totalPrice
) => {
  const { IMP } = window;
  IMP.init('imp55447710'); // 아임포트 테스트용 가맹점 코드
  console.log(order_items);

  IMP.request_pay(
    {
      pg: pgName, // 카카오페이 테스트 MID
      pay_method: 'card',
      merchant_uid: 'order_no_' + new Date().getTime(), // 주문번호
      name: '테스트 상품',
      amount: totalPrice, //금액
      buyer_email: 'test@example.com',
      buyer_name: '홍길동',
      buyer_tel: '01012345678',
      buyer_addr: '서울특별시 강남구',
      buyer_postcode: '123-456',
    },
    async (rsp) => {
      if (rsp.success) {
        const { imp_uid, merchant_uid, paid_amount, pg_provider } = rsp;

        // 서버에 결제 검증 요청
        const res = await fetch(`${back_url}/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            imp_uid: imp_uid,
            merchant_uid: merchant_uid,
            totalPrice: paid_amount,
            paymentMethod: pg_provider, // ex: kakaopay
            usedPoint: usedPoint, // 예: 프론트에서 포인트 사용한 금액을 넘긴다
            order_items: order_items,
          }),
        });
        const result = await res.json();
        console.log(result);

        if (result.success) {
          alert('결제 성공!');
          window.location.href = '/mypage/orderList';
          console.log(rsp);
        } else {
          alert('결제 검증 실패');
        }
      } else {
        alert('결제 실패: ' + rsp.error_msg);
      }
    }
  );
};

export { testPayment };
