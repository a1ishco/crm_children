import React from "react"
import { Card, Button, Form, Input, DatePicker, Select, Flex } from "antd";
import { CloseOutlined } from "@ant-design/icons";

const { Option } = Select;

const ChildrenForm = ({ index, closeChildForm }) => {
  return (
    <Card>
      <div className="button">
        <Button id="card_close_button" onClick={() => closeChildForm(index)}>
          <CloseOutlined />
        </Button>
      </div>
      <Flex justify="space-between" className="children_form">
      <Form.Item
        name={`child_first_name_${index}`}
        label="Child First Name"
        rules={[
          {
            required: true,
            message: "Fill the field!",
          },
        ]}
      >
        <Input width={"100%"}/>
      </Form.Item>
      <Form.Item
        name={`child_last_name_${index}`}
        label="Child Last Name"
        rules={[
          {
            required: true,
            message: "Fill the field!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      </Flex>
        <Form.Item
          name={`parent_full_name_${index}`}
          label="Parent`s full name"
          rules={[
            {
              required: true,
              message: "Fill the field!",
            },
          ]}
        >
        <Input width={"100%"}/>
        </Form.Item>
        <Flex justify="space-between" className="children_form">
        <Form.Item
          name={`child_birth_date_child_${index}`}
          label="Child Birth Date"
          rules={[
            {
              required: true,
              message: "Fill the field!",
            },
          ]}
        >
          <DatePicker picker="date" format="DD-MM-YYYY" />
        </Form.Item>
        <Form.Item
          name={`child_gender_child_${index}`}
          label="Child Gender"
          rules={[
            {
              required: true,
              message: "Fill the field!",
            },
          ]}
        >
          <Select>
            <Option value="1">Male</Option>
            <Option value="2">Female</Option>
          </Select>
        </Form.Item>
      </Flex>
    </Card>
  );
};

export default ChildrenForm;
