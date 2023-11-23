// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react"
import { useState } from "react";
import { Form, message, Flex, Button, Input } from "antd";
import { useDispatch } from "react-redux";
import ChildrenTable from "./ChildrenTable";
import ChildrenModal from "./ChildrenModal";
import { setCustomerChildData } from "../../redux/customer/customerChildReducer";
import {
  childrenCreateSubmit,
  childrenGet,
  childrenRetriew,
  childrenUpdate,
} from "../../api/children/children";
import "./children.scss";
import { UserAddOutlined } from "@ant-design/icons";

const Children = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [childrenForms, setChildrenForms] = useState<{ key: number }[]>([]);
  const [searchText, setSearchText] = useState("");
  const [updateModalInitialValues, setUpdateModalInitialValues] =
    useState(null);
    const [updatedChildDatas, setUpdatedChildDatas] =
    useState(null);
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    form.resetFields();
  };

  const handleUpdate = async (record) => {
    try {
      const result = await childrenRetriew(record?.id);
      const datas = result?.data;
      setUpdatedChildDatas(datas?.children)      
      form.setFieldsValue({
        last_name: datas.last_name,
        first_name: datas.first_name,
        phone_number: datas.phone_number[0],
        phone_number_optional: datas.phone_number[1] || "",
      });

      setChildrenForms(
        [...Array(datas?.children?.length).keys()].map((index) => ({
          key: index,
        }))
      );

      record?.children?.forEach((child, index) => {
        form.setFieldsValue({
          [`child_first_name_${index}`]: child.first_name,
          [`child_last_name_${index}`]: child.last_name,
          [`parent_full_name_${index}`]: child.full_name,
          [`child_birth_date_child_${index}`]: child.birth_date_child,
          [`child_gender_child_${index}`]: child.gender,
        });
      });

      setUpdateModalInitialValues(record);
      setIsUpdateModalVisible(true);
    } catch (error) {
      console.error("Error retrieving children:", error);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    form.resetFields();
    setChildrenForms([]);
  };

  const handleUpdateCancel = () => {
    setIsUpdateModalVisible(false);
    setChildrenForms([]);
    setUpdateModalInitialValues(null);
    form.resetFields();
  };

  const showChildForm = () => {
    setChildrenForms([...childrenForms, { key: childrenForms.length }]);
  };

  const closeChildForm = (index) => {
    form.resetFields(Object.values(getChildFormFields(index)));
    const updatedForms = [...childrenForms];
    updatedForms.splice(index, 1);
    setChildrenForms(updatedForms);
  };

  const getChildFormFields = (key) => {
    return {
      childFirstName: `child_first_name_${key}`,
      childLastName: `child_last_name_${key}`,
      parentFullName: `parent_full_name_${key}`,
      childBirthDate: `child_birth_date_child_${key}`,
      childGender: `child_gender_child_${key}`,
    };
  };

  const onFinishCreate = async (values) => {
    try {
      const customerValues = {
        last_name: values.last_name,
        first_name: values.first_name,
        phone_number: [
          values.phone_number,
          values.phone_number_optional,
        ].filter(Boolean),
      };

      const childFormValues = childrenForms.map((childForm, key) => {
        const childValues = form.getFieldsValue(
          Object.values(getChildFormFields(key))
        );
        return {
          first_name: childValues[`child_first_name_${key}`],
          last_name: childValues[`child_last_name_${key}`],
          parent: childValues[`parent_full_name_${key}`],
          birth_of_date: new Date(childValues[`child_birth_date_child_${key}`])
            .toISOString()
            .split("T")[0],
          gender: childValues[`child_gender_child_${key}`],
        };
      });

      const allValuesObject = {
        last_name: customerValues.last_name,
        first_name: customerValues.first_name,
        phone_number: [customerValues.phone_number.join(", ")],
        children: childFormValues,
      };

      const result = await childrenCreateSubmit("", allValuesObject);
      dispatch(setCustomerChildData(allValuesObject));

      if (result.success) {
        message.success("SUBMITTED");
        setIsCreateModalVisible(false);
        setChildrenForms([]);
      } else {
        message.error("ERROR OCCURRED");
        setIsCreateModalVisible(false);
      }
    
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishUpdate = async (values) => {
    console.log("updateModalInitialValues", updateModalInitialValues.children);
    console.log("updatedChildDatas", updatedChildDatas);
  
    try {
      const customerValues = {
        id: updateModalInitialValues?.id,
        last_name: values.last_name,
        first_name: values.first_name,
        phone_number: [
          values.phone_number,
          values.phone_number_optional,
        ].filter(Boolean),
      };
  
      const childFormValues = updatedChildDatas.map((updatedChild, key) => {
        const childValues = form.getFieldsValue(
          Object.values(getChildFormFields(key))
        );
  
        const hasChildChanged =
          updatedChild &&
          (childValues[`child_first_name_${key}`] !==
            updatedChild.first_name ||
            childValues[`child_last_name_${key}`] !== updatedChild.last_name ||
            new Date(childValues[`child_birth_date_child_${key}`])
              .toISOString()
              .split("T")[0] !== updatedChild.birth_of_date ||
            (childValues[`child_gender_child_${key}`] === "Male"
              ? 1
              : 2) !== updatedChild.gender);
  
        return hasChildChanged
          ? {
              id: updatedChild.id,
              first_name: childValues[`child_first_name_${key}`],
              last_name: childValues[`child_last_name_${key}`],
              parent: childValues[`parent_full_name_${key}`],
              birth_of_date: new Date(
                childValues[`child_birth_date_child_${key}`]
              )
                .toISOString()
                .split("T")[0],
              gender:
                childValues[`child_gender_child_${key}`] === "Male" ? 1 : 2,
            }
          : null;
      });
  
      const changedChildFormValues = childFormValues.filter(
        (childValue) => childValue !== null
      );
  
      const allValues = {
        ...customerValues,
        children: changedChildFormValues,
      };
  
      const result = await childrenUpdate(
        allValues,
        updateModalInitialValues?.id
      );
      if (result.success) {
        message.success("UPDATED");
        // setIsUpdateModalVisible(false);
      } else {
        message.error("ERROR OCCURRED");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  const fetchData = async (searchParam) => {
    try {
      const result = await childrenGet("", searchParam ? searchParam : "");
      dispatch(setCustomerChildData(result.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };



  return (
    <>
      <Flex className="page_header_flex_main" justify="space-between">
        <div className="page_header_text">
          <h2>Children</h2>
          <p>You can add children here</p>
        </div>
        <div className="page_header_button">
          <Input
            placeholder="Search"
            onChange={(e) => {
              const searchText = e.target.value;
              setSearchText(searchText);
              fetchData(searchText);
            }}
            id="search_input_table"
          />
          <Button id="create_customer" onClick={showCreateModal}>
            <>
              <UserAddOutlined />
              {/* Create customer */}
            </>
          </Button>
        </div>
      </Flex>
      <ChildrenTable onUpdate={handleUpdate} search={searchText} onCreate={onFinishCreate}/>
      <ChildrenModal
        title={"Create Customer"}
        isModalVisible={isCreateModalVisible}
        onCancel={handleCreateCancel}
        onFinish={onFinishCreate}
        form={form}
        childrenForms={childrenForms}
        showChildForm={showChildForm}
        closeChildForm={closeChildForm}
        initialValues={null}
        updateModal={false}
      />
      <ChildrenModal
        title={"Update Customer"}
        isModalVisible={isUpdateModalVisible}
        onCancel={handleUpdateCancel}
        onFinish={onFinishUpdate}
        form={form}
        childrenForms={childrenForms}
        showChildForm={showChildForm}
        closeChildForm={closeChildForm}
        initialValues={updateModalInitialValues}
        updateModal={true}
      />
    </>
  );
};

export default Children;

// UPDATE *****
