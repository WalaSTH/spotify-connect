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
  Stack,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { styled } from '@mui/material/styles';

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
import FilterRooms from "./FilterRooms";

const joinRoomUrl = "http://127.0.0.1:8000/api/join-room";

export default function RoomsLobby({ userId, navigate }) {
  const [roomsList, setRoomsList] = useState([]);
  const [firstLoad, setFirstLoad] = useState(false);
  const [songList, setSongList] = useState([]);
  const [inputPassword, setInputPassword] = useState(-1);
  const [password, setPassword] = useState("");
  const [badPassword, setBadPassword] = useState(false);
  const [alreadyInRoom, setAlreadyInRoom] = useState(false);
  const [roomToEnter, setRoomToEnter] = useState("");
  const [roomCount, setRoomCount] = useState(0);
  const [sortOptions, setSortOptions] = useState({ field: "", sort: "" });
  const [pageOptions, setPageOptions] = useState({ page: 0, pageSize: 5 });
  const [filter, setFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    include: true,
    guest_pause: false,
    guest_add_queue: false,
    guest_manage_queue: false,
    guest_skip: false,
    private_room: false,
  });
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
  async function loadData(page, sortField, sortOrder, filter, filterOptions={} ) {
    try {
      setFirstLoad(false);
      // Get rooms
      const initialData = await getRooms(userId, page, sortField, sortOrder, filter, filterOptions);
      // Fetch song for every row
      console.log("THE SONG IS");
      console.log(initialData);
      setRoomCount(initialData["Count"]);
      for (let i = 0; i < initialData["Data"].length; i++) {
        let songData = {};
        if (initialData["Data"][i].current_song != null) {
          console.log("Song parsed is");
          console.log(songData);
        }
      }
      console.log(initialData["Data"]);
      setRoomsList(initialData["Data"]);
      setFirstLoad(true);
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
            <Tooltip
                title="Private Room"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                enterNextDelay={500}
              >
            <LockIcon />
            </Tooltip>
          </>
        ) : (
          <>
              <Tooltip
                title="Open Room"
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                enterNextDelay={500}
              >
            <LockOpenIcon />
            </Tooltip>
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
                      autoComplete="off"
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

  async function getRooms(userId, page, sortField, sortOrder, filter, filterOptions) {
    const filterOptionsString = encodeURIComponent(JSON.stringify(filterOptions))
    const response = await fetch(
      "api/get-rooms" +
        "?user_id=" +
        userId +
        "&page=" +
        page +
        "&sort_field=" +
        sortField +
        "&sort_order=" +
        sortOrder +
        "&filter=" +
        filter +
        "&filter_options=" +
        filterOptionsString ,
    ).catch(error => console.error('Error:', error));
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
    loadData(1, "", "", filter, filterOptions);
  }, []);

  const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
      fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
      fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
      fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
      fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
      fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
      fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
  }));
  
  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>No Rooms</Box>
      </StyledGridOverlay>
    );
  }

  return (
    <div>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="flex-start"
        className=""
        sx={{
          marginTop: 0,
          marginLeft: 0,
        }}
        spacing={1}
      >
      {badPassword && (
        <Alert
          className=""
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
        <Alert className="" severity="warning" sx={{ width: 320 }}>
          <AlertTitle> Already in a room</AlertTitle>
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
      
        <Grid item>
          <FilterRooms loadData={loadData} pageOptions={pageOptions} sortOptions={sortOptions}
            filterOptions={filterOptions} setFilterOptions={setFilterOptions}
            filter={filter} setFilter={setFilter}></FilterRooms>
        </Grid>
        <Grid item>
          <div>
            <DataGrid
              autoHeight
                          slots={{
                            noRowsOverlay: CustomNoRowsOverlay,
                            //noResultsOverlay: CustomNoRowsOverlay,
                          }}
              loading={!firstLoad}
              rows={roomsList}
              getRowHeight={() => "auto"}
              columns={columns}
              sx={{ marginLeft: 0}}
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
                  sortOptions["sort"],
                  filter,
                  filterOptions
                );
                console.log(e);
              }}
              onSortModelChange={(e) => {
                console.log(e);
                if (e.length == 0) {
                  setSortOptions({ field: "", sort: "" });
                  loadData(pageOptions["page"] + 1, "", "", filter, filterOptions);
                } else {
                  setSortOptions(e[0]);
                  loadData(
                    pageOptions["page"] + 1,
                    e[0]["field"],
                    e[0]["sort"],
                    filter,
                    filterOptions
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
