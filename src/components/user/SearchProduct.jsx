import React, { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Flex, Input, message } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { searchProduct } from '@/api/search';
import { Content } from 'antd/es/layout/layout';
import NotFound from '@/components/notfound';
const SearchProduct = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState([]);

  const [searchKeyword, setSearchKeyword] = useState(keyword || null);

  const fetchSearchProduct = async () => {
    await searchProduct(searchKeyword)
      .then((res) => {
        console.log(res);
        message.warning(res.message);
        if (Array.isArray(res.products)) {
          setResult(res.products);
        } else {
          setResult(null);
        }
      })
      .catch(() => {});
  };

  const moveWithKeyword = () => {
    navigate(`/search/${searchKeyword}`);
    fetchSearchProduct();
  };
  useEffect(() => {
    fetchSearchProduct();
  }, [keyword]);
  return (
    <Content>
      <Input
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
      <Flex></Flex>
    </Content>
  );
};

export default SearchProduct;
