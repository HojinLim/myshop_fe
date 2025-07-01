import {
  Avatar,
  Button,
  Col,
  Flex,
  Form,
  Image,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Typography,
  Upload,
} from 'antd';

import React, { useState } from 'react';
import styles from './index.module.css';
import { PlusOutlined } from '@ant-design/icons';

import { uploadProduct } from '@/api/product';
import UploadButton from './UploadButton';

const UploadLayout = (props) => {
  const { selectCateogry, fetchProduct } = props;
  const [form] = Form.useForm();

  // 이미지 상태 관리
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [mainImages, setMainImages] = useState([]);

  // 상품 등록 폼 상태
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    originPrice: '',
    discountPrice: '',
    mainFiles: [],
    detailFiles: [],
  });

  // 상품 등록 폼 핸들러
  const onChangeForm = (value, type) => {
    setProductForm({ ...productForm, [type]: value });
  };

  // 상품 업로드
  const uploadProductHandler = async () => {
    await uploadProduct(productForm)
      .then((res) => {
        message.success('상품 등록 완료 ');
        // ✅ 상품 목록 다시 불러오기
        fetchProduct();
        // 초기화
        setProductForm({
          name: '',
          category: '',
          originPrice: '',
          discountPrice: '',
          mainFiles: [],
          detailFiles: [],
        });
        form.resetFields();
      })
      .catch((err) => {});
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  return (
    <Col span={10} className="upload_layout">
      <Row>
        <Col span={24}>
          <h4>상품 업로드</h4>
          {/* 메인 사진 업로드 */}
          <h5>메인 사진 업로드</h5>
          <Upload
            listType="picture-card"
            type="file"
            accept="image/*"
            onChange={({ fileList }) => {
              setProductForm((prev) => ({
                ...prev,
                mainFiles: fileList, // ✅ 업데이트된 fileList를 그대로 반영
              }));
            }}
            beforeUpload={(file) => {
              setProductForm((prev) => ({
                ...prev,
                mainFiles: [...prev.mainFiles, file], // ✅ File 객체 저장
              }));
              return false; // 자동 업로드 방지
            }}
            fileList={productForm.mainFiles} // 선택한 파일 리스트 관리
            onRemove={(file) =>
              setProductForm((prev) => ({
                ...prev,
                mainFiles: prev.mainFiles.filter(
                  (item) => item.uid !== file.uid
                ),
              }))
            }
          >
            {productForm.mainFiles &&
            productForm.mainFiles.length >= 5 ? null : (
              <UploadButton />
            )}
          </Upload>

          {/* 디테일 사진 업로드 */}
          <h5>디테일 사진 업로드</h5>
          <Upload
            listType="picture-card"
            fileList={productForm.detailFiles}
            onPreview={handlePreview}
            onChange={({ fileList }) => {
              setProductForm((prev) => ({
                ...prev,
                detailFiles: fileList, // ✅ 업데이트된 fileList를 그대로 반영
              }));
            }}
            beforeUpload={(file) => {
              setProductForm((prev) => ({
                ...prev,
                detailFiles: [...prev.detailFiles, file], // ✅ File 객체 저장
              }));
              return false; // 자동 업로드 방지
            }}
            onRemove={(file) =>
              setProductForm((prev) => ({
                ...prev,
                detailFiles: prev.detailFiles.filter(
                  (item) => item.uid !== file.uid
                ),
              }))
            }
          >
            {productForm.detailFiles &&
            productForm.detailFiles.length >= 5 ? null : (
              <UploadButton />
            )}
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{ display: 'none' }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(''),
              }}
              src={previewImage}
            />
          )}
        </Col>

        <Col span={24}>
          <Form
            form={form}
            className="form_container"
            name="basic"
            labelAlign="left"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 24,
            }}
            initialValues={{
              remember: true,
            }}
            autoComplete="off"
          >
            <Typography.Title level={5}>상품명</Typography.Title>
            <Form.Item
              name="name"
              rules={[
                {
                  required: true,
                  message: '폼을 입력해주세요!',
                },
              ]}
            >
              <Input
                type="text"
                variant="underlined"
                onChange={(e) => onChangeForm(e.target.value, 'name')}
              />
            </Form.Item>

            <Typography.Title level={5}>카테고리</Typography.Title>
            <Form.Item
              name="category"
              rules={[
                {
                  required: true,
                  message: '폼을 입력해주세요!',
                },
              ]}
            >
              <Select
                // defaultValue="전체"
                style={{ width: '100%' }}
                options={selectCateogry}
                onChange={(value) => {
                  onChangeForm(value, 'category');
                }}
                variant="underlined"
              />
            </Form.Item>
            <Typography.Title level={5}>기존 가격</Typography.Title>
            <Form.Item
              name="originPrice"
              rules={[
                {
                  required: true,
                  message: '폼을 입력해주세요!',
                },
              ]}
            >
              <InputNumber
                className={styles.inputNumber}
                type="text"
                suffix={<div className={styles.circle_icon}>원</div>}
                formatter={(value) =>
                  value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                }
                parser={(value) => value.replace(/\D/g, '')}
                controls={false}
                onChange={(e) => onChangeForm(e, 'originPrice')}
                variant="underlined"
              />
            </Form.Item>
            <Typography.Title level={5}>할인된 가격</Typography.Title>
            <Form.Item
              name="discountPrice"
              rules={[
                {
                  required: true,
                  message: '폼을 입력해주세요!',
                },
              ]}
            >
              <InputNumber
                className={styles.inputNumber}
                type="text"
                suffix={<div className={styles.circle_icon}>원</div>}
                formatter={(value) =>
                  value ? value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                }
                parser={(value) => value.replace(/\D/g, '')}
                controls={false}
                onChange={(e) => onChangeForm(e, 'discountPrice')}
                variant="underlined"
              />
            </Form.Item>
          </Form>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            onClick={uploadProductHandler}
          >
            상품 등록
          </Button>
        </Col>
      </Row>
    </Col>
  );
};

export default UploadLayout;
