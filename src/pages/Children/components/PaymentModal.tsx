// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react";
import {
  Modal,
  Form,
  Checkbox,
  Flex,
  Row,
  Col,
  Button,
  Spin,
  Divider,
  message,
} from "antd";
import { useState } from "react";
import { childrenPayment, childrenPrice } from "../../../api/children/children";

const PaymentModal = ({ visible, onCancel, record }) => {
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [childrenID, setChildrenID] = useState([]);
  const [totalPrices, setTotalPrices] = useState("");
  const [childPrices, setChildPrices] = useState([]);

  const handleChildChange = async (values) => {
    setLoadingPrices(true);
    try {
      const customerID = record.id;
      const childIDs = values.map(
        (name) => record.children.find((child) => child.first_name === name)?.id
      );

      setChildrenID(childIDs);
      console.log(childIDs);

      const result = await childrenPrice("", customerID, childIDs);

      if (result.success) {
        setChildPrices(result.data.data.children);
        setLoadingPrices(false);
        setTotalPrices(result.data.data.total + " AZN");
      } else {
        message.error(`Error occured! Please select one of the child`);
        setTotalPrices("")
        setLoadingPrices(false)
      }
    } catch (error) {
      message.error("An error occurred during payment");
    }
  };

  const handleModalClose = () => {
    setTotalPrices([]);
    setChildPrices([]);
    onCancel();
  };

  const handleCashPaymentSubmit = async () => {
    setLoading(true);
    try {
      const customerID = record.id;
      const payload = {
        children_id: childrenID,
        payment_type: "cash",
      };
      const result = await childrenPayment("", customerID, childrenID, payload);

      if (result.success) {
        message.success("Cash payment completed successfully");
        setLoading(false);
        handleModalClose()
      } else {
        console.log("ERROR!!");
        message.error("Payment error occured");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleCardPaymentSubmit = async () => {
    setLoading(true);
    try {
      const customerID = record.id;
      const payload = {
        children_id: childrenID,
        payment_type: "card",
      };
      const result = await childrenPayment("", customerID, childrenID, payload);

      if (result.success) {
        message.success("Card payment completed successfully");
        setLoading(false);
        handleModalClose()
      } else {
        console.log("ERROR!!");
        message.error("Payment error occured");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <Modal
      title="Payment"
      open={visible}
      onCancel={handleModalClose}
      className="payment_modal"
      destroyOnClose
      footer={
        <ModalFooter
          loading={loading}
          loadingPrices={loadingPrices}
          totalPrices={totalPrices}
          onCashPaymentSubmit={handleCashPaymentSubmit}
          onCardPaymentSubmit={handleCardPaymentSubmit}
        />
      }
    >
      <Row>
        <Col xs={24}>
          <p style={{ textAlign: "center", fontWeight: "600" }}>
            Select children
          </p>
        </Col>
        <Col xs={24}>
          <Form layout="vertical">
            <Form.Item name="firstName" className="payment_form_item">
              <Checkbox.Group
                options={record?.children.map((child, index) => ({
                  label: `${index + 1}. ${child.first_name}`,
                  value: child.first_name,
                  index: index,
                }))}
                onChange={(values) => {
                  handleChildChange(values);
                }}
              />

              <Flex vertical>
                {childPrices.map((child) => (
                  <p
                    key={child.id}
                    style={{ textAlign: "center", fontWeight: "600" }}
                  >
                    {child.price} AZN
                  </p>
                ))}
              </Flex>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  );
};

export default PaymentModal;

const ModalFooter = ({
  loading,
  loadingPrices,
  totalPrices,
  onCashPaymentSubmit,
  onCardPaymentSubmit,
}) => {
  return (
    <>
      <Divider />
      <Flex justify="space-between" align="center" gap={20}>
        <Spin spinning={loadingPrices} className="spinner_payment">
          <p
            style={{
              textAlign: "left",
              fontWeight: "600",
              margin: 0,
              borderRight: "1px solid gray",
              lineHeight: 3,
            }}
          >
            Total: {totalPrices}
          </p>
        </Spin>
        <Flex gap={10} className="button_payment_flex">
          <Button
            className="make_payment_btn"
            type="primary"
            loading={loading}
            onClick={onCashPaymentSubmit}
            disabled={totalPrices===""}
          >
            Pay via Cash
          </Button>
          <Button
            className="make_payment_btn"
            type="primary"
            htmlType="submit"
            loading={loading}
            onClick={onCardPaymentSubmit}
            disabled={totalPrices===""}
          >
            Pay via Card
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
