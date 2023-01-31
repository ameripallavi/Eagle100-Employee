import React from "react";

function ResetPassword(){
    return(
        <div className="container login">
        <div className="row">
              <div className="col-md-4 col-md-offset-4">
              <div className='text-center'>
                  <h3>Reset Password</h3>
                  <p className="small text-muted font-italic mb-4">Please enter your new password</p>
              </div>
              </div>
              <div className="col-md-6 col-md-offset-6 border">
              <Form
                name="reset_password"
                initialValues={{remember: false}}
                layout="vertical"
                onFinish={onFinish}
            >
        <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      </Form>
      </div>
      </div>
      </div>
    )
}