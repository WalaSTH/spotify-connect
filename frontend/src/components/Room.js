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
  createSearchParams,
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
  Container,
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

//Settings
import SettingsIcon from "@mui/icons-material/Settings";
import CreateRoom from "../components/CreateRoom";
import CreateRoomForm from "./CreateRoomForm";

export default function Room({
  userID,
  navigate,
  userInRoom,
  song,
  queue,
  favorite,
  setFavorite,
  isHost,
}) {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [settings, setSettings] = useState(false);

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

  const setRoomInfo = (room) => {
    setRoomCode(room["room_code"]);
    setRoomName(room["room_name"]);
    getRoomAvatar(room["room_code"]);
  };

  async function getRoomAvatar(roomCode) {
    await axios
      .get("api/get-room-avatar" + "?room_code=" + roomCode)
      .then((response) => {
        setUserAvatar(response.data.image);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getRoomData(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/get-room" + "?id=" + userID)
      .then((response) => {
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
  const changeRoomSettings = (value) => {
    setSettings(value);
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: "200px",
      }}
    >
      {settings && (
        <Grid>
          <CreateRoom
            userID={userID}
            navigate={navigate}
            csrf={csrf}
            update={true}
            closefun={() => {
              changeRoomSettings(false);
            }}
          />
        </Grid>
      )}

      {!settings && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="flex-start"
          className="center"
          sx={{
            marginTop: 10,
          }}
        >
          <Grid item name="Player and search">
            <Grid item xs={12} align="center" justifyContent="center">
              <Grid item xs={12} justifyContent="center">
                {!song.no_song && <Search userID={userID}></Search>}
              </Grid>
              <Grid item xs={9}>
                <MusicPlayer
                  align="center"
                  song={song}
                  songPlaying={true}
                  userID={userID}
                  syncFunction={syncButton}
                  favorite={favorite}
                  setFavorite={setFavorite}
                  csrf={csrf}
                  isHost={isHost}
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
              <Grid item xs={12}>
                <Button
                  color="secondary"
                  component={Link}
                  onClick={() => {
                    changeRoomSettings(true);
                  }}
                  sx={{
                    color: "black",

                    borderColor: "green",
                  }}
                >
                  <SettingsIcon></SettingsIcon>
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {!song.no_song && (
            <Grid item name="Queue" xs={3}>
              <CommingNext
                queue={queue}
                song={song}
                userID={userID}
              ></CommingNext>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}

{
  /*       <Grid
        container
        spacing={3}
        justifyContent={"center"}
        alignItems={"center"}
        direction="column"
      >
        <Grid item xs={0}>
          <Typography variant="h3">{roomName}</Typography>
        </Grid>
        <Grid item xs={0}>
          <Avatar src={userAvatar} sx={{ width: 150, height: 150 }}></Avatar>
        </Grid>
      </Grid> */
}
