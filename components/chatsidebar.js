import {
  Avatar,
  Button,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { AddCircle, ExitToApp, Group, Person } from "@material-ui/icons";
import React from "react";
import { db } from "../firebase";
import { useAuthContext } from "../providers/auth-provider";
import styles from "../styles/ChatSidebar.module.css";
import { useRouter } from "next/router";

export default function ChatSidebar({
  rooms: _rooms,
  setRoomInfo,
  userData,
  setShowModal,
}) {
  const [rooms, setRooms] = React.useState(_rooms);
  const router = useRouter();
  const { signOut } = useAuthContext();

  React.useEffect(() => {
    if (userData) {
      db.collection("rooms")
        .where("members", "array-contains", userData?.phoneNumber)
        .orderBy("createdAt", "desc")
        .onSnapshot((snap) => {
          setRooms(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
    }
  }, [userData, setRoomInfo, setShowModal]);

  return (
    <div className={styles.root}>
      <Button fullWidth className={styles.userInfo}>
        <Avatar>
          <Person />
        </Avatar>
        <Typography component="h6" variant="h6">
          {userData?.phoneNumber}
        </Typography>
      </Button>
      <>
        <ListItem className={styles.roomHeader} disableGutters>
          <h3>Rooms</h3>
          <IconButton onClick={() => setShowModal((prev) => !prev)}>
            <AddCircle />
          </IconButton>
        </ListItem>
        {rooms?.map((room) => (
          <ListItem
            component="button"
            key={room.id}
            onClick={() => setRoomInfo(room)}
            className={styles.room}
          >
            <ListItemIcon>
              <Group />
            </ListItemIcon>
            <ListItemText>{room.roomName}</ListItemText>
          </ListItem>
        ))}
      </>
      <Button
        variant="outlined"
        className={styles.signout}
        fullWidth
        onClick={() =>
          signOut().then(() => {
            router.push("/");
          })
        }
        startIcon={<ExitToApp />}
      >
        Sign Out
      </Button>
    </div>
  );
}
