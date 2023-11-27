import React, { useEffect, useState } from "react";
import { Menu, Layout, Button, Avatar, Flex, Divider } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./layout.scss";
import { Logo } from "../components/common/logos";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/user/userDataReducer";
import { logout, me } from "../api/auth/loginAuth";

const { Sider, Content } = Layout;

const Layouts: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const userDatas = useSelector((state: object) => state.userData);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("user_token");

  const handleLogout = async () => {
    setLoading(true);
    try {
      const result = await logout(token);
      if (result.success) {
        setLoading(false);
        navigate("/login");
        Cookies.remove("user_token");
      } else {
        navigate("/login");

        console.error(result.error);
      }
    } catch (error) {
      console.error("Error login:", error);
    }
  };

  const handleMy = async () => {
    if (token) {
      try {
        const result = await me(token);
        if (result.success) {
          dispatch(setUserData(result.data));
        } else {
          console.error(result.error);
        }
      } catch (error) {
        console.error("Error login:", error);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    handleMy();
  }, []);
  return (
    <Layout className="layout_all">
      <Sider className="antSider" theme="dark">
        <Flex vertical justify="space-between" className="flex_sider_content">
          <div className="sider_flex">
            <div id="logo">
              <Logo />
            </div>
            <Menu
              className="antMenu"
              theme="dark"
              mode="inline"
              selectedKeys={[location.pathname]}
              items={menuItems.map((item) => ({
                key: item.key,
                icon: item.icon,
                onClick: () => navigate(item.to),
                label: item.text,
              }))}
            />
          </div>
          <div className="header_right">
          <>
          <Divider/>
            <div className="user_settings">
              {userDatas.profileImage ? (
                <img
                  src={userDatas.profileImage}
                  alt="USER"
                  id="user_profile_image"
                />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
              <span>{userDatas.first_name + " " + userDatas.last_name}</span>
            </div>
          <Divider/>
            <Button id="logout_btn" onClick={handleLogout} loading={loading}>
              {loading ? null : <LogoutOutlined />}
              Logout
            </Button>
          </>
        </div>
        </Flex>

        
      </Sider>
      <Layout className="layout_header">
        <Content className="layout_content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Layouts;
const menuItems = [
  {
    key: "/",
    icon: <ProfileOutlined />,
    text: "Children",
    to: "/",
  },
];
