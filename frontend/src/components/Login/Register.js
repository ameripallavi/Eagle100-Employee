import React, { useState, useRef, useContext } from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
import authContext from "../Contexts/Auth/authContext";
import { useMsgContext } from "../Contexts/MesgContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import axios from "axios";
import jwtDecode from "jwt-decode";
import Password from "antd/es/input/Password";
const { Option } = Select;

const Register = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const allowMail = ["ameri100.com"];
  const [otpInputMsgType, setOtpInputMsgType] = useState("");
  const [createUser, setCreateUser] = useState("");
  const [otpInputMsg, setOtpInputMsg] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [otpInput, setOtpInput] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(false);
  const otpRef = useRef(null);
  const loginFormRef = useRef(null);
  const history = useNavigate();
  const [form] = Form.useForm();
  const { message } = useMsgContext();
  const auth = useContext(authContext);
  const loginUrl = "/login";

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    handleCreateUser(values)
    if (!emailValidation(values.email)) {
      loginFormRef.current.setFields([
        {
          name: "email",
          errors: [
            "Unauthorised E-Mail ID! Please use Ameri100 e-mail to login.",
          ],
        },
      ]);

      return;
    }
    
    // if (!otpInput) {
      
    //   handleSendOtp(values);
    // } else {
    //   handleOtpVerification(values);
    // }
  };
  async function handleCreateUser(formData) {
    setLoginError("");
    setLoginLoading(true);
    const data = JSON.stringify({
      emp_email: formData.email,
      emp_first_name: formData.emp_first_name,
      emp_last_name: formData.emp_last_name,
      password: formData.password
    });
    console.log("data",data)
    const options = {
      method: 'POST',
      url: "/api/auth/create_user",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    await axios
      .request(options)
      .then(function(response){
        sessionStorage.setItem("User_Token", response.data.accessToken);
        auth.updateUserToken();
        const userInfo = jwtDecode(response.data.accessToken);
        message.success(`Hello ${userInfo.first_name} welocome to eagle100 portal`);
        history("/");
      })
      .catch(function(error){
        message.error("login error",error)
        console.log(error);
      });
      setLoading(false);
  }
  async function handleSendOtp(formData) {
    setLoginError("");
    setLoginLoading(true);
    const data = JSON.stringify({ emp_email: formData.email });
    console.log(data);
    const options = {
      method: "POST",
      url: "/api/auth/send_otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(options)
      .then(function () {
        message.success("OTP Sent to Email Address");
        setUserEmail(formData.email);
        setOtpInput(true);
        setOtpInputMsgType("success");
      })
      .catch(function (error) {
        //message.error(error);
        if (error.response.data === "Email is not registered") {
          setUserEmail(formData.email);

          setOtpInputMsgType("danger");
          setOtpInputMsg(
            "Email is not registerd. Please enter valid email address."
          );
        }
      });
    setLoginLoading(false);
    otpInput &&
      setTimeout(function () {
        otpRef.current.focus();
      }, 4000);
  }

  async function handleOtpVerification(otpData) {
    setLoginLoading(true);
    const data = JSON.stringify({
      emp_email: otpData.email,
      otp: otpData.otp,
    });
    const options = {
      method: "POST",
      url: "/api/auth/verify_otp",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(options)
      .then(function (response) {
        sessionStorage.setItem("User_Token", response.data.accessToken);
        const userInfo = jwtDecode(response.data.accessToken);
        auth.updateUserToken();
        setLoginError("");
        setOtpInput(false);
        setCreateUser("verifieduser");
        history("/consultant");
        console.log("page is navigated");
        message.success(
          `Hello ${userInfo.first_name}! Welcome to Eagle100 Portal`
        );
        setVerifiedUser(true)
      })
      .catch(function (error) {
        if (error.response.status === 500) {
          setLoginError(
            "Entered OTP is either incorrect or expired. Please try again."
          );
        } else {
          setLoginError("Something went wrong. Please try again.");
        }
        form.setFieldsValue({ otp: "" });
        /* setTimeout(function () {
        setOtpInput(false);
      }, 5000) */
      });
    setLoginLoading(false);
  }

  const emailValidation = (value) => {
    let valSplit = value.split("@")[1];
    return allowMail.includes(valSplit);
  };

  return (
    <div>
      {otpInput ? (
        loginError === "" ? (
          <div>
            An OTP has been sent to <strong>{userEmail}</strong>.please enter
            the otp.
          </div>
        ) : (
          { loginError }
        )
      ) : (
        otpInputMsgType === "danger" && <div>{otpInputMsg} </div>
      )}
      <div className="container login">
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <div className="text-center">
              <h3>Register</h3>
              <p className="small text-muted font-italic mb-4">
                Please enter your Ameri100 e-mail id
              </p>
            </div>
          </div>
          <div className="col-md-6 col-md-offset-6 border">
            <Form
              form={form}
              className="login-form"
              name="register"
              onFinish={onFinish}
              ref={loginFormRef}
              scrollToFirstError
            >
              <Form.Item
                name="email"
                label="E-mail"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please input your E-mail!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item 
                  name="emp_first_name"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your First name',
                    },
                  ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item 
                  name="emp_last_name"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Last name',
                    },
                  ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                    </Form.Item>
              {otpInputMsgType == "success" && (
                <Form.Item
                  className="mt-3"
                  name="otp"
                  defaultValue={""}
                  rules={[
                    {
                      required: true,
                      message: "Please enter OTP",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<AiOutlineLock size={24} className="me-3" />}
                    ref={otpRef}
                    placeholder="Enter OTP here"
                    autoComplete="new-password"
                  />
                </Form.Item>
                
              )}
              {createUser === "verifieduser" && (
                <div>
                  <Form.Item 
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your First name',
                    },
                  ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item 
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Last name',
                    },
                  ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your password!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </div>
              )}
              <Form.Item>
                <Button type="primary" loading={loginLoading} htmlType="submit">
                  Register
                  {/* {!otpInput ? "Send OTP" : verifiedUser ? "Login" :"Verify OTP"} */}
                </Button>
                Already had Account <Link to={loginUrl}>Login</Link> here
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
