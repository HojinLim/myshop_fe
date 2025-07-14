import React from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const testPhotos = [
  {
    url: 'https://placehold.co/800x800?text=Image+2',
    user: '홍길동',
    size: '250 구매',
    date: '23.11.02',
    rating: 4,
    comment: '디자인 깔끔하고 가벼워요.',
    replyCount: 2,
  },
  {
    url: 'https://placehold.co/800x800?text=Image+2',
    user: '홍길동',
    size: '250 구매',
    date: '23.11.02',
    rating: 4,
    comment: '디자인 깔끔하고 가벼워요.',
    replyCount: 2,
  },

  // ... 나머지 데이터
];
const onClose = () => {};

const PhotoSliderModal = ({ currentIndex = 0, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-5000 flex items-center justify-center">
      <div className="relative w-full max-w-4xl h-full bg-black  overflow-hidden">
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-white text-2xl z-50 rounded-3xl"
          onClick={onClose}
        >
          ✕
        </button>
        {/* 화살표 */}
        <button className="custom-prev absolute left-4 top-1/2 z-50 -translate-y-1/2 text-4xl text-white">
          ←
        </button>
        <button className="custom-next absolute right-4 top-1/2 z-50 -translate-y-1/2 text-4xl text-white">
          →
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
          {testPhotos.map((photo, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col items-center justify-center h-full text-white px-6">
                {/* 상단 유저 */}
                <div className="absolute top-6 left-6 text-left text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white" />
                    <div>
                      <div className="font-semibold">{photo.user}</div>
                      <div className="text-xs opacity-70">{photo.size}</div>
                    </div>
                  </div>
                </div>

                {/* 이미지 */}
                <img
                  src={photo.url}
                  className="max-h-[65vh] object-contain rounded"
                  alt=""
                />

                {/* 하단 정보 */}
                <div className="absolute bottom-20 w-full px-6 text-sm">
                  <div className="opacity-80">
                    ⭐ {photo.rating} | {photo.date}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{photo.comment}</p>
                  <div className="mt-2 text-xs opacity-70">
                    💬 {photo.replyCount}
                  </div>
                </div>

                {/* 페이지 표시 */}
                <div className="absolute bottom-6 text-center text-xs w-full opacity-50">
                  {idx + 1} / {testPhotos.length}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PhotoSliderModal;
