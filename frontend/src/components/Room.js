import * as React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Checkbox from "@mui/material/Checkbox";
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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import userInRoomEndpoint from "../static/endpoints";
import MusicPlayer from "./MusicPlayer";

export default function Room({ userID, navigate, userInRoom }) {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userInsideRoom, setUserInsideRoom] = useState(false);
  const [song, setSong] = useState({});
  const [songPlaying, setSongPlaying] = useState(true);

  useEffect(() => {
    getRoomData(userID);
    authenticateSpotify(userID);
  }, []);

  let interval;
  useEffect(() => {
    interval = setInterval(pull, 1000);
  });

  const pull = () => {
    getRoomData(userID);
    getCurrentSong(userID);
  };

  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  });

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
        setSong(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const setRoomInfo = (room) => {
    setRoomCode(room["room_code"]);
    setRoomName(room["room_name"]);
    setUserInsideRoom(true);
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
    await axios
      .post("http://127.0.0.1:8000/api/leave-room", formData)
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        navigate("/");
      });
  }
  const goHome = () => {
    if (!userInsideRoom) {
      navigate("/");
    }
  };
  return (
    <div className="center">
      <Grid container spacing={1} align="center">
        <Grid item xs={12}>
          <Typography variant="h4">{roomName}</Typography>
          <Typography>{roomCode}</Typography>
        </Grid>
        <Grid item xs={12}>
          <MusicPlayer
            align="center"
            song={song}
            songPlaying={songPlaying}
            userID={userID}
          />
        </Grid>
        <Grid item xs={12}>
          <Button color="secondary" component={Link} onClick={leaveRoom}>
            Lave Room
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
