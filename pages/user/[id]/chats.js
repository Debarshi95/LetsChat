import React from "react";
import ChatScreen from "../../../components/chatscreen";
import UserSidebar from "../../../components/usersidebar";
import { db } from "../../../firebase";
import styles from "../../../styles/Chat.module.css";

export default function Chat({ chatUsers }) {
  const [otherUserNumber, setOtherUserNumber] = React.useState(null);
  return (
    <div className={styles.root}>
      <div className={styles.chatSidebar}>
        <UserSidebar
          setOtherUserNumber={setOtherUserNumber}
          chatUsers={JSON.parse(chatUsers)}
        />
      </div>
      {otherUserNumber ? (
        <div className={styles.chatChatScreen}>
          <ChatScreen otherUserNumber={otherUserNumber} />
        </div>
      ) : (
        <div className={styles.chatNoScreen}>
          <img src="/images/click_chat.jpg" alt="click chat" />
        </div>
      )}
    </div>
  );
}
export async function getServerSideProps(context) {
  const ref = db.collection("users").doc(context.query.id);
  const res = await db
    .collection("chats")
    .where("createdBy", "==", ref)
    .orderBy("createdAt", "desc")
    .get();

  const chatUsers = res.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return {
    props: {
      chatUsers: JSON.stringify(chatUsers),
    },
  };
}
