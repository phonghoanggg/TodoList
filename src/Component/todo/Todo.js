import React, { useEffect, useState } from "react";
import TodoForm from "./TodoForm";
import { RiCloseCircleLine } from "react-icons/ri";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineCheckCircle, AiFillCheckCircle } from "react-icons/ai";
import { message } from "antd";

function Todo({
  idRoom,
  id,
  checkUser,
  check,
  todo,
  completeTodo,
  removeTodo,
  updateTodo,
}) {
  const [edit, setEdit] = useState({
    id: null,
    value: "",
  });
  // cập nhật lại todoName
  const [nameUpdate, setNameUpdate] = useState("");
  const submitUpdate = (value) => {
    updateTodo(edit.id, value);
  };
  if (edit.id) {
    return (
      <TodoForm
        id={id}
        editFrom={{ edit, setEdit }}
        updateName={{ nameUpdate, setNameUpdate }}
        onSubmit={submitUpdate}
      />
    );
  }
  // notification
  const key = "updatable";
  const openMessage = () => {
    message.loading({ content: "Loading...", key });
  };
  const closeMessage = () => {
    message.success({ content: "Delete!", key });
  };
  const handleUpdate = (ob) => {
    console.log(ob);
    setNameUpdate(ob.value);
    setEdit(ob);
  };
  let newTodo = [];
  if (check === 0) {
    newTodo = [...todo];
  } else if (check === 1) {
    newTodo = todo.filter((e) => {
      return e.isComplete === true;
    });
  } else {
    newTodo = todo.filter((e) => {
      return e.isComplete === false;
    });
  }

  // kiểm tra nếu không có user thì set lại mảng todo = []
  return newTodo.map((person, index) => (
    <li
      className={person.isComplete ? "todo-row complete" : "todo-row"}
      key={index}
    >
      <div
        className="todo-row-item"
        key={person.id}
        onClick={() => completeTodo(person)}
      >
        <AiFillCheckCircle className="check-icon-complete" />
        <AiOutlineCheckCircle className="check-icon" />
        <p className="todo-row-item-text">{person.todo}</p>
      </div>
      <div className="icons">
        <RiCloseCircleLine
          className="delete-icon"
          onClick={async () => {
            openMessage();
            await removeTodo(person.id);
            closeMessage();
          }}
        />

        <FiEdit3
          className="edit-icon"
          onClick={() => handleUpdate({ id: person.id, value: person.todo })}
        />
      </div>
    </li>
  ));
}

export default Todo;
