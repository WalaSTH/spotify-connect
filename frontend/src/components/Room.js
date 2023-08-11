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

export default function Room({ userID, navigate }) {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {}, []);

  async function authenticateSpotify(userID) {
    await axios
      .get("/api/is-authenticated" + "?user_id=" + userID)
      .then(async function (data) {
        console.log(data.data.status[0]);
        if (!data.data.status[0]) {
          await axios
            .get("/api/get-auth-url" + "?user_id=" + userID)
            .then((data) => {
              window.location.replace(data.data.url);
            });
        }
      });
  }
  useEffect(() => {
    checkUserInRoom(userID).then(authenticateSpotify(userID));
    getRoomInfo(roomCode, userID);
  }, []);

  const setRoomInfo = (room) => {
    setRoomCode(room["room_code"]);
    setRoomName(room["room_name"]);
  };
  async function checkUserInRoom(userID) {
    await axios
      .get("http://127.0.0.1:8000/api/get-room" + "?id=" + userID)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data.room);
          setRoomInfo(response.data.room);
        } else {
          navigate("/create-room");
        }
      })
      .catch((error) => {
        console.log(error);
        navigate("/");
      });
  }
  async function getRoomInfo(roomCode, userID) {}
  return (
    <div className="center">
      <Grid container spacing={12}>
        <Grid item xs={3}>
          <Typography variant="h4">{roomName}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}
