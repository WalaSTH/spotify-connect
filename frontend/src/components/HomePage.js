import { Grid, Typography, Button, ButtonGroup, Box } from "@mui/material";
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

export default function HomePage({ navigate, userID }) {
  const [userId, setUserId] = useState(userID);

  useEffect(() => {
    setUserId(localStorage.getItem("userID"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserId(null);
    navigate("/");
  };

  const renderHomePage = () => {
    return (
      <div>
        <Grid container spacing={3} align="center">
          <Grid item xs={12}>
            <Typography variant="h3" component="h3">
              Spotify Connect
            </Typography>
          </Grid>
          {!userId && (
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
          {userId && (
            <Grid container spacing={3} align="center">
              <Grid item xs={12}>
                <ButtonGroup
                  disableElevation
                  variant="contained"
                  color="primary"
                >
                  <Button color="primary" to="/create-room" component={Link}>
                    Create a Room
                  </Button>
                  <Button
                    color="secondary"
                    to="/"
                    component={Link}
                    onClick={handleLogout}
                  >
                    Log Out
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          )}
        </Grid>
      </div>
    );
  };

  return renderHomePage();
}
