import { v4 as uuidv4 } from 'uuid';

const bucket_url = import.meta.env.VITE_BUCKET_URL;

const colorMap = {
  black: '검정',
  red: '빨강',
  blue: '파랑',
  white: '하양',
};

// rds 사진 url + aws url로 리턴
const returnBucketUrl = (imageUrl) => {
  const fixUrl = `${bucket_url}/${imageUrl}`;
  return fixUrl;
};

// 앞의 한 글자만 대문자로
const capitalizeJs = (str) => {
  return str.replace(
    /\b[a-z]js\b/g,
    (match) => match[0].toUpperCase() + match.slice(1)
  );
};
// 영문색을 미리 지정된 한글 색상으로 변경
function mapColors(colors) {
  return colors.map((color) => colorMap[color] || color); // 매핑이 없으면 원래 값 유지
}

// 비회원이면 비회원 id 리턴
// 없으면 새로 저장 후 리턴
const getNonMemberId = () => {
  // 비회원
  let uid = localStorage.getItem('non_member_uid');
  if (!uid) {
    uid = uuidv4(); // ✅ 새 UID 생성
    localStorage.setItem('non_member_uid', uid); // ✅ 저장
  }
  return uid;
};
// 원화로변경
const toWon = (value) => {
  return Number(value).toLocaleString();
};
// 할인율 구하기
const discountPercent = (originPrice, discountPrice) => {
  const origin = Number(originPrice);
  const discount = Number(discountPrice);
  let result = 0;
  result = Math.floor(((origin - discount) / origin) * 100);
  return result;
};

export {
  capitalizeJs,
  returnBucketUrl,
  mapColors,
  getNonMemberId,
  toWon,
  discountPercent,
};
