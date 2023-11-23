
import React from "react"
import { Col, Row } from "antd";


const ChildrenTableModal = ({ datas }) => {

  return (
    <Row>
      <Col xs={24}>
        <hr />
        <h3 style={{ textAlign: "center" }}>Children datas</h3>
      </Col>

      {datas?.children?.map((child, index) => (
        <Col xs={24} key={index}>
          <p>Child full name: {child.first_name + " " + child.last_name}</p>
          <p>Gender: {child.gender === 1 ? "Male" : "Female"}</p>
          <p>Birth of Date: {child.birth_of_date}</p>
          <p>Parent full name: {child.parent}</p>
        </Col>
      ))}
    </Row>
  );
};

export default ChildrenTableModal;
