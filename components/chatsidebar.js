import {
  Avatar,
  Button,
  Divider,
  IconButton,
  Typography,
} from "@material-ui/core";
import {
  Add,
  AddCircle,
  AddSharp,
  ChatBubble,
  ExitToApp,
  Person,
} from "@material-ui/icons";
import React from "react";
import { db } from "../firebase";
import { useAuthContext } from "../providers/auth-provider";
import styles from "../styles/ChatSidebar.module.css";
import { useRouter } from "next/router";

import Modal from "./modal";

export default function ChatSidebar({ rooms: _rooms, setRoomInfo }) {
  const [showModal, setShowModal] = React.useState(false);
  const [rooms, setRooms] = React.useState(_rooms);
  const router = useRouter();

  const { user, signOut } = useAuthContext();

  React.useEffect(() => {
    if (user) {
      db.collection("rooms")
        .where("members", "array-contains", user?.phoneNumber)
        .orderBy("createdAt", "desc")
        .onSnapshot((snap) => {
          setRooms(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
    }
  }, [user, setRoomInfo]);

  return (
    <div className={styles.root}>
      <Button fullWidth className={styles.userInfo}>
        <Avatar>
          <Person />
        </Avatar>
        <Typography component="h6" variant="h6">
          {user?.phoneNumber}
        </Typography>
      </Button>

      <Divider />

      <div className={styles.roomHeader}>
        <h3>Rooms</h3>
        <IconButton onClick={() => setShowModal((prev) => !prev)}>
          <AddCircle />
        </IconButton>
      </div>
      <div className={styles.roomWrapper}>
        {rooms?.map((room) => (
          <Button
            fullWidth
            key={room.id}
            onClick={() => setRoomInfo(room)}
            startIcon={<ChatBubble />}
            className={styles.room}
          >
            {room.roomName}
          </Button>
        ))}
      </div>
      <Button
        className={styles.signout}
        onClick={() =>
          signOut().then(() => {
            router.push("/");
          })
        }
        startIcon={<ExitToApp />}
      >
        Sign Out
      </Button>
      {showModal && <Modal setOpenModal={setShowModal} />}
    </div>
  );
}
