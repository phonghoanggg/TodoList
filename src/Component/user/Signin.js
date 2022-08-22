import { Button, Form, Input, message, Modal } from "antd";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import auth, { db } from "../../firebase";

function Signin(props) {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const key = "updatable";
  const openMessage = () => {
    message.loading({ content: "Loading...", key });
    setTimeout(() => {
      message.success({
        content: "You have successfully registered!",
        key,
        duration: 2,
      });
    }, 1000);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    props.setRegister(false);
  };

  const onFinish = (values) => {
    console.log(values);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          console.log(user);
          addDoc(collection(db, "user_users"), {
            email: user.email,
            uid: user.uid,
            displayname: values.username,
          }).then(() => {
            console.log("đăng ký thành công");
          });
          props.setRegister(false);
          props.setShowLogin(true);
          openMessage();
        }
      })
      .catch((error) => {
        console.log(error);
        alert("Account already exists!");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <>
        <Modal
          title="Register"
          visible={isModalVisible}
          onOk={handleOk}
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
              label="Username"
              name="username"
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
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
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
                Register
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    </>
  );
}

export default Signin;
