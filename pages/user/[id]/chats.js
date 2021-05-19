import React from "react";
import ChatFeed from "../../../components/chatfeed";
import ChatSidebar from "../../../components/chatsidebar";
import RoomInfoBar from "../../../components/roominfobar";
import { db } from "../../../firebase";
import styles from "../../../styles/Chat.module.css";

export default function Chat({ rooms }) {
  const [roomInfo, setRoomInfo] = React.useState(null);
  const [showChatInfoBar, setShowChatInfoBar] = React.useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.chatSidebar}>
        <ChatSidebar setRoomInfo={setRoomInfo} rooms={JSON.parse(rooms)} />
      </div>
      {roomInfo ? (
        <div className={styles.chatChatScreen}>
          <ChatFeed
            roomInfo={roomInfo}
            setShowChatInfoBar={setShowChatInfoBar}
          />
        </div>
      ) : (
        <div className={styles.chatNoScreen}>
          <img src="/images/click_chat.jpg" alt="chat feed" />
        </div>
      )}
      {showChatInfoBar && <RoomInfoBar roomInfo={roomInfo} />}
    </div>
  );
}
export async function getServerSideProps(context) {
  const result = await db
    .collection("users")
    .where("uid", "==", context.query.id)
    .get();

  const user = { id: result?.docs[0].id, ...result?.docs[0].data() };

  const res = await db
    .collection("rooms")
    .where("members", "array-contains", user?.phoneNumber)
    .orderBy("createdAt", "desc")
    .get();

  const rooms = res?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return {
    props: {
      rooms: JSON.stringify(rooms),
    },
  };
}
