import React, { useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, provider } from "../../firebase";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "antd";
import { db } from "../../firebase";
import "./Login.css";

const Login = () => {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (!user) return;
    setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      { merge: true }
    );
    navigate("/");
  }, [user, loading]);

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
