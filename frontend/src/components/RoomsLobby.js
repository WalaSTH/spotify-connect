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
  Checkbox,
  FormControlLabel,
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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SendIcon from "@mui/icons-material/Send";

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
  const [roomToEnter, setRoomToEnter] = useState("");
  const [roomCount, setRoomCount] = useState(0);
  const [sortOptions, setSortOptions] = useState({ field: "", sort: "" });
  const [pageOptions, setPageOptions] = useState({ page: 0, pageSize: 5 });
  const [filterOptions, setFilterOptions] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const rows: GridRowsProp = [
    { id: 1, col1: "Hello", col2: "World" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome" },
    { id: 3, col1: "MUI", col2: "is Amazing" },
  ];

  async function handleEnterRoom(roomCode, password, ask) {
    console.log(ask);
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("room_code", roomCode);
    formData.append("room_password", password);
    if (ask) {
      formData.append("ask_user", ask);
    }
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
          setAlreadyInRoom(false);
          console.log("BAD PASSWORD");
        } else if (errorMsg === "User is in another room") {
          setAlreadyInRoom(true);
          setBadPassword(false);
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
  async function loadData(page, sortField, sortOrder) {
    try {
      // Get rooms
      const initialData = await getRooms(userId, page, sortField, sortOrder);
      // Fetch song for every row
      console.log("THE SONG IS");
      console.log(initialData);
      setRoomCount(initialData["Count"]);
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
                  setRoomToEnter(params.row.room_code);
                  handleEnterRoom(params.row.room_code, "", true);
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
                      ad
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
                      setAlreadyInRoom(false);
                      handleEnterRoom(params.row.room_code, password, false);
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

  async function getRooms(userId, page, sortField, sortOrder) {
    const response = await fetch(
      "api/get-rooms" +
        "?user_id=" +
        userId +
        "&page=" +
        page +
        "&sort_field=" +
        sortField +
        "&sort_order=" +
        sortOrder
    );
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
    loadData(1, "", "");
  }, []);

  return (
    <div>
      {badPassword && (
        <Alert
          className="alert"
          severity="error"
          sx={{ width: 300 }}
          onClose={() => {
            setBadPassword(false);
            setPassword("");
          }}
        >
          <AlertTitle>Oops</AlertTitle>
          <strong>Wrong password</strong>
        </Alert>
      )}
      {alreadyInRoom && (
        <Alert className="alert" severity="warning" sx={{ width: 320 }}>
          <AlertTitle> Alraedy in a room</AlertTitle>
          Enter this room and leave previous?
          <Grid container direction="row" spacing={0}>
            <Grid item>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  handleEnterRoom(roomToEnter, password, false);
                }}
              >
                YES
              </Button>
            </Grid>
            <Grid item>
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setAlreadyInRoom(false);
                }}
              >
                NO
              </Button>
            </Grid>
            <Grid item>
              <Typography variant="caption" display="block" gutterBottom>
                Note: Rooms you host are deleted when leaving
              </Typography>
            </Grid>
          </Grid>
        </Alert>
      )}
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        className="center"
        sx={{
          marginTop: 0,
          marginLeft: 50,
        }}
        spacing={1}
      >
        <Grid item>
          <IconButton onClick={() => setShowFilter(!showFilter)}>
            <FilterAltIcon></FilterAltIcon>
          </IconButton>
        </Grid>
        <Grid item>
          {showFilter && (
            <Card>
              <FormControlLabel label="Play/Pause" control={<Checkbox />} />
              <FormControlLabel label="Skip" control={<Checkbox />} />
              <FormControlLabel label="Add Tracks" control={<Checkbox />} />
              <FormControlLabel label="Move/Remove" control={<Checkbox />} />
              <FormControlLabel label="Private" control={<Checkbox />} />
              <IconButton>
                <SendIcon></SendIcon>
              </IconButton>
            </Card>
          )}
        </Grid>
        <Grid item>
          <div>
            <DataGrid
              rows={roomsList}
              getRowHeight={() => "auto"}
              columns={columns}
              sx={{ marginLeft: 0 }}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              //hideFooterPagination={true}
              paginationMode={"server"}
              sortingMode={"server"}
              rowCount={roomCount}
              onPaginationModelChange={(e) => {
                setPageOptions(e);
                loadData(
                  e["page"] + 1,
                  sortOptions["field"],
                  sortOptions["sort"]
                );
                console.log(e);
              }}
              onSortModelChange={(e) => {
                console.log(e);
                if (e.length == 0) {
                  setSortOptions({ field: "", sort: "" });
                  loadData(pageOptions["page"] + 1, "", "");
                } else {
                  setSortOptions(e[0]);
                  loadData(
                    pageOptions["page"] + 1,
                    e[0]["field"],
                    e[0]["sort"]
                  );
                }
              }}
            />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
