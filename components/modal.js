import { useSpring, animated } from "react-spring";
import React from "react";
import styles from "../styles/Modal.module.css";
import { useToasts } from "react-toast-notifications";
import { useAuthContext } from "../providers/auth-provider";
import { db, timeStamp } from "../firebase";

function Modal({ setOpenModal }) {
  const [roomName, setRoomName] = React.useState("");
  const props = useSpring({
    to: { opacity: 0.7 },
    from: { opacity: 0 },
  });
  const { user } = useAuthContext();
  const userRef = db.collection("users").doc(user?.id);
  const { addToast } = useToasts();

  const checkRoomExists = async () => {
    const res = await db
      .collection("rooms")
      .where("createdBy", "==", userRef)
      .where("roomName", "==", roomName.toLowerCase())
      .get();

    return res.docs.length > 0;
  };
  const createRoom = async () => {
    if (roomName !== "") {
      const roomExists = await checkRoomExists();
      if (roomExists) {
        addToast("Room already exists!", {
          autoDismiss: true,
          appearance: "error",
        });
        return;
      }
      await db.collection("rooms").add({
        roomName: roomName.toLowerCase(),
        createdBy: userRef,
        members: [user?.phoneNumber],
        createdAt: timeStamp(),
      });
      setRoomName("");
      setOpenModal(false);
    } else {
      addToast("Room should have a name!", {
        autoDismiss: true,
        appearance: "error",
      });
    }
  };

  return (
    <animated.div style={props} className={styles.modal}>
      <div className={styles.form}>
        <h2>Create Room</h2>
        <input
          type="text"
          name="room"
          placeholder="Enter room name"
          autoComplete="off"
          value={roomName}
          onChange={({ target }) => setRoomName(target.value)}
        />
        <div>
          <button type="button" onClick={createRoom}>
            Create
          </button>
          <button type="button" onClick={() => setOpenModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </animated.div>
  );
}

export default Modal;
