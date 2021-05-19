import { db } from "../firebase";
import styles from "../styles/RoomInfoBar.module.css";
import React from "react";
export default function RoomInfoBar({ roomInfo }) {
  const [roomCreatedBy, setRoomCreatedBy] = React.useState(null);
  console.log(roomInfo);

  React.useEffect(() => {
    if (roomInfo) {
      db.collection("users")
        .doc(roomInfo.createdBy.id)
        .onSnapshot(
          (snap) => {
            setRoomCreatedBy({ id: snap.id, ...snap.data() });
          },
          (err) => console.log(err)
        );
    }
  }, [roomInfo]);
  console.log(roomCreatedBy);
  return (
    <div className={styles.root}>
      <h2>RoomName</h2>
      <div>
        <p>
          <span>Created By</span>
          {roomCreatedBy?.phoneNumber}
        </p>
      </div>
    </div>
  );
}
