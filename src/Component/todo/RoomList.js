import {
  DeleteOutlined,
  HomeTwoTone,
  MoreOutlined,
  SettingOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import auth, { db } from "../../firebase";

function RoomList(props) {
  const [createRoom, setCreateRoom] = useState("");
  const [listRoom, setListRoom] = useState([]);
  const inputElement = useRef();
  const [showinput, setShowinput] = useState(true);
  const [listUser, setListUser] = useState([]);
  const [searchMember, setSearchMember] = useState("");
  const [idMember, setIdMember] = useState("");
  const [owner, setOwner] = useState("");

  useEffect(() => {
    if (auth.currentUser) {
      const refPerson = collection(db, "user_room");
      const q = query(
        refPerson,
        where("member", "array-contains", auth.currentUser.uid)
      );
      // Lấy mảng member

      // const m = query(refPerson);
      const unSub = onSnapshot(q, (snapshot) => {
        const pes = snapshot.docs.map((u) => ({
          ...u.data(),
          id: u.id,
        }));
        setListRoom(() => [...pes]);
      });

      const refSearch = collection(db, "user_users");
      const s = query(refSearch);
      const search = onSnapshot(s, (snapshot) => {
        const pes = snapshot.docs.map((u) => ({ ...u.data(), id: u.id }));
        setListUser(pes);
      });
      // Lấy mảng member từ firebase
      return () => unSub();
    } else {
      setListRoom([]);
    }
  }, [auth.currentUser]);

  const handleCreateRoom = () => {
    console.log(props.id);
    if (props.id) {
      addDoc(collection(db, "user_room"), {
        nameRoom: createRoom,
        uid: props.id,
        createAt: serverTimestamp(),
        owner: auth.currentUser.uid,
        member: [auth.currentUser.uid],
      }).then(() => {
        console.log("Tạo phòng thành công");
        inputElement.current.focus();
        setOwner(auth.currentUser.uid);
        setCreateRoom("");
      });
    } else {
      alert("Please login!");
    }
    setCreateRoom("");
  };
  // Xóa phòng-----
  const key = "updatable";
  const openMessage = () => {
    message.loading({ content: "Loading...", key });
  };
  const closeMessage = () => {
    message.success({ content: "Xóa phòng", key });
  };
  const handleDeleteRoom = async (id) => {
    const docRef = doc(db, "user_room", id);
    await deleteDoc(docRef).then(() => {
      console.log("Delete room completed");
    });
  };
  const showAddUser = () => {
    setShowinput(false);
  };
  const handleAddUser = async (e) => {
    console.log(e);

    const docRef = doc(db, "user_room", props.idRoom.id);
    await setDoc(
      docRef,
      {
        member: [...props.idRoom.member, e],
      },
      { merge: true }
    );
    setShowinput(true);
    setSearchMember("");
  };
  const handleShowMyG = () => {
    props.setIdRoom(auth.currentUser.uid);
    props.setIdRoom("ME");
  };
  return (
    <div className="group">
      <div>
        <ul className="room">
          List Group
          {auth.currentUser !== null ? (
            <li
              style={{
                marginLeft: 10,
                listStyle: "none",
                textAlign: "center",
                color: "Highlight",
                cursor: "pointer",
              }}
              onClick={() => handleShowMyG()}
            >
              My group
            </li>
          ) : (
            <li style={{ listStyle: "none" }}>Empty</li>
          )}
          {listRoom.map(
            (room) => (
              <li
                style={{ listStyle: "none", cursor: "pointer" }}
                key={room.id}
              >
                <span
                  className="room-item"
                  onClick={() => props.setIdRoom(room)}
                >
                  {props.idRoom.id === room.id ? (
                    <HomeTwoTone style={{ paddingRight: 10 }} />
                  ) : (
                    <span style={{ paddingLeft: 25 }}></span>
                  )}

                  {room.nameRoom}
                </span>
                <span className="icon_room" style={{ fontSize: 20 }}>
                  {props.idRoom.id === room.id ? <>...</> : <></>}
                  <ul className="room_nav">
                    <li
                      onClick={() => {
                        openMessage();
                        handleDeleteRoom(room.id);
                        closeMessage();
                      }}
                    >
                      <span className="text_room">Delete</span>{" "}
                      <DeleteOutlined />
                    </li>
                    <li onClick={() => showAddUser()}>
                      <span className="text_room">Add</span>
                      <UserAddOutlined />
                    </li>
                  </ul>
                </span>
              </li>
            )
            // )
          )}
        </ul>
        <div className="create_room">
          {showinput ? (
            <span>
              <input
                value={createRoom}
                ref={inputElement}
                placeholder="Name group"
                onChange={(e) => setCreateRoom(e.target.value)}
              />
              <Button
                className="create_group"
                type="primary"
                onClick={() => handleCreateRoom()}
              >
                Create
              </Button>
            </span>
          ) : (
            <span>
              {" "}
              <input
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                ref={inputElement}
                placeholder="Tên người dùng"
              />
              <Button
                style={{ marginLeft: 5 }}
                className="add_user"
                type="dashed"
                onClick={() => handleAddUser(idMember)}
              >
                ADD
              </Button>
              <ul className="list_user">
                {listUser
                  .filter((user) => {
                    if (searchMember == "") {
                      return user;
                    } else if (
                      user.displayname
                        .toLocaleLowerCase()
                        .includes(searchMember.toLocaleLowerCase())
                    ) {
                      return user;
                    }
                  })
                  .map((user, index) => (
                    <li
                      onClick={() => {
                        setSearchMember(user.displayname);
                        setIdMember(user.uid);
                      }}
                      className="search_item"
                      key={index}
                    >
                      <span style={{ paddingLeft: 6 }}>{user.displayname}</span>
                    </li>
                  ))}
              </ul>
            </span>
          )}
        </div>
      </div>
      <div>
        {/* <Avatar.Group size="small" maxCount={2}>
          <Tooltip title="A">
            <Avatar>A</Avatar>
          </Tooltip>
          <Tooltip title="A">
            <Avatar>B</Avatar>
          </Tooltip>
          <Tooltip title="A">
            <Avatar>C</Avatar>
          </Tooltip>
          <Tooltip title="A">
            <Avatar>D</Avatar>
          </Tooltip>
        </Avatar.Group> */}
      </div>
    </div>
  );
}
export default RoomList;
