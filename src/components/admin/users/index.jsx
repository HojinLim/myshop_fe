import { getAllUsers } from '@/api';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

const UserTable = () => {
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const fetchUsers = async () => {
    //   try {
    //     setLoading(true);
    //     await getAllUsers(setData).then(() => {
    //       console.log(data);
    //     });
    //     const users = data.map((user) => ({ ...user, key: user.id }));
    //     setData(users); // key 설정
    //   } catch (error) {
    //     console.error('Failed to fetch users:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    getAllUsers(setData);
  }, []);
  useEffect(() => {
    if (!data) {
      setLoading(true);
    } else {
      // key 설정
      // const users = data.map((user) => ({ ...user, key: user.id }));
      // setData(users);
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
