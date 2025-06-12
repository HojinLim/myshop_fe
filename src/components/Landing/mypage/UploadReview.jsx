import React, { useState } from 'react';
import styles from './index.module.css';
import { Content, Footer } from 'antd/es/layout/layout';
import MenuHeader from '@/components/common/MenuHeader';
import { Button, Divider, Flex, Input, Rate } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import { returnBucketUrl } from '@/utils';
import NotFound from '@/components/notfound';

const MAX_IMAGES = 10;

const UploadReview = () => {
  const [clear, setClear] = useState(true);
  const [rate, setRate] = useState(null);
  const [images, setImages] = useState([]);
  const [content, setContent] = useState('');
  const location = useLocation();
  const item = location.state;

  if (!item) return <NotFound />;

  const rateValue = {
    1: '별로예요',
    2: '그저 그래요',
    3: '괜찮아요',
    4: '좋아요',
    5: '최고예요',
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
    });
  };

  const handleDeleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  const clickUploadReview = async () => {};

  return (
    <Content className={styles.review_layout}>
      <MenuHeader title="리뷰 작성" />
      <p className="text-xl">이 상품 어떠셨나요?</p>
      <Flex>
        <div className="aspect-square overflow-hidden w-32">
          <img
            src={returnBucketUrl(
              item.product_option.Product.ProductImages[0].imageUrl
            )}
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
      <p className="font-semibold !mb-2">본문 입력(필수)</p>
      <textarea
        className={styles.review_textArea}
        onChange={(e) => setContent(e.target.value)}
        value={content}
        name="content"
        placeholder="후기를 입력하세요"
      ></textarea>
      <p className="text-right text-gray-400">0/500</p>

      <p>사진 첨부</p>
      <Flex className={styles.review_photo_container}>
        {/* 사진 아이템 */}
        {images.map((img, index) => (
          <div key={index} className={styles.review_photo_item}>
            <img src={img.url} />
            <p onClick={() => handleDeleteImage(index)}>x</p>
          </div>
        ))}
        {/* 사진 추가 */}
        <label className={styles.review_photo_add}>
          +
          <div className="text-gray-400">
            {images.length}/{MAX_IMAGES}
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImage}
          />
        </label>
      </Flex>
      <Divider />
      <p className="text-xl !mb-3">내 체형정보를 입력해주세요 (필수)</p>
      <Flex className="gap-3 !my-3" vertical>
        <p>성별</p>
        <div className="flex">
          <button>남성</button>
          <button>여성</button>
        </div>
        <label>키</label>
        <Input suffix="cm" placeholder="키를 입력해주세요" allowClear />
        <label>몸무게</label>
        <Input suffix="kg" placeholder="키를 입력해주세요" allowClear />
      </Flex>
      <Flex>
        <input type="checkbox" />
        <p className="!ml-2">나의 신체정보에 업데이트</p>
      </Flex>

      <Button className={styles.review_upload_btn} onClick={clickUploadReview}>
        업로드
      </Button>
      {/* <Footer className={styles.review_footer} /> */}
    </Content>
  );
};

export default UploadReview;
