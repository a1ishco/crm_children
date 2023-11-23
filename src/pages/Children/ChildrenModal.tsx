import React from "react"
import { Modal, Form, Input, Button, Row, Flex, Card } from "antd";
import ChildrenForm from "./ChildrenForm";
import {PlusOutlined} from "@ant-design/icons";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
const ChildrenModal = ({
  title,
  isModalVisible,
  onCancel,
  onFinish,
  form,
  childrenForms,
  showChildForm,
  closeChildForm,
  initialValues,
  updateModal,
}) => {
  const [mainFormValid, setMainFormValid] = useState(false);

  const updateFormFiller = () => {
    const [phone_number, phone_number_optional] = (
      initialValues?.phone_number || []
    )
      .map((number) => number.trim())
      .join(",")
      .split(",");
    form.setFieldsValue({
      last_name: initialValues?.last_name,
      first_name: initialValues?.first_name,
      phone_number: phone_number,
      phone_number_optional: phone_number_optional,
    });

    initialValues?.children?.forEach((child, index) => {
      const genderValue =
        child.gender === 1 ? "Male" : child.gender === 2 ? "Female" : undefined;
      const date = child?.birth_of_date;
      form.setFieldsValue({
        [`child_first_name_${index}`]: child.first_name,
        [`child_last_name_${index}`]: child.last_name,
        [`parent_full_name_${index}`]: child.parent,
        [`child_birth_date_child_${index}`]: date ? dayjs(date) : null,
        [`child_gender_child_${index}`]: genderValue,
      });
    });
  };

  useEffect(() => {
    handleMainFormChange();

    if (updateModal) {
      updateFormFiller();
    } else {
      form.resetFields();
    }
  }, [isModalVisible, initialValues, updateModal]);

  const handleMainFormChange = () => {
    const isValid =
      form.getFieldValue("last_name") &&
      form.getFieldValue("first_name") &&
      form.getFieldValue("phone_number");

    setMainFormValid(isValid);
  };

  return (
    <Modal
      title={title}
      open={isModalVisible}
      onCancel={onCancel}
      className="customer_children_modal"
      destroyOnClose
      footer={
        <Flex justify="end">
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            id="all_submit"
            disabled={childrenForms?.length === 0}
            onClick={() => form.submit()}
          >
            Submit
          </Button>
        </Flex>
      }
    >
      <Row style={{ width: "100%" }}>
        <Form
          name="create_customer_form"
          onFinish={onFinish}
          style={{ padding: 10 }}
          layout="vertical"
          form={form}
          onValuesChange={handleMainFormChange}
        >
          <Flex justify="space-between" >
            <div style={{width:240}}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[
                  { required: true, message: "Please input the last name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[
                  { required: true, message: "Please input the first name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone_number"
                label="Number 1"
                rules={[
                  { required: true, message: "Please input the number!" },
                  {
                    min: 9,
                    max: 11,
                    message: "Number length must be 9 or 11!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone_number_optional"
                label="Number 2 (Optional)"
                rules={[
                  {
                    min: 9,
                    max: 11,
                    message: "Number length must be 9 or 11!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="child_form_col">
              {childrenForms.map((childForm, key) => (
                <ChildrenForm
                  key={key}
                  index={key}
                  closeChildForm={closeChildForm}
                />
              ))}
              <Card id="add_card" style={{padding:0 }}>

              <Button id="add_child_btn" onClick={showChildForm} disabled={!mainFormValid}>
           <PlusOutlined/>
          </Button>
              </Card>
            </div>
            
          </Flex>
        </Form>
        
      </Row>
    </Modal>
  );
};

export default ChildrenModal;
