import React from "react";
import { useIdToken } from "react-firebase-hooks/auth";
import { BrowserRouter as Router } from "react-router-dom";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase";
import Dashboard from "@containers/Dashboard";
import Login from "@pages/Login";
import Create from "@containers/Create";
import Insight2 from "@components/Insight2";
import "./App.css";
import Canvas from "@pages/Canvas";

const App = () => {
  const [user, loading, error] = useIdToken(auth);

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  return (
    <Router>
      {!loading && !user && <Navigate to={`/login${location.pathname}`} />}
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="*" element={<Dashboard />} />
            <Route path="/login/:url" element={<Login />} />
            <Route path="/create/*" element={<Create />} />
            <Route path="/canvas/:canvasId" element={<Canvas />} />
            <Route path="/insight2/*" element={<Insight2 />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
};

export default App;
