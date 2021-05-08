import { IconButton } from "@material-ui/core";
import { Attachment, InsertEmoticon, SendSharp } from "@material-ui/icons";

import styles from "../styles/ChatScreen.module.css";
import React from "react";
import { db, timeStamp } from "../firebase";

import { useAuthContext } from "../providers/auth-provider";
import { useRouter } from "next/router";

export default function ChatScreen({ otherUserNumber }) {
  const [message, setMessage] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState(null);
  const { user } = useAuthContext();
  const router = useRouter();
  const userRef = db.collection("users").doc(router.query?.id);

  React.useEffect(() => {
    db.collection("messages")
      .where("sentBy", "==", userRef)
      .where("users", "array-contains", otherUserNumber)
      .orderBy("createdAt", "asc")
      .onSnapshot((snap) => {
        setChatMessages(
          snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      });
  }, [user, otherUserNumber]);

  const sendMessage = async (e) => {
    e.preventDefault();
    await db.collection("messages").add({
      message,
      users: [otherUserNumber, user?.phoneNumber],
      sentBy: userRef,
      createdAt: timeStamp(),
    });

    setMessage("");
  };

  return (
    <div className={styles.root}>
      <div className={styles.topbar}>
        <div className={styles.userInfo}>
          <h4>{otherUserNumber}</h4>
        </div>
      </div>
      <div className={styles.messageWrapper}>
        {chatMessages &&
          chatMessages.map((m) => (
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
