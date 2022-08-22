import { useEffect, useState } from "react";
import { Button, Form, Input, message, Modal } from "antd";
import { signInWithEmailAndPassword } from "firebase/auth";
import auth, { db } from "../../firebase";

function Login(props) {
  // modal
  const [isModalVisible, setIsModalVisible] = useState(true);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    props.setShowLogin(false);
  };
  // notification
  const key = "updatable";
  const openMessage = () => {
    message.loading({ content: "Loading...", key });
    setTimeout(() => {
      message.error({
        content: "Incorrect login account!",
        key,
        duration: 2,
      });
    }, 1000);
  };
  // Form Login
  const onFinish = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then(() => {
        setIsModalVisible(false);
        const userTest = auth.currentUser;
        console.log(userTest);
      })
      .catch(() => {
        openMessage();
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <Modal
        title="Login"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[]}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default Login;
