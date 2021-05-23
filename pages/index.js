import React from "react";
import Head from "next/head";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Navbar from "../components/navbar";
import { useAuthContext } from "../providers/auth-provider";
import { firebase } from "../firebase";
import { CircularProgress } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";

export default function Home() {
  const [number, setNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [verificationId, setVerificationId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const captchaRef = React.useRef();
  const { createNewUser, signInWithPhone, verifyOtp, checkIfUserExists } =
    useAuthContext();
  const { addToast } = useToasts();
  const router = useRouter();

  React.useEffect(() => {
    window.verifier = new firebase.auth.RecaptchaVerifier(captchaRef.current, {
      size: "invisible",
    });
  }, []);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    signInWithPhone(number.toString(), window.verifier)
      .then((data) => {
        setVerificationId(data.verificationId);
        return window.verifier.reset();
      })
      .catch((err) =>
        addToast(err.message, { appearance: "error", autoDismiss: true })
      )
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const user = await verifyOtp(otp.toString());

      const userExists = await checkIfUserExists(user.uid);
      if (!userExists) {
        await createNewUser(user);
      }
      setLoading(false);
      router.push(`/user/${user.uid}/chats`);
    } catch (error) {
      setLoading(false);
      setVerificationId(null);
      setOtp(null);
      addToast(error.message, { appearance: "error", autoDismiss: true });
    }
  };
  return (
    <>
      <Head>
        <title>LetsChat</title>
        <meta name="description" content="Chat with friends and family" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.root}>
        <Navbar />
        <div className={styles.bannerWrapper}>
          <div className={styles.bannerMessage}>
            <h1>LetsChat</h1>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga
              deserunt reiciendis porro. Voluptatibus
            </p>
            <form autoComplete="off">
              {!verificationId ? (
                <PhoneInput
                  className={styles.phoneInput}
                  placeholder="Enter phone number"
                  value={number}
                  onChange={setNumber}
                  autoComplete="off"
                />
              ) : (
                <input
                  type="text"
                  name="verify-otp"
                  aria-label="Enter OTP"
                  placeholder="Enter OTP"
                  onChange={({ target }) => setOtp(target.value)}
                />
              )}

              <input type="hidden" id="recaptcha-container" ref={captchaRef} />
              {!loading ? (
                <button
                  type="button"
                  onClick={verificationId ? handleVerifyOtp : handleRegister}
                  disabled={verificationId ? otp === "" : number === ""}
                >
                  {verificationId ? "Verify" : "Get Started"}
                </button>
              ) : (
                <div className={styles.loader}>
                  <CircularProgress
                    color="primary"
                    className={styles.progress}
                  />
                </div>
              )}
            </form>
          </div>
          <div className={styles.bannerImg}>
            <img src="/images/banner.jpg" />
          </div>
        </div>
      </main>
    </>
  );
}
