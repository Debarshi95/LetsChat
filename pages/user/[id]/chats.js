import React from "react";
import ChatFeed from "../../../components/chatfeed";
import ChatSidebar from "../../../components/chatsidebar";
import Modal from "../../../components/modal";
import RoomInfoBar from "../../../components/roominfobar";
import { db } from "../../../firebase";
import styles from "../../../styles/Chat.module.css";
import { getUserDocById } from "../../../util/get-user-doc";

export default function Chat({ rooms, userData }) {
  const [roomInfo, setRoomInfo] = React.useState(null);
  const [showChatInfoBar, setShowChatInfoBar] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.chatSidebar}>
        <ChatSidebar
          setRoomInfo={setRoomInfo}
          rooms={JSON.parse(rooms)}
          userData={JSON.parse(userData)}
          setShowModal={setShowModal}
        />
      </div>
      {roomInfo ? (
        <div className={styles.chatFeed}>
          <ChatFeed
            roomInfo={roomInfo}
            setShowChatInfoBar={setShowChatInfoBar}
          />
        </div>
      ) : (
        <div className={styles.noChatFeed}>
          <img src="/images/click_chat.jpg" alt="chat feed" />
        </div>
      )}
      {showChatInfoBar && <RoomInfoBar roomInfo={roomInfo} />}
      {showModal && <Modal setShowModal={setShowModal} />}
    </div>
  );
}
export async function getServerSideProps(context) {
  const user = await getUserDocById(context.query.id);
  console.log(user);
  const res = await db
    .collection("rooms")
    .where("members", "array-contains", user?.phoneNumber)
    .orderBy("createdAt", "desc")
    .get();

  const rooms = res?.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return {
    props: {
      rooms: JSON.stringify(rooms),
      userData: JSON.stringify(user),
    },
  };
}
