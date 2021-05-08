import React from "react";
import useAuth from "../hooks/use-auth";
const authContext = React.createContext();

const useAuthContext = () => React.useContext(authContext);

const AuthProvider = ({ value, children }) => {
  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

export { useAuthContext };
export default AuthProvider;
