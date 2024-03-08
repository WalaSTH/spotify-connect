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
  Alert,
  AlertTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import userInRoomEndpoint from "../static/endpoints";
import MusicPlayer from "./MusicPlayer";
import Search from "./singles/MusicSearch";
import CommingNext from "./singles/CommingNext";
import DefaultChatMsg from "./singles/DefaultChatMsg";
import LinkIcon from "@mui/icons-material/Link";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ContactlessIcon from "@mui/icons-material/Contactless";
import WifiProtectedSetupOutlinedIcon from "@mui/icons-material/WifiProtectedSetupOutlined";
import RssFeedOutlinedIcon from "@mui/icons-material/RssFeedOutlined";
import ContactlessOutlinedIcon from "@mui/icons-material/ContactlessOutlined";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import LeakAddIcon from "@mui/icons-material/LeakAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import CreateRoom from "../components/CreateRoom";
import CreateRoomForm from "./CreateRoomForm";
import Chatbox from "./singles/ChatboxTwo";
import UserList from "./UserList";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import InfoIcon from "@mui/icons-material/Info";

import * as endpoints from "./../static/endpoints";
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
  const [showUsers, setShowUsers] = useState(false);
  const [noActiveDevice, setNoActiveDevice] = useState(false);
  const [avatars, setAvatars] = useState({});
  const [miniMenu, setMiniMenu] = useState(false);
  const [msgArray, setMsgArray] = useState([
    /*     { user: "Navi", msg: "Hey, listen", avatar: AVATAR_FST },
    { user: "Navi", msg: "if you hold Z", avatar: AVATAR_FST },
    { user: "Navi", msg: "you can target your enemy", avatar: AVATAR_FST },
    { user: "Link", msg: "I already knew that", avatar: AVATAR_SND },
    { user: "Navi", msg: "Oh, ok", avatar: AVATAR_FST },
    {
      user: "Link",
      msg: "And next time you want to talk to me about the stupidest things please just forget it and don't make me waste my time.",
      avatar: AVATAR_SND,
    },
    { user: "Link", msg: "Thanks", avatar: AVATAR_SND }, */
  ]);
  const csrf = {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFTOKEN": Cookies.get("csrftoken"),
    },
  };
  const useIsMediumScreen = () => {
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));
    return isMediumScreen;
  };
  const isMediumScreen = useIsMediumScreen();
  const [musicPlayerSize, setMusicPlayerSize] = useState({
    width: 0,
    height: 0,
  });
  const musicPlayerRef = useRef(null);
  useEffect(() => {
    if (musicPlayerRef.current) {
      const { width, height } = musicPlayerRef.current.getBoundingClientRect();
      setMusicPlayerSize({ width, height });
    }
  });

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
    //getRoomAvatar(room["room_code"]);
    setRoom(room);
    const chatSocket = new WebSocket(
      `ws://spotifyconnect.verymad.net/ws/${room["room_code"]}/${userID}/`
    );
    //`ws://localhost:8000/ws/${room["room_code"]}/${userID}/`
    setSocket(chatSocket);
  };

  async function getRoomAvatar(roomCode) {
    await axios
      .get(
        endpoints.BASE_BACKEND +
          "/api/get-room-avatar" +
          "?room_code=" +
          roomCode
      )
      .then((response) => {
        setUserAvatar(response.data.image);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getAvatar(username) {
    await axios
      .get(
        endpoints.BASE_BACKEND +
          "/api/get-avatar" +
          "?user_id=" +
          userID +
          "&username=" +
          username
      )
      .then((response) => {
        const avatars_obj = avatars;
        avatars_obj[username] = response.data.Data.images[0].url;
        setAvatars(avatars_obj);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function getRoomData(userID) {
    await axios
      .get(endpoints.BASE_BACKEND + "/api/get-room" + "?id=" + userID)
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
      .post(endpoints.BASE_BACKEND + "/api/leave-room", formData, csrf)
      .then((response) => {
        navigate("/");
      })
      .catch((error) => {
        navigate("/");
      });
  }
  async function syncButton() {
    setNoActiveDevice(false);
    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("track_id", song.id);
    formData.append("position", song.time);
    await axios
      .post(endpoints.BASE_BACKEND + "/api/sync", formData)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        const reason = JSON.parse(error.response.data.Msg).error.reason;
        if (reason == "NO_ACTIVE_DEVICE") {
          setNoActiveDevice(true);
        }
      });
  }
  const changeRoomSettings = (value) => {
    setSettings(value);
    if (value) {
      setShowUsers(false);
    }
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
          spacing={10}
        >
          <Grid
            item
            xs={isMediumScreen ? 6 : 12}
            align="center"
            justifyContent="center"
          >
            <Grid container spacing={4} justifyContent="center">
              {noActiveDevice && (
                <Alert
                  className=""
                  severity="warning"
                  sx={{ width: 320 }}
                  onClose={() => {
                    setNoActiveDevice(false);
                  }}
                >
                  <AlertTitle> No Device Found!</AlertTitle>
                  Open Spotify, start playing something and try again!
                  <Grid
                    container
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item>
                      <Button
                        color="inherit"
                        size="small"
                        href="https://open.spotify.com/"
                        target="_blank"
                      >
                        Open Spotify
                        <LinkIcon></LinkIcon>
                      </Button>
                    </Grid>
                  </Grid>
                </Alert>
              )}
              <Grid item xs={12} ref={musicPlayerRef}>
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
              <Grid item xs={12}>
                <Chatbox
                  msgArray={msgArray}
                  setMsgArray={setMsgArray}
                  socket={socket}
                  sessionUser={username}
                  getAvatar={getAvatar}
                  avatars={avatars}
                ></Chatbox>
              </Grid>
            </Grid>
          </Grid>

          {!song.no_song && (
            <Grid
              item
              name="Queue"
              xs={isMediumScreen ? 4 : 12}
              sx={{ minWidth: 400 }}
            >
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
                musicPlayerSize={musicPlayerSize}
              ></CommingNext>
            </Grid>
          )}
        </Grid>
      )}
      {!settings && (
        <Grid
          container
          direction="column"
          justifyContent="flex-end"
          alignItems="flex-end"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
          }}
          spacing={0.5}
        >
          {(miniMenu || isMediumScreen) && (
            <div>
              <Grid item>
                <Button
                  color="secondary"
                  style={{ backgroundColor: colors.buttonThird }}
                  component={Link}
                  onClick={() => {
                    setShowUsers(!showUsers);
                  }}
                  sx={{
                    color: "black",

                    borderColor: "green",
                  }}
                >
                  Users
                  <PeopleAltIcon></PeopleAltIcon>
                </Button>
              </Grid>
              {isHost && (
                <Grid item>
                  <Button
                    color="secondary"
                    style={{ backgroundColor: colors.buttonSecond }}
                    component={Link}
                    onClick={() => {
                      changeRoomSettings(true);
                    }}
                    sx={{
                      color: "black",

                      borderColor: "green",
                    }}
                  >
                    Settings
                    <SettingsIcon></SettingsIcon>
                  </Button>
                </Grid>
              )}

              <Grid item>
                <Button
                  style={{
                    backgroundColor: isMediumScreen
                      ? colors.buttonPrim
                      : colors.buttonFourth,
                  }} //
                  color="secondary"
                  component={Link}
                  onClick={leaveRoom}
                  sx={{
                    color: "black",

                    borderColor: "green",
                  }}
                >
                  Leave Room
                  <ExitToAppIcon></ExitToAppIcon>
                </Button>
              </Grid>
            </div>
          )}
          {!isMediumScreen && (
            <Grid item sx={{}}>
              <Button
                component={Link}
                onClick={() => {
                  if (miniMenu) {
                    setShowUsers(false);
                  }
                  setMiniMenu(!miniMenu);
                }}
                sx={{
                  color: "black",
                }}
              >
                <InfoIcon></InfoIcon>
              </Button>
            </Grid>
          )}
        </Grid>
      )}
      {showUsers && !settings && (miniMenu || isMediumScreen) && (
        <UserList
          isMediumScreen={isMediumScreen}
          userId={userID}
          isHost={isHost}
          csrf={csrf}
          currentUser={username}
          avatars={avatars}
          getAvatar={getAvatar}
        ></UserList>
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
