import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import "./App.css";

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      {!user && <Navigate to="/login" />}
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
};

export default App;
