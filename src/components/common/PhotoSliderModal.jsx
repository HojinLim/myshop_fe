import React, { useEffect } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  CloseOutlined,
  HeartFilled,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useDispatch, useSelector } from 'react-redux';
import { reviewInitialState, setReview } from '@/store/slices/reviewSlice';
import { anonymizeNickname, returnBucketUrl } from '@/utils';
import dayjs from '@/utils/dayjs';

const PhotoSliderModal = () => {
  const { reviews, photos, currentIndex, open } = useSelector(
    (state) => state.reviews.data
  );
  const dispatch = useDispatch();

  return (
    <Layout className="fixed inset-0 bg-black/70 z-100">
      {/* 바깥 검정 배경 레이아웃*/}
      <Content className="w-full h-full bg-black flex items-center justify-center">
        {/* 내부 이미지 컨테이너 레이아웃*/}
        <div className="relative w-full max-w-4xl h-full">
          {/* 닫기 버튼 */}
          <CloseOutlined
            className="absolute top-4 right-4 translate-x-12 !text-white !cursor-pointer z-10 text-xl"
            onClick={() => {
              dispatch(
                setReview({
                  ...reviewInitialState.data,
                  open: false,
                })
              );
            }}
          />

          {/* 화살표 */}
          <button className="custom-prev absolute left-4 -translate-x-16 top-1/2 z-50 -translate-y-1/2 text-4xl text-white w-[50px] h-[50px] !p-3 !rounded-full">
            <LeftOutlined />
          </button>
          <button className="custom-next absolute right-4 translate-x-16  top-1/2 z-50 -translate-y-1/2 text-4xl text-white w-[50px] h-[50px] !p-3 !rounded-full">
            <RightOutlined />
          </button>
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            initialSlide={currentIndex}
            className="h-full"
          >
            {reviews.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="flex flex-col items-center justify-center h-full text-white px-6">
                  {/* 상단 유저 */}
                  <div className="absolute top-6 left-6 text-left text-sm">
                    <div className="flex items-center gap-2">
                      {/* 프로필 사진 */}
                      <Avatar
                        src={
                          item.review.User.profileUrl
                            ? returnBucketUrl(item.review.User.profileUrl)
                            : '/logo.png'
                        }
                        size={64}
                        icon={<UserOutlined />}
                      />
                      <div>
                        <div className="font-semibold">
                          {anonymizeNickname(item.review.User.username)}
                        </div>
                        {item.review.product_option?.color ? (
                          <div className="text-xs opacity-70">{`${item.review.product_option.color} / ${item.review.product_option.size}`}</div>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 이미지 */}
                  <img
                    src={returnBucketUrl(item.imageUrl)}
                    className="w-full h-full object-contain rounded"
                    alt=""
                  />

                  {/* 하단 정보 */}
                  <div className="absolute bottom-20 w-full px-6 text-sm">
                    <div className="opacity-80">
                      ⭐ {item.review.rating} |{' '}
                      {dayjs(item.review.createdAt).format('YYYY.MM.DD')}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">
                      {item.review.content}
                    </p>
                    <div className="mt-2 text-xs opacity-70">
                      <HeartFilled className="!text-red-600" />{' '}
                      {item.review.likes.length}
                    </div>
                  </div>

                  {/* 페이지 표시 */}
                  <div className="absolute bottom-6 text-center text-xs w-full opacity-50">
                    {idx + 1} / {photos.length}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Content>
    </Layout>
  );
};

export default PhotoSliderModal;
