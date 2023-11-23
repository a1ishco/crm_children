import React from 'react';
import { Flex } from 'antd';

const PageHeader = ({ title, subtitle, extras }) => {
  return (
    <Flex className="page_header_flex_main" justify="space-between">
      <div className="page_header_text">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {extras && <div className="page_header_button">{extras}</div>}
    </Flex>
  );
};

export default PageHeader;
