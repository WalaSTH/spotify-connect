import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import HomePage from "../components/HomePage";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useEffect, useState } from "react";
import CreateRoom from "../components/CreateRoom";
import Room from "../components/Room";

export default function RoutesWrapper({ navigate }) {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));
  const [userInRoom, setUserInRoom] = useState(
    localStorage.getItem("userInRoom")
  );
  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
    setUserInRoom(localStorage.getItem("userInRoom"));
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            userID={userId}
            navigate={navigate}
            userInRoom={userInRoom}
          />
        }
      />
      <Route
        path="/sign-up"
        element={userId ? <Navigate to="/" /> : <SignUp navigate={navigate} />}
      />
      <Route
        path="/login"
        element={userId ? <Navigate to="/" /> : <Login navigate={navigate} />}
      />
      <Route
        path="/create-room"
        element={
          userId ? (
            <CreateRoom userID={userId} navigate={navigate} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/room"
        element={
          userId ? (
            <Room userID={userId} navigate={navigate} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}
