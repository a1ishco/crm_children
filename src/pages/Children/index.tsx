// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react";
import { useState } from "react";
import { Form, message, Button, Input } from "antd";
import { useDispatch } from "react-redux";
import ChildrenTable from "./components/ChildrenTable";
import ChildrenModal from "./components/ChildrenModal";
import { setCustomerChildData } from "../../redux/customer/customerChildReducer";
import _ from "lodash";
import {
  childrenCreateSubmit,
  childrenGet,
  childrenRetriew,
  childrenUpdate,
} from "../../api/children/children";
import "./children.scss";
import { UserAddOutlined } from "@ant-design/icons";
import PageHeader from "../../components/common/header";

const Children = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [childrenForms, setChildrenForms] = useState<{ key: number }[]>([]);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateModalInitialValues, setUpdateModalInitialValues] =
    useState(null);
  const [updatedChildDatas, setUpdatedChildDatas] = useState(null);
  const [deletedChildForms, setDeletedChildForms] = useState([]);
  const showCreateModal = () => {
    setIsCreateModalVisible(true);
    form.resetFields();
  };

  const handleUpdate = async (record) => {
    try {
      const result = await childrenRetriew(record?.id);
      const datas = result?.data;
      setUpdatedChildDatas(datas?.children);
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

  const closeChildForm = (key) => {
    form.resetFields(Object.values(getChildFormFields(key)));
  
    const updatedForms = childrenForms.filter((form) => form.key !== key);
      const deletedForm = childrenForms.find((form) => form.key === key);
    if (deletedForm && updatedChildDatas[deletedForm.key]?.id) {
      setDeletedChildForms([...deletedChildForms, updatedChildDatas[deletedForm.key].id]);
    }
  
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
    setLoading(true);
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
        setLoading(false);
      } else {
        message.error("ERROR OCCURRED");
        setIsCreateModalVisible(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onFinishUpdate = async (values) => {
    setLoading(true);

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

      const childFormValues = childrenForms.map((childForm, key) => {
        const childValues = form.getFieldsValue(
          Object.values(getChildFormFields(key))
        );

        return {
          id: updatedChildDatas[key]?.id,
          first_name: childValues[`child_first_name_${key}`],
          last_name: childValues[`child_last_name_${key}`],
          parent: childValues[`parent_full_name_${key}`],
          birth_of_date: new Date(childValues[`child_birth_date_child_${key}`])
            .toISOString()
            .split("T")[0],
          gender: childValues[`child_gender_child_${key}`] === "Male" ? 1 : 2,
        };
      });

      // Include deleted child IDs in the update request
      const allValuesObject = {
        last_name: customerValues.last_name,
        first_name: customerValues.first_name,
        phone_number: [customerValues.phone_number.join(", ")],
        children: childFormValues,
        deleted_children: deletedChildForms,
      };

      const result = await childrenUpdate(
        allValuesObject,
        updateModalInitialValues?.id
      );
      console.log("allValuesObject", allValuesObject);
      console.log("childFormValues", childFormValues);
      dispatch(setCustomerChildData(allValuesObject));

      if (result.success) {
        message.success("UPDATED");
        setIsUpdateModalVisible(false);
        setChildrenForms([]);
        setDeletedChildForms([]); // Clear deleted child forms after successful update
        setLoading(false);
      } else {
        message.error("ERROR OCCURRED");
        setIsUpdateModalVisible(true);
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
  const handleSearchChange = _.debounce((value) => {
    setSearchText(value);
    fetchData(value);
  }, 500);
  return (
    <>
      <PageHeader
        title="Children"
        subtitle="You can add children here"
        extras={
          <>
            <Input
              placeholder="Search"
              onChange={(e) => handleSearchChange(e.target.value)}
              id="search_input_table"
            />
            <Button id="create_customer" onClick={showCreateModal}>
              <>
                <UserAddOutlined />
                {/* Create customer */}
              </>
            </Button>
          </>
        }
      />
      <ChildrenTable
        onUpdate={handleUpdate}
        search={searchText}
        onCreate={onFinishCreate}
      />
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
        loading={loading}
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
        loading={loading}
      />
    </>
  );
};

export default Children;

// UPDATE *****
