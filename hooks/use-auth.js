import React from "react";
import { auth, db, timeStamp } from "../firebase";

const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const confirmationResult = React.useRef();

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userExists = await checkIfUserExists(authUser.uid);
        if (!userExists) {
          createNewUser(authUser);
        } else {
          getUserDataById(authUser.uid);
        }
      } else {
        setUser(null);
      }
    });
    return unsub;
  }, [setUser]);

  const signInWithPhone = async (phoneNumber, captchaVerifier) => {
    setLoading(true);

    try {
      const res = await auth.signInWithPhoneNumber(
        phoneNumber,
        captchaVerifier
      );
      confirmationResult.current = res;
      setLoading(false);
      return res;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const verifyOtp = async (userOtp) => {
    setLoading(true);
    try {
      const res = await confirmationResult.current.confirm(userOtp);
      return res.user;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const checkIfUserExists = (userId) => {
    return db
      .collection("users")
      .where("uid", "==", userId)
      .get()
      .then((res) => res.docs.length > 0)
      .catch((err) => {
        throw err;
      });
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
  const getUserDataById = async (userId) => {
    setLoading(true);
    try {
      const res = await db.collection("users").where("uid", "==", userId).get();
      const mUser = { id: res.docs[0].id, ...res.docs[0].data() };

      setUser(mUser);
      setLoading(false);
      return mUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signOut = () => {
    return auth.signOut();
  };

  const createNewUser = async (user) => {
    try {
      const res = db.collection("users").add({
        uid: user.uid,
        fullname: "",
        email: "",
        isLoggedIn: true,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastLogin: timeStamp(),
        createdAt: timeStamp(),
      });
      setLoading(false);
      return res;
    } catch (error) {
      throw error;
    }
  };

  return {
    loading,
    user,
    signInWithPhone,
    signOut,
    verifyOtp,
    setUser,
    getUserDataById,
  };
};
export default useAuth;
