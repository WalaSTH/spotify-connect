import * as React from "react";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import {
  Button,
  Tooltip,
  Fade,
  Box,
  Grid,
  Typography,
  Avatar,
  Card,
  TextField,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Alert,
  AlertTitle,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

import Marquee from "react-fast-marquee";

//Icons
import PauseIcon from "@mui/icons-material/Pause";
import QueueIcon from "@mui/icons-material/Queue";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import PlayCircle from "@mui/icons-material/PlayCircle";
import PasswordIcon from "@mui/icons-material/Password";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import IconButton from "@mui/material/IconButton";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";

//Local
import equalizer from "./equaliser.gif";
import * as colors from "./../static/colors";

const joinRoomUrl = "http://127.0.0.1:8000/api/join-room";

export default function RoomsLobby({ userId, navigate }) {
  const [roomsList, setRoomsList] = useState([]);
  const [songList, setSongList] = useState([]);
  const [inputPassword, setInputPassword] = useState(-1);
  const [password, setPassword] = useState("");
  const [badPassword, setBadPassword] = useState(false);
  const [alreadyInRoom, setAlreadyInRoom] = useState(false);

  const rows: GridRowsProp = [
    { id: 1, col1: "Hello", col2: "World" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome" },
    { id: 3, col1: "MUI", col2: "is Amazing" },
  ];

  async function handleEnterRoom(roomCode, password) {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("room_code", roomCode);
    formData.append("room_password", password);
    await axios
      .post(joinRoomUrl, formData)
      .then(() => {
        navigate("/room");
      })
      .catch((error) => {
        console.log(error);
        const errorMsg = error.response.data.Msg;
        if (errorMsg === "Wrong password") {
          setBadPassword(true);
          console.log("BAD PASSWORD");
        }
      });
  }

  async function getSong(songId) {
    const response = await fetch(
      "http://127.0.0.1:8000/api/get-song" +
        "?user_id=" +
        userId +
        "&song_id=7sXEP1EMj0HrmfSSd5hOjH"
    );
    const data = await response.json();
    return data;

    await axios
      .get(
        "http://127.0.0.1:8000/api/get-song" +
          "?user_id=" +
          userId +
          "&song_id=" +
          songId
      )
      .then((response) => {
        console.log(response.data.Data["title"]);
        return response.data.Data;
      })
      .catch((error) => {
        console.log(error);
      });
  }
  async function loadData() {
    try {
      // Get rooms
      const initialData = await getRooms(userId);
      // Fetch song for every row
      console.log("THE SONG IS");
      console.log(initialData);
      for (let i = 0; i < initialData["Data"].length; i++) {
        let songData = {};
        if (initialData["Data"][i].current_song != null) {
          //songData = await getSong(initialData["Data"][i].current_song);
          console.log("Song parsed is");
          console.log(songData);
        }
        //initialData["Data"][i].current_song = songData;
      }
      console.log(initialData["Data"]);
      setRoomsList(initialData["Data"]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const columns: GridColDef[] = [
    { field: "room_name", headerName: "Room Name", width: 150 },
    {
      field: "current_song",
      headerName: "Currenty Playing",
      minWidth: 270,
      type: "actions",
      renderCell: (params) => {
        const song = params.row.current_song;
        return (
          <div>
            {song && (
              <Box>
                <Card>
                  <Grid
                    marginLeft={0}
                    container
                    spacing={1}
                    alignItems={"center"}
                  >
                    <Grid item>
                      <Avatar
                        src={song.image_url || "none"}
                        sx={{
                          color: "#fff",
                          marginBottom: "0px",
                          width: 70,
                          height: 70,
                          borderRadius: 0,
                        }}
                      />
                    </Grid>
                    <Grid item>
                      {song.title.length <= 20 && (
                        <Grid item>
                          <Typography
                            variant="body1"
                            align="left"
                            color={colors.miniplayerText}
                            noWrap
                            sx={{
                              width: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {song.title}
                          </Typography>
                        </Grid>
                      )}
                      {song.title.length > 20 && (
                        <Marquee
                          speed={20}
                          style={{ maxWidth: 150 }}
                          autoFill={false}
                        >
                          <Typography
                            align="left"
                            color={colors.miniplayerText}
                          >
                            {song.title + "‎ ‎ ‎ ‎‎ ‎ ‎ ‎ "}
                          </Typography>
                        </Marquee>
                      )}
                      <Grid item>
                        <Typography
                          variant="body2"
                          align="left"
                          color="#808080"
                          noWrap
                          sx={{
                            width: 150,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {song.artist}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Card>
              </Box>
            )}
          </div>
        );
      },
    },
    { field: "user_count", headerName: "Users", width: 150 },
    {
      field: "permissions",
      headerName: "Permissions",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row.permissions.includes("Play/Pause") && (
              <Tooltip
                title="Play/Pause"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                enterNextDelay={500}
              >
                <PauseIcon></PauseIcon>
              </Tooltip>
            )}
            {params.row.permissions.includes("Skip") && (
              <Tooltip
                title="Skip"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                enterNextDelay={500}
              >
                <SkipNextIcon></SkipNextIcon>
              </Tooltip>
            )}
            {params.row.permissions.includes("Add Queue") && (
              <Tooltip
                title="Add to Queue"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                enterNextDelay={500}
              >
                <QueueIcon></QueueIcon>
              </Tooltip>
            )}
            {params.row.permissions.includes("Manage Queue") && (
              <Tooltip
                title="Manage Queue"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                enterNextDelay={500}
              >
                <QueueMusicIcon></QueueMusicIcon>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      field: "private_room",
      headerName: "Private",
      width: 150,
      renderCell: (params) => {
        return params.row.private_room ? (
          <>
            <LockIcon />
          </>
        ) : (
          <>
            <LockOpenIcon />
          </>
        );
      },
    },
    {
      field: "col6",
      headerName: "Join",
      width: 150,
      type: "actions",
      renderCell: (params) => {
        return (
          <div>
            {!params.row.private_room && (
              <IconButton
                onClick={() => {
                  handleEnterRoom(params.row.room_code, "");
                }}
              >
                <LoginIcon></LoginIcon>
              </IconButton>
            )}
            {params.row.private_room && (
              <IconButton
                onClick={() => {
                  setInputPassword(params.row.id);
                }}
                //onMouseOutCapture={() => setInputPassword(-1)}
              >
                {inputPassword != params.row.id && (
                  <PasswordIcon></PasswordIcon>
                )}
              </IconButton>
            )}
            {inputPassword == params.row.id && (
              <div>
                <Grid container>
                  <Grid item>
                    <OutlinedInput
                      id="password"
                      type={"password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                      endAdornment={
                        <InputAdornment position="end"></InputAdornment>
                      }
                    />
                  </Grid>
                  <Grid item>
                    <IconButton
                      onClick={() => {
                        setPassword("");
                        setInputPassword(-1);
                        setBadPassword(false);
                      }}
                    >
                      <CloseIcon></CloseIcon>
                    </IconButton>
                  </Grid>
                  <IconButton
                    onClick={() => {
                      handleEnterRoom(params.row.room_code, password);
                    }}
                  >
                    <LoginIcon></LoginIcon>
                  </IconButton>
                </Grid>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  async function getRooms(userId) {
    const response = await fetch("api/get-rooms" + "?user_id=" + userId);
    const data = await response.json();
    return data;

    await axios
      .get("api/get-rooms" + "?user_id=" + userId)
      .then((response) => {
        return response.data["Data"];
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function setSongs(room) {
    const newRoom = room;
    newRoom.current_song = getSong(room.current_song);
    return newRoom;
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <Button onClick={() => getRooms(userId)}></Button>
      {badPassword && (
        <Alert
          className="alert"
          severity="error"
          sx={{ width: 350 }}
          onClose={() => {
            setBadPassword(false);
            setPassword("");
          }}
        >
          <AlertTitle>Oops</AlertTitle>
          <strong>Wrong password</strong>
        </Alert>
      )}
      <div style={{ width: "80%" }} className="center">
        <DataGrid
          rows={roomsList}
          getRowHeight={() => "auto"}
          columns={columns}
          sx={{ marginLeft: 20 }}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10]}
        />
      </div>
    </div>
  );
}
