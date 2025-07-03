import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { Col, Flex, Input, message, Rate, Row } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { searchProduct } from '@/api/search';
import { Content } from 'antd/es/layout/layout';
import NotFound from '@/components/notfound';
import { discountPercent, returnBucketUrl } from '@/utils';
const SearchProduct = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState([]);
  const myRef = useRef(null);
  const location = useLocation();

  const [searchKeyword, setSearchKeyword] = useState(keyword || '');

  const fetchSearchProduct = async () => {
    if (!searchKeyword) return;

    await searchProduct(searchKeyword)
      .then((res) => {
        if (Array.isArray(res.products)) {
          if (res.message === '검색 완료') {
            message.success(res.message);
          }
          setResult(res.products);
        } else {
          setResult(null);
          message.warning(res.message);
        }
      })
      .catch(() => {});
  };

  const moveWithKeyword = () => {
    navigate(`/search/${searchKeyword}`);
  };
  useEffect(() => {
    myRef.current.focus();
    fetchSearchProduct();
  }, [keyword]);

  return (
    <Content>
      <Input
        ref={myRef}
        size="large"
        variant="underlined"
        prefix={
          <ArrowLeftOutlined
            className="cursor-pointer"
            onClick={() => {
              navigate('/');
            }}
          />
        }
        suffix={
          <SearchOutlined
            className="cursor-pointer"
            onClick={moveWithKeyword}
          />
        }
        allowClear
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        onPressEnter={moveWithKeyword}
      />
      {result?.length <= 0 && (
        <NotFound
          title="검색 결과가 없습니다."
          subTitle="다른 검색어를 입력하시거나
철자 및 띄어쓰기를 확인해주세요."
          type="noBtn"
        />
      )}
      <Row gutter={24}>
        {result?.map((product, idx) => (
          <Col key={idx} span={8} className="my-3">
            <Flex wrap>
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => {
                  navigate(`/product/${product.id}`);
                }}
              >
                <div className="aspect-square overflow-hidden rounded-xl w-full content-center mb-3">
                  <img
                    className="w-full object-fit"
                    src={returnBucketUrl(product?.ProductImages[0]?.imageUrl)}
                  />
                </div>
                <div className="flex font-bold">
                  <p className="mr-1 text-red-500">
                    {discountPercent(
                      product.originPrice,
                      product.discountPrice
                    )}
                    %
                  </p>
                  <p>{Number(product.discountPrice).toLocaleString()}</p>
                </div>
                <p className="text-gray-600">{product.name}</p>
                {product?.reviews?.length > 0 && (
                  <div className="flex">
                    <Rate count={1} value={1} disabled />
                    <p>{parseFloat(product?.avg_rating).toFixed(1)}</p>
                    <p className="text-gray-600">{`(${product?.reviews?.length})`}</p>
                  </div>
                )}
              </div>
            </Flex>
          </Col>
        ))}
      </Row>
    </Content>
  );
};

export default SearchProduct;
