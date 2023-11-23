
import React, { useEffect} from "react";
import { Menu, Layout, Button, Avatar} from "antd";
import { HomeFilled, UserOutlined, ProfileOutlined , LogoutOutlined } from "@ant-design/icons";
import "./layout.scss";
import { Logo } from "../components/common/logos/Logo";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/user/userDataReducer";
import { me } from "../api/auth/loginAuth";

const { Sider, Content } = Layout;

const Layouts: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
  const userDatas = useSelector((state: object ) => state.userData);

  const handleLogout = () => {
    Cookies.remove("user_token");
    navigate("/login");
  };

  const handleMy = async () => {
    const token = Cookies.get("user_token");
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
      <Sider
        className="antSider"
        theme="dark"
      >
        
        <div id="logo"><Logo/>
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
        <div
          className="header_right"
          style={{ width: '200px' }}
        >
            <>
              <div className="user_settings">
                {userDatas.profileImage ? (
                  <img src={userDatas.profileImage} alt="USER" id="user_profile_image" />
                ) : (
                  <Avatar icon={<UserOutlined />} />
                )}
                <span>{userDatas.first_name+" "+userDatas.last_name}</span>
              </div>
              <Button id="logout_btn" onClick={handleLogout}>
                <LogoutOutlined/> Logout
              </Button>
            </>
          
        </div>
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
  { key: "/", icon: <HomeFilled />, text: "Dashboard", to: "/" },
  {
    key: "/customers",
    icon: <ProfileOutlined />,
    text: "Children",
    to: "/customers",
  },
  {
    key: "/manual-feedback",
    icon: <HomeFilled />,
    text: "Manual feedback",
    to: "/manual-feedback",
  },
];
