import { Button, Modal, Checkbox, Form, Input } from "antd";
import { updateEmail } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import auth, { db } from "../../firebase";
function ChangeInfo(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newUser, setNewUser] = useState([]);

  useEffect(() => {
    const refPerson = collection(db, "user_users");
    const q = query(refPerson);
    const unSub = onSnapshot(q, (snapshot) => {
      const pes = snapshot.docs.map((u) => ({ ...u.data(), id: u.id }));
      setNewUser(pes);
    });
    return () => unSub();
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = () => {
    updateEmail(auth.currentUser, newEmail)
      .then(() => {
        newUser.map(async (e) => {
          if (e.uid === props.id) {
            console.log(e.id);
            const IdRef = doc(db, "user_users", e.id);
            await updateDoc(
              IdRef,
              {
                displayname: newName,
                email: newEmail,
              },
              { merge: true }
            );
            props.setUser(newName);
            props.setEmail(newEmail);
            setNewEmail("");
            setNewName("");
            setIsModalVisible(false);
          } else {
            console.log("Sửa thông tin thất bại");
          }
        });
      })
      .catch(() => {
        console.log("Sửa thông tin thất bại");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Change
      </Button>
      <Modal
        title="Thay đổi thông tin tài khoản"
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
            label="Name"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
          >
            <Input
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Đặt lại tên tài khoản"
            />
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
            <Input
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Đặt lại Email tài khoản"
            />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default ChangeInfo;
