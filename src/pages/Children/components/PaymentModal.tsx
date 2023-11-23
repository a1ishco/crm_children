// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react";
import {
  Modal,
  Form,
  Checkbox,
  message,
  Flex,
  Row,
  Col,
  Button,
  Spin,
  Divider,
} from "antd";
import { useState } from "react";
import { childrenPrice } from "../../../api/children/children";

const PaymentModal = ({ visible, onCancel, record }) => {
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [totalPrices, setTotalPrices] = useState([]);

  const handleChildChange = async (values) => {
    setLoadingPrices(true);
    try {
      const customerID = record.id;
      const childIDs = values.map(
        (name) => record.children.find((child) => child.first_name === name)?.id
      );

      const result = await childrenPrice("", customerID, childIDs);

      if (result.success) {
        setTotalPrices(result.data.price + " AZN");
        setLoadingPrices(false);
      } else {
        message.error(`Error occurred during payment: ${result.error}`);
      }
    } catch (error) {
      console.error("Error handling payment:", error);
      message.error("An error occurred during payment");
    }
  };
  const handleModalClose = () => {
    setPrices([]);
    onCancel();
  };
  return (
    <Modal
      title="Payment"
      open={visible}
      onCancel={handleModalClose}
      footer={null}
      className="payment_modal"
      destroyOnClose
      footer={<ModalFooter loading={loading} loadingPrices={loadingPrices} prices={totalPrices}/>}
    >
      <Row>
        <Col xs={24}>
          <p style={{ textAlign: "center", fontWeight: "600" }}>
            Select children
          </p>
        </Col>
        <Col xs={12}>
          <Form layout="vertical">
            <Form.Item name="firstName">
              <Checkbox.Group
                options={record?.children.map((child) => ({
                  label: child.first_name,
                  value: child.first_name,
                }))}
                onChange={(values) => {
                  handleChildChange(values);
                }}
              />
            </Form.Item>
          </Form>
        </Col>
        <Col xs={12}></Col>
      </Row>
    </Modal>
  );
};

export default PaymentModal;

const ModalFooter = ({ loading , loadingPrices , totalPrices}) => {
  return (
    <>
      <Divider />
      <Flex justify="space-between" align="center" gap={20} >
        <Spin spinning={loadingPrices} className="spinner_payment">
          <p style={{ textAlign: "left" , fontWeight:"600" , margin:0 , borderRight:"1px solid gray", lineHeight:3 }}>Total: {totalPrices}</p>
        </Spin>
        <Flex gap={10} className="button_payment_flex">
          <Button className="make_payment_btn" type="primary" loading={loading}>
          Pay via Cash
        </Button>
        <Button
          className="make_payment_btn"
          type="primary"
          htmlType="submit"
          loading={loading}
          // onClick={handlePaymentSubmit}
        >
          Pay via Card
        </Button>
        </Flex>
        
      </Flex>
    </>
  );
};
