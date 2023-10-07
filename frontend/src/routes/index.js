import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import HomePage from "../components/HomePage";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useEffect, useState } from "react";
import CreateRoom from "../components/CreateRoom";
import Room from "../components/Room";
import axios from "axios";

export default function RoutesWrapper({
  navigate,
  userId,
  song,
  csrftoken,
  queue,
  favorite,
  setFavorite,
  isHost,
  userQueue,
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage userID={userId} navigate={navigate} />}
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
            <CreateRoom
              userID={userId}
              navigate={navigate}
              csrftoken={csrftoken}
              update={false}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/room"
        element={
          userId ? (
            <Room
              userID={userId}
              navigate={navigate}
              song={song}
              csrftoken={csrftoken}
              queue={queue}
              favorite={favorite}
              setFavorite={setFavorite}
              isHost={isHost}
              userQueue={userQueue}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}
