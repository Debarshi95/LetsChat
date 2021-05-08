import { ToastProvider } from "react-toast-notifications";
import useAuth from "../hooks/use-auth";
import AuthProvider from "../providers/auth-provider";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const auth = useAuth();
  return (
    <AuthProvider value={auth}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default MyApp;
