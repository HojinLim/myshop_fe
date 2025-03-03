const bucket_url = import.meta.env.VITE_BUCKET_URL;

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

export { capitalizeJs, returnBucketUrl };
