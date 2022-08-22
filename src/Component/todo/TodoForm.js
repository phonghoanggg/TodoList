import React, { useState, useRef } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import "./todo.css";
import auth, { db } from "../../firebase";
import { message } from "antd";
function TodoForm(props) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const obEdit = props.editFrom;
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const error = () => {
    message.error("Please login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (obEdit?.edit.id) {
      const docRef = doc(db, "user_todo", obEdit.edit.id);
      await updateDoc(
        docRef,
        {
          todo: props.updateName.nameUpdate,
        },
        { merge: true }
      );
      console.log("cập nhật thành công");
      props.editFrom.setEdit({
        id: null,
        value: "",
      });
    } else if (!props.idUser) {
      error();
      console.log("lỗi đăng nhập");
    } else {
      addDoc(collection(db, "user_todo"), {
        todo: input,
        isComplete: false,
        uid: props.idUser,
        idRoom: props.idRoom == "ME" ? auth.currentUser.uid : props.idRoom,
        // createAt: serverTimestamp(),
      }).then(() => {
        console.log("nhập thành công");
        setInput("");
      });
    }
    setInput("");
  };
  return (
    <div className="header">
      <div className="form">
        <form className="todo-form" onSubmit={handleSubmit}>
          {props.editFrom ? (
            <>
              <input
                className="todo-input edit"
                value={props.updateName.nameUpdate}
                type="text"
                placeholder="Sửa công việc"
                onChange={(e) => props.updateName.setNameUpdate(e.target.value)}
                ref={inputRef}
              />
              <button className="todo-button edit">Update</button>
            </>
          ) : (
            <>
              <input
                className="todo-input"
                value={input}
                type="text"
                placeholder="Thêm công việc"
                onChange={handleChange}
                ref={inputRef}
              />
              <button disabled={input ? false : true} className="todo-button">
                ADD
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default TodoForm;
