import { useState } from "react";
import { Button, Form, Input, message } from "antd";
import { AiOutlineUser, AiOutlineLock } from "react-icons/ai";
import { LoginType } from "../../types/auth/authTypes";
import { login } from "../../api/auth/loginAuth";
import { validateEmail } from "../../utils/helper/validator";
import "../auth/auth.scss";
import { Logo } from "../../components/common/logos";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/user/userDataReducer";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginType) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        dispatch(setUserData(result?.data?.user));
        setLoading(false);
        navigate("/");
      } else {
        setLoading(false);
        message.error(result.error);
      }
    } catch (error) {
      console.error("Error login:", error);
    }
  };

  return (
    <div className="login_page">
      <div className="form_container">
        <div className="logo">
          <Logo />
        </div>
        <Form onFinish={handleLogin} className="form">
          <Form.Item
            name="email"
            className="formItem"
            rules={[
              { required: true, message: "" },
              { validator: validateEmail },
            ]}
          >
            <Input
              placeholder="E-mail"
              className="loginInp"
              prefix={<AiOutlineUser />}
            />
          </Form.Item>
          <Form.Item name="password" className="formItem">
            <Input
              placeholder="Password"
              className="loginInp"
              type="password"
              prefix={<AiOutlineLock />}
            />
          </Form.Item>
          <Form.Item className="formItem">
            <Button loading={loading} htmlType="submit" className="submitBtn">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
