import React, { useState } from 'react';
import styles from './index.module.css';
import { EllipsisOutlined } from '@ant-design/icons';
import { Flex } from 'antd';
const MenuDrawer = (props) => {
  const [open, setOpen] = useState(false);
  const { menuItems = [{ text: '견본', handler: () => {} }] } = props;

  return (
    <div className={styles.menu_container}>
      <EllipsisOutlined
        className="cursor-pointer"
        onClick={() => {
          setOpen((prev) => !prev);
        }}
      />
      <Flex vertical className={styles.menu_inner}>
        {open &&
          menuItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                item.handler();
                setOpen(false);
              }}
            >
              {item.text}
            </div>
          ))}
      </Flex>
    </div>
  );
};

export default MenuDrawer;
