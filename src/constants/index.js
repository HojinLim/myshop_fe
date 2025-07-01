const CONSTANTS = {
  NON_MEMBER: 'non_member_uid',

  // UID: {
  //   NON_MEMBER: 'non_member_uid',
  // },
  // SETTINGS: {
  //   THEME: 'dark_mode',
  //   LANGUAGE: 'ko',
  // },
  KAKAO_PG: 'kakaopay.TC0ONETIME',
  KG_PG: 'html5_inicis',
  // KG_PG: 'inicis.INIpayTest',
  // KG_PG: 'inicis',
};

const QUERY_KEYS = {
  PRODUCTS: ['products'],
  PRODUCT_DETAILS: (id) => ['product', id],
};

export { CONSTANTS, QUERY_KEYS };
