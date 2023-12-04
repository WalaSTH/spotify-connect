import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import CreateRoomForm from "./CreateRoomForm";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CreateRoom({ userID, navigate, update, closefun }) {
  const [room, setRoom] = useState({
    guest_pause: false,
    room_name: "",
    guest_add_queue: true,
    guest_manage_queue: false,
    guest_skip: false,
    show_lobby: true,
    private_room: false,
    password: "",
  });
  const [guestPause, setGuestPause] = useState(false);
  useEffect(() => {
    checkUserInRoom(userID).then(() => {
      authenticateSpotify(userID);
    });
  }, []);

  async function checkUserInRoom(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/get-room" + "?id=" + userID)
      .then((response) => {
        console.log(response);
        if (response.status == 200 && update == false) {
          navigate("/room");
        } else if (update) {
          const room = response.data.room;
          setGuestPause(room["guest_pause"]);
          setRoom(room);
          console.log(room);
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/create-room");
      });
  }
  async function authenticateSpotify(userID) {
    await axios
      .get("/api/is-authenticated" + "?user_id=" + userID)
      .then(async function (data) {
        if (!data.data.status[0]) {
          await axios
            .get("/api/get-auth-url" + "?user_id=" + userID)
            .then((data) => {
              window.location.replace(data.data.url);
            });
        }
      });
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Grid item xs={12} align="center">
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
          </Grid>
          {!update && (
            <Typography component="h4" variant="h4" align="center">
              Create Room
            </Typography>
          )}
          {update && (
            <Typography component="h4" variant="h4" align="center">
              Room Settings
            </Typography>
          )}
          <React.Fragment>
            <CreateRoomForm
              userID={userID}
              navigate={navigate}
              update={update}
              closefun={closefun}
              room={room}
              guestPause={guestPause}
            ></CreateRoomForm>
          </React.Fragment>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
