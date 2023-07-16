import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "antd";
import "./Login.css";

const Login = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const signIn = () => {
    signInWithPopup(auth, provider)
      .then(() => navigate("/"))
      .catch((err) => alert(err.message));
  };

  return (
    <div className="Login">
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>User: Loading...</span>}
      {user && <Navigate to="/" />}
      <Button onClick={signIn}>Sign in</Button>
    </div>
  );
};

export default Login;
