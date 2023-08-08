import { Grid, Typography, Button, ButtonGroup } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";

export default function HomePage({ userId }) {
  const renderHomePage = () => {
    localStorage.clear();
    return (
      <div>
        <Grid container spacing={3} align="center">
          <Grid item xs={12}>
            <Typography variant="h3" component="h3">
              Spotify Connect
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup disableElevation variant="contained" color="primary">
              <Button color="primary" to="/sign-up" component={Link}>
                Sign Up
              </Button>
              <Button color="secondary" to="/login" component={Link}>
                Log In
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </div>
    );
  };

  return renderHomePage();
}
