import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useEffect, useState } from "react";
import TodoList from "./TodoList";
import Login from "../user/Login";
import Signin from "../user/Signin";
import auth, { db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./todo.css";
import ChangeInfo from "../user/ChangeInfo";

function TodoApp() {
  const [user, setUser] = useState([]);
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  var [changeEmail, setChangeEmail] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setRegister] = useState(false);
  const [showChangeInfo, setShowChangeInfo] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      //get doc tim user tren bag user(currentU.uid)
      //neu co => setUser ? nulll
      if (currentUser) {
        const q = query(
          collection(db, "user_users"),
          where("uid", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.data());
          setUser(doc.data().displayname);
          setEmail(doc.data().email);
          setId(doc.data().uid);
          setChangeEmail(currentUser.email);
          // setUser({
          //   name: doc.data().displayname,
          //   email: doc.data().email,
          //   uid: doc.data().uid,
          //   olEmail: currentUser.email
          // })
        });
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogOut = () => {
    signOut(auth);
  };
  const handleChangeInfo = () => {
    setShowChangeInfo(true);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        {user ? (
          <div>
            <div className="user_header">
              <div className="user_header-icon">
                <UserOutlined style={{ paddingLeft: "20" }} />
                <ul className="user_infor">
                  <li className="user_infor-li">
                    <label className="user_infor-item ">
                      Name:
                      <span> {user} </span>
                    </label>
                  </li>
                  <li className="user_infor-li">
                    <label className="user_infor-item ">
                      Email:
                      <span> {email} </span>
                    </label>
                  </li>
                  <ChangeInfo
                    changeEmail={changeEmail}
                    setChangeEmail={setChangeEmail}
                    id={id}
                    setUser={setUser}
                    user={user}
                    email={email}
                    setEmail={setEmail}
                    handleChangeInfo={handleChangeInfo}
                    setShowChangeInfo={setShowChangeInfo}
                  />
                </ul>
              </div>
              <Button onClick={() => handleLogOut()}>Logout</Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              onClick={() => {
                setRegister(true);
              }}
            >
              Register
            </Button>
            <Button
              onClick={() => {
                setShowLogin(true);
              }}
            >
              Login
            </Button>

            {showRegister ? (
              <Signin setRegister={setRegister} setShowLogin={setShowLogin} />
            ) : (
              <></>
            )}

            {showLogin ? (
              <Login setShowLogin={setShowLogin} setUser={setUser} />
            ) : (
              <></>
            )}
          </>
        )}
      </div>
      <div>{showChangeInfo ? <ChangeInfo /> : <></>}</div>
      <TodoList user={user} id={id} />
    </div>
  );
}

export default TodoApp;
