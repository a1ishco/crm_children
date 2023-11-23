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
      <Form.Item
        name={`child_first_name_${index}`}
        label="Child First Name"
        rules={[
          {
            required: true,
            message: "Please input the child's first name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={`child_last_name_${index}`}
        label="Child Last Name"
        rules={[
          {
            required: true,
            message: "Please input the child's last name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Flex align="end">
        <Form.Item
          name={`parent_full_name_${index}`}
          label="Parent`s full name"
          rules={[
            {
              required: true,
              message: "Please input the parent's full name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={`child_birth_date_child_${index}`}
          label="Child Birth Date"
          rules={[
            {
              required: true,
              message: "Please input the child's birth date!",
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
              message: "Please select the child's gender!",
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
