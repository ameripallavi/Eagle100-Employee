import React, { useContext, useRef, useState } from 'react'
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineMail } from 'react-icons/ai'
import authContext from "../Contexts/Auth/authContext";

function ForgotPasswordForm() {
    const { forgotPassword } = useContext(authContext);
    const [loading, setLoading] = useState(false);
    const emailRef = useRef(null);
    const history = useNavigate();
   // const { message } = useMsgContext();

    const onFinish = async (values) => {
        console.log(values)
    };

    return (
        <>
            
            <div className="container login">
      <div className="row">
            <div className="col-md-4 col-md-offset-4">
            <div className='text-center'>
                <h3>Forgot Password</h3>
                <p className="small text-muted font-italic mb-4">Please enter your e-mail id</p>
            </div>
            </div>
            <div className="col-md-6 col-md-offset-6 border">
            <Form
                name="forgot_password"
                initialValues={{remember: false}}
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    label="E-Mail" 
                    name="email"
                    defaultValue={""}
                    rules={[{ required: true, message: 'Please input your E-Mail!' }]}
                >
                    <Input                        
                        prefix={<AiOutlineMail size={15} className="site-form-item-icon" />} 
                        ref={emailRef}
                        placeholder="E-Mail" 
                    />
                </Form.Item>

                
                <Button type="primary" loading={loading} htmlType="submit" size="large">Reset Password</Button>
                
                <p className='mt-4 mb-0 text-center'>Return to <Link to="/">Login</Link></p>
                
            </Form>
            </div>
            </div>
            </div>

        </>
    )
}

export default ForgotPasswordForm