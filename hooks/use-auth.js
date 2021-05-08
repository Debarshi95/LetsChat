import React from "react";
import { auth, db, timeStamp } from "../firebase";

const useAuth = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const confirmationResult = React.useRef();

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // setLoggedStatus(true);
        getUserDataById(authUser.uid);
      } else {
        // setLoggedStatus(false);
        setUser(null);
      }
    });
    return () => unsub();
  }, []);

  const signInWithPhone = (phoneNumber, captchaVerifier) => {
    setLoading(true);
    return auth
      .signInWithPhoneNumber(phoneNumber, captchaVerifier)
      .then((res) => {
        setLoading(false);
        confirmationResult.current = res;
        return res;
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const verifyOtp = (userOtp) => {
    setLoading(true);
    return confirmationResult.current
      ?.confirm(userOtp)
      .then(async (res) => {
        const userExists = await checkIfUserExists(res.user.phoneNumber);
        if (userExists) {
          return getUserDataById(res.user.uid);
        } else {
          return createUser(res.user);
        }
      })
      .then((data) => {
        setLoading(false);
        return data.id;
      })
      .catch((err) => {
        setLoading(false);
        throw err;
      });
  };

  const checkIfUserExists = (phoneNumber) => {
    return db
      .collection("users")
      .where("phoneNumber", "==", phoneNumber)
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
    try {
      const res = await db.collection("users").where("uid", "==", userId).get();
      // console.log("data", res?.docs[0].data());
      const mUser = { id: res.docs[0].id, ...res.docs[0].data() };

      // console.log("user", mUser);
      setUser(mUser);
      return mUser;
    } catch (err) {
      throw err;
    }
  };

  const signOut = () => {
    return auth.signOut();
  };

  const createUser = (user) => {
    return db
      .collection("users")
      .add({
        uid: user.uid,
        fullname: "",
        email: "",
        isLoggedIn: true,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL,
        lastLogin: timeStamp(),
        createdAt: timeStamp(),
      })
      .catch((err) => {
        throw err;
      });
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
