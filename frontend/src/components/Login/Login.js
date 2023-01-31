import React, { useState, useRef, useContext } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import { json, Link, useNavigate} from "react-router-dom";
import authContext from "../Contexts/Auth/authContext";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { useMsgContext } from "../Contexts/MesgContext";

const Login = () => {
 
  const [loading, setLoading] = useState(false);
  const registerUrl ='/register'
  const auth = useContext(authContext);
  const navigate = useNavigate();
  const { message } = useMsgContext()

  const onFinish = async(values) => {
    console.log("Received values of form: ", values);
    handleUserLogin(values)

    async function handleUserLogin(values){
      setLoading(false);

      const data = JSON.stringify({
        emp_email: values.username,
        password: values.password
      });
      const options = {
        method: 'POST',
        url: "/api/auth/login",
        headers:{
          "Content-Type":"application/json"
        },
        data:data
      };

      await axios
      .request(options)
      .then(function(response){
        sessionStorage.setItem("User_Token", response.data.accessToken);
        auth.updateUserToken();
        const userInfo = jwtDecode(response.data.accessToken);
        message.success(`Hello ${userInfo.first_name} welocome to eagle100 portal`);
        //navigate("/consultant");
      })
      .catch(function(error){
        message.error("login error",error)
        console.log(error);
      });
      setLoading(false);
      }
  }

  return (
    <div>
      <div className="container login">
        <div className="row">
          <div className="col">
          <div className='text-center'>
                <h3>Welcome To Eagle100  </h3>
                <p className="small text-muted font-italic mb-4">Employee Login Portal</p>
            </div>
            </div>
          <div className="col border">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
            >
              <div>
                <h5 className="login-header">
                  Login here for Eagle100 portal{" "}
                </h5>
              </div>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item> */}

                {/* <a className="login-form-forgot" href="">
                  Forgot password
                </a> */}
                <Link to='/change-password'>Forgot password</Link> 
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="login-form-button"
                >
                  Log in
                </Button>
                Or <Link to={registerUrl}>Register now!</Link> 
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
