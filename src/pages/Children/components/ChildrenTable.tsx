// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Button, Flex, Modal, Spin, Table, message } from "antd";
import { useEffect, useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { childrenDelete, childrenGet } from "../../../api/children/children";
import { useDispatch } from "react-redux";
import { setCustomerChildData } from "../../../redux/customer/customerChildReducer";
import PaymentModal from "../components/PaymentModal";
const ChildrenTable = ({ onUpdate, search, onCreate }) => {
  const dispatch = useDispatch();
  const [dataSource, setDataSource] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 7,
    total: dataSource ? dataSource?.length : 0,
  });

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Customer Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Phone Number",
      dataIndex: "phone_number",
      key: "phone_number",
      render: (text) => {
        return text ? text.join(", ") : "";
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Flex className="table_buttons">
          <Button
            type="primary"
            onClick={(e) => handleUpdate(record, e)}
            id="edit_btn"
          >
            <EditOutlined />
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => showDeleteConfirmation(record)}
            id="delete_btn"
          >
            <DeleteOutlined />
          </Button>
          <Button
            type="primary"
            id="payment_btn"
            onClick={(e) => handlePayment(record, e)}
          >
            <DollarOutlined />
          </Button>
        </Flex>
      ),
    },
  ];
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
    });
    fetchData(search, {
      page: pagination.current ? pagination.current : 1,
      pageSize: pagination.pageSize,
    });
  };
  const handleUpdate = (record) => {
    onUpdate(filteredData.find((item) => item.id === record.id));
  };

  const handlePayment = async (record) => {
    setPaymentRecord(filteredData.find((item) => item.id === record.id));
    setIsPaymentModalVisible(true);
  };

  const showDeleteConfirmation = (record) => {
    setDeleteRecord(record);
    setDeleteConfirmationVisible(true);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationVisible(false);
  };

  const handleDeleteConfirmation = async () => {
    const id = deleteRecord?.id;
    setDeleteLoading(true);
    try {
      const result = await childrenDelete("", id);

      if (result.success || result) {
        message.success("DELETED");
        setDeleteLoading(false);
        fetchData(search, {
          page: pagination.current ? pagination.current : 1,
          pageSize: pagination.pageSize,
        });
        setDeleteConfirmationVisible(false);
      } else {
        message.error("ERROR OCCURRED");
        setDeleteLoading(false);
      }
    } catch (error) {
      setDeleteLoading(false);
      console.error("An error occurred:", error);
      message.error("ERROR OCCURRED");
    }
  };

  const fetchData = async (search, pagination) => {
    try {
      setLoading(true)
      const result = await childrenGet("", search, pagination);
      dispatch(setCustomerChildData(result.data));
      if (result.success) {
        const updatedDataSource = result?.data?.results.map((item) => ({
          ...item,
        }));

        setDataSource(updatedDataSource);
        setPagination({
          ...pagination,
          total: result.data.count,
        });
      } else {
        console.log("ERROR!!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(search, {
      page: pagination.current ? pagination.current : 1,
      pageSize: pagination.pageSize,
    });
  }, [search, onUpdate, onCreate]);

  const filteredData = dataSource?.filter((item) =>
    columns.some((column) => {
      const dataIndex = column.dataIndex;
      const cellValue = item[dataIndex];

      return cellValue;
    })
  );
  const filteredDataWithoutChildren = filteredData?.map(
    ({ children, ...rest }) => {
      console.log(children);
      console.clear();
      return rest;
    }
  );

  return (
    <div className="table_container">
      <Spin spinning={!dataSource || loading}>
        <Table
          dataSource={filteredDataWithoutChildren}
          columns={columns}
          pagination={pagination}
          onChange={handleTableChange}
          handleUpdate={handleUpdate}
        />
      </Spin>

      <PaymentModal
        visible={isPaymentModalVisible}
        onCancel={() => setIsPaymentModalVisible(false)}
        record={paymentRecord}
        fetchData={fetchData}
      />

      <Modal
        title="Delete confirmation"
        open={deleteConfirmationVisible}
        onOk={handleDeleteConfirmation}
        onCancel={handleCancelDelete}
        okText="Delete"
        cancelText="Cancel"
        footer={
          <Flex justify="end">
            <Button key="cancel" onClick={handleCancelDelete} id="cancel_btn">
              Cancel
            </Button>
            <Button
              key="delete"
              type="danger"
              onClick={handleDeleteConfirmation}
              id="delete_btn_modal"
              loading={deleteLoading}
            >
              Delete
            </Button>
          </Flex>
        }
      >
        {deleteRecord &&  (
          <>
            <b style={{ textAlign: "center" }}>
              Are you sure to delete customer datas?
            </b>
            <p>First name: {deleteRecord?.first_name}</p>
            <p>Last name: {deleteRecord?.last_name}</p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ChildrenTable;
