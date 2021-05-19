import { IconButton } from "@material-ui/core";
import {
  Attachment,
  InsertEmoticon,
  Person,
  SendSharp,
} from "@material-ui/icons";

import styles from "../styles/ChatFeed.module.css";
import React from "react";
import { db, timeStamp } from "../firebase";

import { useAuthContext } from "../providers/auth-provider";
import { useRouter } from "next/router";

export default function ChatFeed({ roomInfo, setShowChatInfoBar }) {
  const [message, setMessage] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState(null);
  const { user } = useAuthContext();
  const router = useRouter();
  const userRef = db.collection("users").doc(user?.id);

  console.log(roomInfo);
  React.useEffect(() => {
    if (user) {
      db.collection("chats")
        .doc(roomInfo.id)
        .collection("messages")
        .orderBy("createdAt", "asc")
        .onSnapshot((snap) => {
          snap.docs.map((d) => console.log(d.data()));
          setChatMessages(
            snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        });
    }
  }, [user, roomInfo]);
  console.log(chatMessages);
  console.log(chatMessages);
  const sendMessage = async (e) => {
    e.preventDefault();
    db.collection("chats").doc(roomInfo.id).collection("messages").add({
      message,
      sentBy: userRef,
      createdAt: timeStamp(),
    });
    setMessage("");
  };

  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <IconButton onClick={() => setShowChatInfoBar((prev) => !prev)}>
          <Person />
        </IconButton>
        <div className={styles.userInfo}>
          <h4>{roomInfo?.roomName}</h4>
        </div>
      </div>
      <div className={styles.messageWrapper}>
        {chatMessages?.map((m) => (
          <div key={m.id} className={styles.myMessage}>
            <p>{m.message}</p>
          </div>
        ))}
      </div>
      <div className={styles.formItems}>
        <div className="start-icons">
          <IconButton>
            <InsertEmoticon />
          </IconButton>
          <IconButton>
            <Attachment />
          </IconButton>
        </div>
        <textarea
          name="message"
          onChange={({ target }) => setMessage(target.value)}
          value={message}
        ></textarea>
        <div className="end-icons">
          <IconButton onClick={sendMessage} disabled={message === ""}>
            <SendSharp />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
