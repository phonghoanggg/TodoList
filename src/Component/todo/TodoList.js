import React, { useEffect, useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import "antd/dist/antd.css";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import auth, { db } from "../../firebase";
import Control from "../footer/Control";
import RoomList from "./RoomList";
import { CloseCircleOutlined, SmileOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { async } from "@firebase/util";
const PerContext = React.createContext();

function TodoList(props) {
  const [todos, setTodos] = useState([]);

  const [todo, setTodo] = useState([]);
  // kiểm tra công việc All / Complete / incomplete
  const [check, setCheck] = useState(0);
  const [idRoom, setIdRoom] = useState("ME");
  const [members, setMembers] = useState("");
  const [listMember, setListMember] = useState([]);
  const idUser = props.id;

  useEffect(() => {
    if (idRoom?.id && props.user) {
      const response = collection(db, "user_users");
      const q = query(response, where("uid", "in", idRoom.member));
      const refMem = onSnapshot(q, (ref) => {
        const pes = ref.docs.map((u) => ({
          ...u.data(),
          id: u.id,
        }));
        setListMember(pes);
      });
      return () => refMem();
    } else {
      setListMember([]);
    }
  }, [idRoom, props.user]);
  useEffect(() => {
    if (props.user) {
      const refPerson = collection(db, "user_todo");
      if (auth.currentUser) {
        const q = query(
          refPerson,
          idRoom === "ME"
            ? (where("uid", "==", auth.currentUser.uid),
              where("idRoom", "==", auth.currentUser.uid))
            : where("idRoom", "==", idRoom)
          // orderBy("createAt", "desc")
        );
        const unSub = onSnapshot(q, (snapshot) => {
          const pes = snapshot.docs.map((u) => ({ ...u.data(), id: u.id }));
          setTodo(pes);
        });
        return () => unSub();
      }
    } else {
      setTodo([]);
    }
  }, [props.user, idRoom]);
  const updateTodo = (todoId, newValue) => {
    if (!newValue.text || /^\s*$/.test(newValue.test)) {
      return;
    }
    setTodos((pre) =>
      pre.map((item) => (item.id === todoId ? newValue : item))
    );
  };

  const removeTodo = async (id) => {
    const docRef = doc(db, "user_todo", id);
    await deleteDoc(docRef).then(() => {
      console.log("Completed");
    });
  };
  const completeTodo = (person) => {
    const docRef = doc(db, "user_todo", person.id);
    setDoc(
      docRef,
      {
        isComplete: !person.isComplete,
      },
      { merge: true }
    );
  };
  const handleDeleteMem = async (idMem) => {
    const newMem = idRoom.member.filter((mem) => mem !== idMem);

    const docRef = doc(db, "user_room", idMem);
    await setDoc(
      docRef,
      {
        member: [newMem],
      },
      {
        merge: true,
      }
    );
  };
  console.log(listMember);
  return (
    <PerContext.Provider value={todo}>
      <div className="content">
        <h1 className="header_app">Todo List</h1>

        <div className="form">
          <div className="group_member">
            {idRoom !== "ME" ? (
              <ul>
                <span style={{ fontSize: 16 }}>Members of the group: </span>
                {listMember.map((user, index) => {
                  return auth.currentUser.uid === idRoom.owner ||
                    user.uid === auth.currentUser.uid ? (
                    <li
                      className="group_member-item"
                      style={{ textAlign: "center", marginTop: 10 }}
                      key={index}
                    >
                      <span>{user.displayname}</span>
                      <Popconfirm
                        title="Get out of the group？"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDeleteMem(user.uid)}
                      >
                        <CloseCircleOutlined style={{ marginLeft: 5 }} />
                      </Popconfirm>
                    </li>
                  ) : (
                    <>
                      <li
                        className="group_member-item"
                        style={{ textAlign: "center", marginTop: 10 }}
                        key={index}
                      >
                        <span> {user.displayname}</span>
                      </li>
                    </>
                  );
                })}
              </ul>
            ) : (
              <span className="page_hello">
                {" "}
                <SmileOutlined style={{ paddingRight: 5 }} />
                HELLO <span style={{ color: "Highlight" }}>{props.user}</span>
              </span>
            )}
          </div>
          <div className="list_item">
            <TodoForm idRoom={idRoom} idUser={idUser} checkUser={props.user} />
            <Control setCheck={setCheck} />
            <div style={{ overflow: "auto", maxHeight: 260 }}>
              <Todo
                idRoom={idRoom}
                checkUser={props.user}
                id={props.id}
                check={check}
                todo={todo}
                completeTodo={completeTodo}
                removeTodo={removeTodo}
                updateTodo={updateTodo}
              />
            </div>
          </div>
          <RoomList
            setMembers={setMembers}
            idRoom={idRoom}
            setIdRoom={setIdRoom}
            id={props.id}
          />
        </div>
      </div>
    </PerContext.Provider>
  );
}
export { PerContext };
export default TodoList;
