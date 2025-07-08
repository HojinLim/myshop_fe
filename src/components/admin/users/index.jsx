import {
  Button,
  Col,
  Flex,
  Input,
  Layout,
  message,
  Popconfirm,
  Row,
  Table,
} from 'antd';
import dayjs from '@/utils/dayjs'; // 경로는 프로젝트에 맞게 수정
import React, { useEffect, useState } from 'react';
import { getAllUsers } from '@/api/user';
import { Content } from 'antd/es/layout/layout';
import { deleteReview, getMyReviews } from '@/api/review';
import styles from './index.module.css';
import { updateUserPoints } from '@/api/points';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/slices/loadingSlice';
import { DownOutlined, HomeOutlined, RightOutlined } from '@ant-design/icons';
const UserTable = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [points, setPoints] = useState(null);
  const [reason, setReason] = useState('관리자 권한');
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    await getAllUsers()
      .then((res) => {
        res.users;

        const filtered = res.users.map((data, idx) => {
          return {
            ...data,
            // updatedAt: dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          };
        });
        setData(filtered);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '이름', dataIndex: 'username' },
    { title: '이메일', dataIndex: 'email' },
    { title: '사용자 유형', dataIndex: 'role' },
    { title: '포인트', dataIndex: 'points' },
    { title: '계정 생성일', dataIndex: 'createdAt' },
    // { title: '계정 수정일', dataIndex: 'updatedAt' },
  ];
  const getUserReviews = async () => {
    if (!expandedRowKeys || expandedRowKeys.length <= 0) return;

    dispatch(setLoading(true));
    await getMyReviews(expandedRowKeys[0])
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setReviews(res);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => {})
      .finally(() => {
        dispatch(setLoading(false));
      });
  };
  useEffect(() => {
    if (expandedRowKeys.length > 0) {
      setPoints(null);
      getUserReviews();
    }
  }, [expandedRowKeys]);

  // 포인트 변경 핸들러
  const clickChangePoint = async (id) => {
    if (!points || isNaN(Number(points))) {
      message.warning('유효한 숫자를 기입하세요');
      setPoints('');
      return;
    }

    await updateUserPoints(id, Number(points), reason)
      .then(() => {
        message.success('포인트 변경 완료');
        setPoints(null);
      })
      .catch((err) => {
        message.error(err.message);
      });
  };

  // 리뷰 삭제 핸들러
  const clickDeleteReview = async (reviewId) => {
    await deleteReview(reviewId)
      .then(() => {
        message.success(`ID ${reviewId} 리뷰 삭제 성공!`);
        getUserReviews();
      })
      .catch(() => {
        message.error('리뷰 삭제 실패');
      });
  };

  return (
    <Layout>
      <Row>
        <Col span={24}>
          <Table
            className={styles.table}
            columns={columns}
            dataSource={data}
            rowKey="id"
            bordered
            rowClassName={(record) =>
              expandedRowKeys.includes(record.id) ? styles.expandedRow : ''
            }
            expandable={{
              expandedRowKeys,
              expandedRowRender: (record) => (
                <Layout className={styles.content_layout}>
                  <p className="text-xl font-bold !mb-5">포인트 전송/회수</p>
                  <Content className="rounded-lg border p-5">
                    <Flex>
                      <span className="w-30">포인트</span>
                      <Input
                        className="w-70"
                        variant="underlined"
                        placeholder="전송할 포인트"
                        value={points}
                        onChange={(e) => {
                          setPoints(e.target.value);
                        }}
                      />
                    </Flex>
                    <Flex className="!mt-3">
                      <span className="w-30">사유</span>
                      <Input
                        placeholder="관리자 포인트"
                        variant="underlined"
                        value={reason}
                        onChange={(e) => {
                          setReason(e.target.value);
                        }}
                      />
                    </Flex>
                    <div className="w-full flex justify-end">
                      <Button
                        className="w-30 !mt-5 !place-self-end"
                        onClick={() => clickChangePoint(record.id)}
                      >
                        전송
                      </Button>
                    </div>
                  </Content>
                  <p className="text-xl font-bold !my-8">작성한 리뷰</p>
                  <Content className="rounded-lg border p-5">
                    {reviews.length > 0 ? (
                      reviews.map((review, idx) => (
                        <Content key={idx}>
                          <Flex justify="space-between" className="!my-3">
                            <div>
                              <span className="w-5 text-right">
                                {review.id}:
                              </span>
                              <span className="ml-5">
                                {review.content || '_'}
                              </span>
                            </div>
                            <Popconfirm
                              title={`${review.id}을(를) 정말 삭제합니까?`}
                              onConfirm={() => clickDeleteReview(review.id)}
                            >
                              <Button>삭제</Button>
                            </Popconfirm>
                          </Flex>
                        </Content>
                      ))
                    ) : (
                      <div>작성한 리뷰가 없습니다.</div>
                    )}
                  </Content>
                </Layout>
              ),
              onExpand: (expanded, record) => {
                if (expanded) {
                  setExpandedRowKeys([record.id]); // 하나만 펼치게 설정
                } else {
                  setExpandedRowKeys([]);
                }
              },
              rowExpandable: (record) => !!record.email,
              expandIcon: ({ expanded, onExpand, record }) =>
                expanded ? (
                  <DownOutlined onClick={(e) => onExpand(record, e)} />
                ) : (
                  <RightOutlined onClick={(e) => onExpand(record, e)} />
                ),
            }}
            pagination={false}
          />
        </Col>
      </Row>
    </Layout>
  );
};

export default UserTable;
