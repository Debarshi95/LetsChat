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
import { useRouter } from "next/router";

export default function ChatFeed({ roomInfo, setShowChatInfoBar }) {
  const [message, setMessage] = React.useState("");
  const [chatMessages, setChatMessages] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { query } = useRouter();
  const userRef = db.collection("users").doc(query?.id);
  const viewRef = React.useRef();

  React.useEffect(() => {
    const unsub = db
      .collection("chats")
      .doc(roomInfo.id)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .onSnapshot(async (snap) => {
        const messages = [];
        for (let i = 0; i < snap.docs.length; i++) {
          const _data = snap.docs[i].data();
          const _sentBy = await _data.sentBy.get();

          _data.id = snap.docs[i].id;
          _data.sentBy = { id: _sentBy.id, ..._sentBy.data() };

          messages.push(_data);
        }
        setChatMessages(messages);
        setLoading(false);
        viewRef.current.scrollIntoView({ behavior: "smooth" });
      });
    return unsub;
  }, [roomInfo, viewRef]);

  const sendMessage = async (e) => {
    e.preventDefault();
    db.collection("chats").doc(roomInfo.id).collection("messages").add({
      message,
      sentBy: userRef,
      createdAt: timeStamp(),
    });
    setMessage("");
  };

  console.log(chatMessages);
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
        {loading ? (
          <h2>Loading</h2>
        ) : (
          <>
            {chatMessages?.map((m) => (
              <div
                key={m.id}
                className={styles.message}
                style={{
                  background: `${
                    m.sentBy.id === query.id ? "pink" : "#f5f5f5"
                  }`,

                  alignSelf: `${
                    m.sentBy.id === query.id ? "flex-end" : "inherit"
                  }`,
                  borderBottomRightRadius: `${
                    m.sentBy.id !== query.id ? "30px" : "initial"
                  }`,
                  borderBottomLeftRadius: `${
                    m.sentBy.id === query.id ? "30px" : "initial"
                  }`,
                }}
              >
                <p>
                  <strong>{m?.sentBy?.phoneNumber}</strong>
                </p>
                <p>{m.message}</p>
              </div>
            ))}
          </>
        )}
        <div ref={viewRef}></div>
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
