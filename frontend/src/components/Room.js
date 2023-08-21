import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Checkbox from "@mui/material/Checkbox";
import Cookies from "js-cookie";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Redirect,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  Button,
  Grid,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Switch,
  Box,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import userInRoomEndpoint from "../static/endpoints";
import MusicPlayer from "./MusicPlayer";
import Search from "./singles/MusicSearch";
import CommingNext from "./singles/CommingNext";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//Sync
import ContactlessIcon from "@mui/icons-material/Contactless";
import WifiProtectedSetupOutlinedIcon from "@mui/icons-material/WifiProtectedSetupOutlined";
import RssFeedOutlinedIcon from "@mui/icons-material/RssFeedOutlined";
import ContactlessOutlinedIcon from "@mui/icons-material/ContactlessOutlined";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import LeakAddIcon from "@mui/icons-material/LeakAdd";

export default function Room({ userID, navigate, userInRoom, song, queue }) {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");

  const csrf = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFTOKEN": Cookies.get("csrftoken"),
    },
  };

  useEffect(() => {
    getRoomData(userID);
    //authenticateSpotify(userID);
  }, []);

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

  async function getCurrentSong(userID) {
    console.log("Getting Song");
    await axios
      .get("http://127.0.0.1:8000/api/current-song" + "?user_id=" + userID)
      .then((response) => {
        console.log(response.data);
        //setSong(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const setRoomInfo = (room) => {
    setRoomCode(room["room_code"]);
    setRoomName(room["room_name"]);
  };
  async function getRoomData(userID) {
    console.log("GETTING DATA");
    await axios
      .get("http://127.0.0.1:8000/api/get-room" + "?id=" + userID)
      .then((response) => {
        console.log("GETTING DATA");
        if (response.status == 200) {
          setRoomInfo(response.data.room);
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        navigate("/");
      });
  }

  async function leaveRoom() {
    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("csrfmiddlewaretoken", "{{csrf_token}}");
    await axios
      .post("api/leave-room", formData, csrf)
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        navigate("/");
      });
  }
  async function syncButton() {
    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("track_id", song.id);
    formData.append("position", song.time);
    await axios
      .post("http://127.0.0.1:8000/api/sync", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      className="center2"
    >
      <Grid item name="Player and search">
        <Grid item xs={12} align="center" justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h4">{roomName}</Typography>
          </Grid>
          <Grid item xs={12} justifyContent="center">
            <Search userID={userID}></Search>
          </Grid>
          <Grid item xs={9}>
            <MusicPlayer
              align="center"
              song={song}
              songPlaying={true}
              userID={userID}
              syncFunction={syncButton}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              color="secondary"
              component={Link}
              onClick={leaveRoom}
              sx={{
                color: "black",

                borderColor: "green",
              }}
            >
              <ExitToAppIcon></ExitToAppIcon>
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item name="Queue" xs={3}>
        <CommingNext queue={queue} song={song} userID={userID}></CommingNext>
      </Grid>
    </Grid>
  );
}
