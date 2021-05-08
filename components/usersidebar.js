import { Avatar, Button, Divider, Typography } from "@material-ui/core";
import { Add, ExitToApp, PersonAddSharp } from "@material-ui/icons";
import React from "react";
import PhoneInput from "react-phone-number-input";
import { db, timeStamp } from "../firebase";
import { useAuthContext } from "../providers/auth-provider";
import styles from "../styles/UserSidebar.module.css";
import "react-phone-number-input/style.css";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";

export default function UserSidebar({ chatUsers: chats, setOtherUserNumber }) {
  const [inputNumber, setInputNumber] = React.useState("");
  const [inputElement, setInputElement] = React.useState(false);
  const [chatUsers, setChatUsers] = React.useState(chats);
  const router = useRouter();
  const { addToast } = useToasts();
  const { user, signOut } = useAuthContext();
  const userRef = db.collection("users").doc(router.query?.id);
  React.useEffect(() => {
   if(user){
      db.collection("chats")
        .where("createdBy", "==", userRef)
        .orderBy("createdAt", "desc")
        .onSnapshot((snap) => {
          setChatUsers(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
   }
  }, [user, setOtherUserNumber]);

  const createChatUser = async () => {
    if (
      inputNumber !== "" &&
      inputNumber !== undefined &&
      inputNumber !== user?.phoneNumber
    ) {
      const userAlreadyExists = await checkUserAlreadyExists();
      if (!userAlreadyExists) {
        db.collection("chats")
          .add({
            users: [user?.phoneNumber, inputNumber],
            createdBy: userRef,
            createdAt: timeStamp(),
          })
          .catch((err) => console.log(err));
        setInputElement(false);
        setInputNumber("");
      } else {
        addToast("User already exists!!", {
          appearance: "error",
          autoDismiss: true,
        });
      }
    }
  };

  const checkUserAlreadyExists = async () => {
    const res = await db
      .collection("chats")
      .where("createdBy", "==", userRef)
      .where("users", "array-contains", inputNumber)
      .get();

    return res.docs.length > 0;
  };
  return (
    <div className={styles.root}>
      {inputElement && (
        <PhoneInput
          className={styles.phoneInput}
          placeholder="Enter phone number"
          value={inputNumber}
          onChange={setInputNumber}
          autoComplete="off"
        />
      )}
      <Button
        startIcon={<Add />}
        fullWidth
        onClick={inputElement ? createChatUser : () => setInputElement(true)}
        className={styles.btnStartChat}
        disabled={inputElement ? inputElement === "" : false}
      >
        {inputElement ? "Add User" : "  Start new chat"}
      </Button>
      <Divider />
      <div className={styles.sidebarUsers}>
        <>
          {chatUsers &&
            chatUsers.map((mUser) => (
              <button
                key={mUser.id}
                className={styles.user}
                onClick={() => setOtherUserNumber(mUser?.users[1])}
              >
                <Avatar>
                  <PersonAddSharp />
                </Avatar>
                <Typography variant="h6">{mUser?.users[1]}</Typography>
              </button>
            ))}
        </>
        <Button
          fullWidth
          className={styles.signout}
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
    </div>
  );
}
