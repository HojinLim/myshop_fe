import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Content, Footer } from 'antd/es/layout/layout';
import MenuHeader from '@/components/common/MenuHeader';
import { Button, Divider, Flex, Input, message, Rate } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { returnBucketUrl } from '@/utils';
import NotFound from '@/components/notfound';
import { updateReview, uploadReview } from '@/api/review';
import { useSelector } from 'react-redux';
import UploadPhotoContainer from '@/components/common/UploadPhotoContainer';

const MAX_IMAGES = 3;

const UploadReview = () => {
  const navigate = useNavigate();
  const [clear, setClear] = useState(true);
  const [rate, setRate] = useState(null);
  const [images, setImages] = useState([]);
  const [content, setContent] = useState('');
  const [userInfo, setUserInfo] = useState({
    gender: null,
    height: null,
    weight: null,
    infoSave: false,
  });
  const [deleteImageIds, setDeleteImageIds] = useState([]);
  const location = useLocation();
  const user = useSelector((state) => state.user.data);
  const item = location.state;

  if (!item) return <NotFound />;

  const rateValue = {
    1: '별로예요',
    2: '그저 그래요',
    3: '괜찮아요',
    4: '좋아요',
    5: '최고예요',
  };

  // 초기화
  const init = () => {
    if (item.type === 'update') {
      setRate(item.rating);
      setUserInfo({
        gender: item.gender,
        height: item.height,
        weight: item.weight,
        infoSave: false,
      });
      setContent(item.content || '');
      if (item.review_images && item.review_images.length) {
        const existingImages = item.review_images.map((img) => ({
          url: returnBucketUrl(img.imageUrl),
          file: null, // 서버에서 온 이미지는 File 객체가 없으므로 null
        }));
        setImages(existingImages);
      }
    }
  };

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newImages = files.slice(0, MAX_IMAGES - images.length);
    const readers = newImages.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ url: e.target.result, file });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((imageData) => {
      setImages((prev) => [...prev, ...imageData]);
      e.target.value = ''; // 다시 중복된 사진 올려도 값 변하게끔
    });
  };

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    // file이 존재하지 않는 수정의 경우 id를 따로 저장해둠(향후 삭제를 위해)
    if (images[index]['file'] === null) {
      setDeleteImageIds((prev) => [...prev, item.review_images[index].id]);
    }
  };
  const clickHandleReview = async () => {
    const { id: option_id } = item.product_option;
    const { id: prodcut_id } = item.product_option.Product;

    if (!rate) {
      message.warning('평가는 필수입니다!');
      return;
    }

    const data = {
      user_id: user.id,
      product_id: prodcut_id,
      option_id: option_id,
      rating: rate,
      content: content || null,
      gender: userInfo['gender'] || null,
      height: userInfo['height'] || null,
      weight: userInfo['weight'] || null,
    };
    try {
      // 리뷰 업데이트
      if (item.type === 'update') {
        const updateData = { ...data, deleteImageIds };
        await updateReview(item.id, updateData, images);
      } else {
        // 리뷰 생성

        await uploadReview(data, images);
      }
      message.success('리뷰 업로드 완료!');
      // navigate('/mypage/review');
    } catch (err) {
      console.log(err);
    }
  };

  // 유저 신체 정보 상태 핸들러
  const setUserInfoHandler = (e) => {
    const { name, value, type, checked } = e.target;

    setUserInfo((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <Content className={styles.review_layout}>
      <MenuHeader title="리뷰 작성" />
      <p className="text-xl">이 상품 어떠셨나요?</p>
      <Flex>
        <div className="aspect-square overflow-hidden w-32">
          <img
            src={
              item.product_option.Product?.ProductImages[0]
                ? returnBucketUrl(
                    item.product_option.Product.ProductImages[0].imageUrl
                  )
                : '/none_logo.png'
            }
          />
        </div>
        <div className="flex flex-col justify-end p-2">
          <p>{item.product_option.Product.name}</p>
          <p>{`${item.product_option.color} · ${item.product_option.size}`}</p>
        </div>
      </Flex>
      <Flex className="items-center !mt-3">
        <Rate
          allowHalf={false}
          allowClear={clear}
          defaultValue={0}
          value={rate}
          onChange={(e) => {
            setRate(e);
          }}
          onFocus={() => {
            if (clear) setClear(false);
          }}
        />
        <p className="ml-3">{rate ? rateValue[rate] : ''}</p>
      </Flex>
      <Divider />
      <p className="text-xl !mb-3">어떤 점이 좋았나요?</p>
      <p className="font-semibold !mb-2">본문 입력(선택)</p>
      <textarea
        className={styles.review_textArea}
        onChange={(e) => setContent(e.target.value)}
        value={content}
        name="content"
        placeholder="후기를 입력하세요"
      ></textarea>
      <p className="text-right text-gray-400">0/500</p>

      <p>사진 첨부</p>
      <UploadPhotoContainer
        images={images}
        handleAddImage={handleAddImage}
        handleDeleteImage={handleDeleteImage}
        MAX_IMAGES={MAX_IMAGES}
      />
      <Divider />
      <p className="text-xl !mb-3">내 체형정보를 입력해주세요 (선택)</p>
      <Flex className="gap-3 !my-3" vertical>
        <p>성별</p>
        <div className="flex">
          <button
            className={`${styles.review_gender_btn} ${
              userInfo.gender === 'male' ? styles.clicked : ''
            }`}
            name="gender"
            value="male"
            onClick={setUserInfoHandler}
          >
            남성
          </button>
          <button
            name="gender"
            value="female"
            className={`${styles.review_gender_btn} ${
              userInfo.gender === 'female' ? styles.clicked : ''
            }`}
            onClick={setUserInfoHandler}
          >
            여성
          </button>
        </div>
        <label>키</label>
        <Input
          suffix="cm"
          placeholder="키를 입력해주세요"
          allowClear
          name="height"
          maxLength={5}
          value={userInfo.height}
          onChange={setUserInfoHandler}
        />
        <label>몸무게</label>
        <Input
          suffix="kg"
          placeholder="키를 입력해주세요"
          allowClear
          name="weight"
          maxLength={5}
          value={userInfo.weight}
          onChange={setUserInfoHandler}
        />
      </Flex>
      {/* <Flex>
        <input
          type="checkbox"
          name="infoSave"
          value={userInfo.infoSave}
          onChange={setUserInfoHandler}
        />
        <p className="!ml-2">나의 신체정보에 업데이트</p>
      </Flex> */}

      <Button className={styles.review_upload_btn} onClick={clickHandleReview}>
        {item.type === 'update' ? '수정하기' : '업로드'}
      </Button>
    </Content>
  );
};

export default UploadReview;
