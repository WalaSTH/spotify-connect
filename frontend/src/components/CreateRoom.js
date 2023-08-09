import { Grid, Typography, Button, ButtonGroup, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
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

export default function CreateRoom({ navigate, userID }) {
  const [userId, setUserId] = useState(userID);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
    authenticateSpotify(userId);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
    navigate("/");
  };

  async function authenticateSpotify(userId) {
    await axios
      .get("/api/is-authenticated" + "?user_id=" + userId)
      .then(async function (data) {
        setSpotifyAuthenticated(data.data.status);
        if (!data.data.status) {
          await axios
            .get("/api/get-auth-url" + "?user_id=" + userId)
            .then((data) => {
              window.location.replace(data.data.url);
            });
        }
      });
  }

  const renderCreateRoom = () => {
    return (
      <div>
        <Grid container spacing={3} align="center">
          <Grid item xs={12}>
            <Typography variant="h3" component="h3">
              Create Room
            </Typography>
          </Grid>
          <Grid container spacing={3} align="center">
            <Grid item xs={12}>
              <ButtonGroup disableElevation variant="contained" color="primary">
                <Button color="primary" component={Link}>
                  Room
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  };

  return renderCreateRoom();
}
