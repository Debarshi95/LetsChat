import { db, arrayUnion } from "../firebase";
import styles from "../styles/RoomInfoBar.module.css";
import React from "react";
import {
  Divider,
  Avatar,
  Typography,
  Button,
  Box,
  TextField,
} from "@material-ui/core";
import { Person } from "@material-ui/icons";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function RoomInfoBar({ roomInfo: initialRoomInfo }) {
  const [roomDetails, setRoomDetails] = React.useState(initialRoomInfo);
  const [roomCreatedBy, setRoomCreatedBy] = React.useState(null);
  const [newUserNumber, setNewUserNumber] = React.useState("");

  React.useEffect(() => {
    if (initialRoomInfo) {
      db.collection("rooms")
        .doc(initialRoomInfo.id)
        .onSnapshot(
          (snap) => {
            setRoomDetails({ id: snap.id, ...snap.data() });
          },
          (err) => console.log(err)
        );
    }
  }, [initialRoomInfo]);
  // console.log(roomCreatedBy);

  const addNewMemberToRoom = async () => {
    await db
      .collection("rooms")
      .doc(roomDetails.id)
      .update({
        members: arrayUnion(newUserNumber.toString()),
      });
    setNewUserNumber("");
  };
  return (
    <div className={styles.root}>
      <Box className={styles.roomInfo}>
        <Typography variant="h5">{roomDetails.roomName}</Typography>
        <div>
          <p>
            <span>Created By :</span>
            {roomCreatedBy?.phoneNumber}
          </p>
          <p>
            <span>Members :</span>
            {roomDetails?.members?.length}
          </p>
        </div>
      </Box>
      <Divider />

      <div className={styles.memberWrapper}>
        {roomDetails?.members.map((member) => (
          <div className={styles.member} key={member.id}>
            <Avatar>
              <Person />
            </Avatar>
            <Typography variant="h6" component="h6">
              {member}
            </Typography>
          </div>
        ))}
        {/* <AsyncSelect loadOptions={} /> */}
        {/* <Select options={} /> */}
      </div>
      <Box className={styles.addMember}>
        <PhoneInput
          className={styles.phoneInput}
          placeholder="Enter phone number"
          value={newUserNumber}
          onChange={setNewUserNumber}
          autoComplete="off"
        />
        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={addNewMemberToRoom}
          disabled={newUserNumber === ""}
        >
          Add
        </Button>
      </Box>
    </div>
  );
}
