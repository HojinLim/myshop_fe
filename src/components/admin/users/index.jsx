import { getAllUsers } from '@/api';
import { Table } from 'antd';
import dayjs from '@/utils/dayjs'; // 경로는 프로젝트에 맞게 수정
import React, { useEffect, useState } from 'react';

const UserTable = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    await getAllUsers()
      .then((res) => {
        console.log(res.users);

        const filtered = res.users.map((data, idx) => {
          return {
            ...data,
            updatedAt: dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
            createdAt: dayjs(data.createdAt).format('YYYY-MM-DD HH:mm:ss'),
          };
        });
        setData(filtered);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!data) {
      setLoading(true);
    } else {
      setLoading(false);
    }
    console.log(data);
  }, [data]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    { title: 'ID', dataIndex: 'id' },
    { title: '이름', dataIndex: 'username' },
    { title: '이메일', dataIndex: 'email' },
    { title: '사용자 유형', dataIndex: 'role' },
    { title: '계정 생성일', dataIndex: 'createdAt' },
    { title: '계정 수정일', dataIndex: 'updatedAt' },
  ];

  return (
    <>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        // loading={loading} // 로딩 표시 추가
        pagination={{ pageSize: 10 }} // 기본 페이지네이션 추가
      />
    </>
  );
};

export default UserTable;
