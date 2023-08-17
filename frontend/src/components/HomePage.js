import {
  Grid,
  Typography,
  Button,
  ButtonGroup,
  Box,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import JoinCodeCard from "./singles/JoinCode";
import axios from "axios";

export default function HomePage({ navigate, userID, userInsideRoom }) {
  const [joinCode, setJoinCode] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [userId, setUserId] = useState(userID);
  const [userInRoom, setUserInRoom] = useState(userInsideRoom);

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
  }, []);

  useEffect(() => {
    if (userID) checkUserInRoom(userID);
  });
  async function checkUserInRoom(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/get-room" + "?id=" + userID)
      .then((response) => {
        if (response.status == 200) {
          setUserInRoom(true);
        } else {
          setUserInRoom(false);
        }
      })
      .catch((error) => {
        setUserInRoom(false);
      });
  }
  const renderHomePage = () => {
    return (
      <div>
        <Grid container spacing={3} align="center" className="center">
          <Grid item xs={12}>
            <Typography variant="h3" component="h3">
              Spotify Connect
            </Typography>
            {userInRoom && userID && (
              <div>
                <Typography variant="h5" component="h5">
                  Currently in a Room
                </Typography>

                <Button to="/room" component={Link}>
                  Go to room
                </Button>
              </div>
            )}
          </Grid>
          <Grid item xs={12}>
            {!userID && (
              <Grid container spacing={3} align="center">
                <Grid item xs={12}>
                  <ButtonGroup
                    disableElevation
                    variant="contained"
                    color="primary"
                  >
                    <Button color="primary" to="/sign-up" component={Link}>
                      Sign Up
                    </Button>
                    <Button color="secondary" to="/login" component={Link}>
                      Log In
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            )}
            {userID && (
              <Grid container spacing={1} align="center">
                <Grid item xs={12}>
                  <ButtonGroup
                    disableElevation
                    variant="contained"
                    color="primary"
                  >
                    {!userInRoom && (
                      <Button
                        color="primary"
                        to="/create-room"
                        component={Link}
                      >
                        Create a Room
                      </Button>
                    )}

                    {!joinCode && (
                      <Button
                        color="secondary"
                        variant="contained"
                        component={Link}
                        onClick={() => {
                          setJoinCode(true);
                        }}
                      >
                        Join Room With Code
                      </Button>
                    )}
                  </ButtonGroup>
                </Grid>

                {joinCode && (
                  <Grid item xs={12}>
                    <JoinCodeCard
                      navigate={navigate}
                      userID={userID}
                      active={joinCode}
                      callback={() => {
                        setJoinCode(false);
                      }}
                    ></JoinCodeCard>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        </Grid>
        <div></div>
      </div>
    );
  };

  return renderHomePage();
}
