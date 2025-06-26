import { Breadcrumb, Button, Flex, Image, Modal, Table, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { RedoOutlined } from '@ant-design/icons';
import { getProducts, updateProductPhoto } from '@/api/product';
import { Content } from 'antd/es/layout/layout';
import { returnBucketUrl } from '@/utils';
import UploadButton from './UploadButton';
import UploadPhotoContainer from '@/components/common/UploadPhotoContainer';

const MAX_IMAGES = 5;

const EditProductPicModal = ({
  imageEditModalOpen,
  setImageEditModalOpen,
  productId,
}) => {
  const [images, setImages] = useState({ main: [], detail: [] });
  const [deleteImageIds, setDeleteImageIds] = useState([]);

  const handleAddImage = (type) => async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ url: e.target.result, file });
        reader.readAsDataURL(file);
      });
    });

    const result = await Promise.all(readers);

    setImages((prev) => ({
      ...prev,
      [type]: [...prev[type], ...result].slice(0, MAX_IMAGES),
    }));

    e.target.value = '';
  };
  const handleDeleteImage = (index, type) => {
    // 서버에서 불러온 이미지일 경우 id 저장
    const deletedImage = images[type][index];

    if (deletedImage?.file === null && deletedImage?.id) {
      setDeleteImageIds((prev) => [...prev, deletedImage.id]);
    }

    setImages((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const fetchProduct = async () => {
    await getProducts('id', productId)
      .then((res) => {
        if (res.products && res.products.length > 0) {
          const productImages = res.products[0].ProductImages;
          const main = productImages.filter((image) => image.type === 'main');
          const detail = productImages.filter(
            (image) => image.type === 'detail'
          );

          const existingMain = (main || []).map((img) => ({
            id: img.id,
            url: returnBucketUrl(img.imageUrl),
            file: null,
          }));
          const existingDetail = (detail || []).map((img) => ({
            id: img.id,
            url: returnBucketUrl(img.imageUrl),
            file: null,
          }));

          setImages({
            main: existingMain,
            detail: existingDetail,
          });
        } else {
        }
      })
      .finally(() => {});
  };
  useEffect(() => {
    if (imageEditModalOpen && productId) {
      fetchProduct();
    }
  }, [imageEditModalOpen, productId]);
  const clickUpload = async () => {
    await updateProductPhoto(productId, images, deleteImageIds)
      .then((res) => {
        console.log(res);
      })
      .catch(() => {});
  };

  return (
    <>
      <Modal
        width="2000px"
        open={imageEditModalOpen}
        title={
          <Flex justify="space-between">
            <h4>이미지 관리</h4>
            <Breadcrumb style={{ marginRight: '15px' }} />
          </Flex>
        }
        onCancel={() => {
          // setOpen(false);
          setImageEditModalOpen(false);
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              // setOpen(false);
              setImageEditModalOpen(false);
            }}
          >
            나중에 하기
          </Button>,
          // <Button
          //   key="reset"
          //   type="primary"
          //   // onClick={resetField}
          //   icon={<RedoOutlined />}
          // >
          //   리셋
          // </Button>,
          <Button
            key="upload"
            type="primary"
            onClick={clickUpload}
            // icon={<RedoOutlined />}
          >
            업로드
          </Button>,
        ]}
      >
        <Content>
          <p>메인</p>
          <UploadPhotoContainer
            type="main"
            handleAddImage={handleAddImage('main')}
            handleDeleteImage={handleDeleteImage}
            images={images.main}
            MAX_IMAGES={MAX_IMAGES}
          />
          <p>디테일</p>
          <UploadPhotoContainer
            type="detail"
            handleAddImage={handleAddImage('detail')}
            handleDeleteImage={handleDeleteImage}
            images={images.detail}
            MAX_IMAGES={MAX_IMAGES}
          />
        </Content>
      </Modal>
    </>
  );
};

export default EditProductPicModal;
