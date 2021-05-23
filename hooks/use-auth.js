import React from "react";
import { auth, db, timeStamp } from "../firebase";

const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const confirmationResult = React.useRef();

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, [setUser]);

  const signInWithPhone = async (phoneNumber, captchaVerifier) => {
    try {
      const res = await auth.signInWithPhoneNumber(
        phoneNumber,
        captchaVerifier
      );
      confirmationResult.current = res;
      return res;
    } catch (err) {
      throw err;
    }
  };

  const verifyOtp = async (userOtp) => {
    try {
      const res = await confirmationResult.current.confirm(userOtp);
      return res.user;
    } catch (error) {
      throw error;
    }
  };

  const checkIfUserExists = async (uid) => {
    try {
      const res = await db.collection("users").where("uid", "==", uid).get();

      return res.docs.length > 0;
    } catch (err) {
      throw err;
    }
  };

  const setLoggedStatus = (loggedInStatus) => {
    return db
      .collection("users")
      .where("uid", "==", user?.uid)
      .onSnapshot((snapShot) => {
        snapShot.docs.map((doc) => {
          doc.ref.update({
            lastLogin: timeStamp(),
            isLoggedIn: loggedInStatus,
          });
        });
      });
  };

  const signOut = () => {
    return auth.signOut();
  };

  const createNewUser = async (user) => {
    try {
      const res = db.collection("users").doc(user.uid).set({
        fullname: "",
        email: "",
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastLogin: timeStamp(),
        createdAt: timeStamp(),
      });
      return res;
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    signInWithPhone,
    signOut,
    verifyOtp,
    setUser,
    checkIfUserExists,
    createNewUser,
  };
};
export default useAuth;
