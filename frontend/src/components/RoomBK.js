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
import DefaultChatMsg from "./singles/DefaultChatMsg";

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
import Chatbox from "./singles/ChatboxTwo";
import * as colors from "./../static/colors";
const AVATAR_FST =
  "https://upload.wikimedia.org/wikipedia/en/0/04/Navi_%28The_Legend_of_Zelda%29.png";
const AVATAR_SND =
  "https://64.media.tumblr.com/390f64100e5173270c662662e0a264d6/b7390dc2f583fc49-95/s400x600/67ad7eca9154f02c5f28d7ddbdb7b35d9fb9f30e.png";
const AVATAR_USER =
  "https://static.wikia.nocookie.net/zelda_gamepedia_en/images/1/1c/Saria.jpg/revision/latest?cb=20070126013259";
export default function Room({
  userID,
  username,
  navigate,
  userInRoom,
  song,
  queue,
  setQueue,
  userQueue,
  setUserQueue,
  favorite,
  setFavorite,
  isHost,
  setPopped,
  getQueue,
}) {
  const [roomCode, setRoomCode] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState({});
  const [userAvatar, setUserAvatar] = useState("");
  const [settings, setSettings] = useState(false);
  const [message, setMessage] = useState("");
  const [messageGot, setMessageGot] = useState("");
  const [socket, setSocket] = useState({});
  const [msgArray, setMsgArray] = useState([
    { user: "Navi", msg: "Hey, listen", avatar: AVATAR_FST },
    { user: "Navi", msg: "if you hold Z", avatar: AVATAR_FST },
    { user: "Navi", msg: "you can target your enemy", avatar: AVATAR_FST },
    { user: "Link", msg: "I already knew that", avatar: AVATAR_SND },
    { user: "Navi", msg: "Oh, ok", avatar: AVATAR_FST },
    {
      user: "Link",
      msg: "And next time you want to talk to me about the stupidest things please just forget it and don't make me waste my time.",
      avatar: AVATAR_SND,
    },
    { user: "Link", msg: "Thanks", avatar: AVATAR_SND },
  ]);
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

  socket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if (data["code"] == "chat") {
      setMessageGot(messageGot + "\n" + data["message"]);
      const newMessage = {
        user: data["user"],
        msg: data["message"],
        avatar: data["avatar"],
      };
      setMsgArray([...msgArray, newMessage]);
    } else if (data["code"] == "queue") {
      getQueue(userID);
    } else if (data["code"] == "settings") {
      getRoomData(userID);
    }
  };
  socket.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
  };
  const setRoomInfo = (room) => {
    setRoomCode(room["room_code"]);
    setRoomName(room["room_name"]);
    getRoomAvatar(room["room_code"]);
    setRoom(room);
    const chatSocket = new WebSocket(
      `ws://localhost:8000/ws/${room["room_code"]}/`
    );
    setSocket(chatSocket);
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
    <div>
      {settings && (
        <Grid>
          <CreateRoom
            userID={userID}
            navigate={navigate}
            csrf={csrf}
            update={true}
            closefun={() => {
              changeRoomSettings(false);
              socket.send(
                JSON.stringify({
                  type: "chat_message",
                  user: "sessionUser",
                  message: "queue_message",
                  avatar: "AVATAR_USER",
                  code: "settings",
                })
              );
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
          sx={{
            marginTop: 0,
          }}
          spacing={1}
        >
          <Grid item name="Player and chat">
            <Grid item xs={12} align="center" justifyContent="center">
              <Grid item xs={9}>
                <Typography>{}</Typography>
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
                  setPopped={setPopped}
                  room={room}
                />
              </Grid>
              <Grid item xs={9}>
                <Chatbox
                  msgArray={msgArray}
                  setMsgArray={setMsgArray}
                  socket={socket}
                  sessionUser={username}
                ></Chatbox>
              </Grid>
            </Grid>
          </Grid>
          {!song.no_song && (
            <Grid item name="Queue" xs={3.5} sx={{ minWidth: 400 }}>
              <CommingNext
                queue={queue}
                userQueue={userQueue}
                song={song}
                userID={userID}
                socket={socket}
                isHost={isHost}
                csrf={csrf}
                room={room}
                guestManage={room["guest_manage_queue"]}
              ></CommingNext>
            </Grid>
          )}
        </Grid>
      )}
    </div>
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
