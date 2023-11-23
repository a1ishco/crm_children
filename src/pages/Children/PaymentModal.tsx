// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react"
import { Modal, Form, Button, Checkbox, message } from "antd";
import { useState } from "react";

const PaymentModal = ({ visible, onCancel, record }) => {
  const [loading, setLoading] = useState(false);
  const [selectedNames, setSelectedNames] = useState([]);

  const handlePaymentSubmit = async (values) => {
    console.log("Selected Names:", selectedNames);
    message.success("Payment was successfull")
    message.error("Error occured during payment")

  };

  return (
    <Modal
      title="Payment"
      open={visible}
      onCancel={onCancel}
      footer={null}
      className="payment_modal"
      destroyOnClose
      footer={
        <Button id="make_payment_btn" type="primary" htmlType="submit" loading={loading}>
            Make Payment
          </Button>
      }
    >
      <Form onFinish={handlePaymentSubmit} layout="vertical">
        <Form.Item name="firstName" label="Select First Name">
          <Checkbox.Group
            options={record?.children.map((child) => ({
              label: child.first_name,
              value: child.first_name,
            }))}
            onChange={(values) => setSelectedNames(values)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PaymentModal;
