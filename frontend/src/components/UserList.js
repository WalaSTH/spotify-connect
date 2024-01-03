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
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
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
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
//Local
import equalizer from "./equaliser.gif";
import * as colors from "./../static/colors";
import FilterRooms from "./FilterRooms";
import * as endpoints from "./../static/endpoints";

const joinRoomUrl = endpoints.BASE_BACKEND + "/api/join-room";

export default function UserList({
  userId,
  navigate,
  isMediumScreen,
  isHost,
  csrf,
  currentUser,
  avatars,
  getAvatar,
}) {
  const [userList, setUserList] = useState([]);

  function moveUserFront(array, name) {
    const index = array.findIndex((obj) => obj["username"] === name);

    if (index !== -1) {
      const removedElement = array.splice(index, 1)[0];
      array.unshift(removedElement);
    }
  }

  async function getUsers() {
    await axios
      .get("api/get-users" + "?user_id=" + userId)
      .then((response) => {
        console.log(response);
        const list = response["data"]["Data"];
        setUserList(list);
        //moveUserFront(list, currentUser);
      })
      .catch((error) => console.log(error));
  }

  async function kickUser(username) {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("username_kick", username);
    await axios
      .post("api/kick-user", formData, csrf)
      .then((response) => {
        getUsers();
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    getUsers();
  }, []);
  const userListFake = [
    {
      username: "WalaSTH",
      avatar:
        "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61koHqSlR-L._AC_UF894,1000_QL80_.jpg",
    },
    {
      username: "Shika",
      avatar:
        "https://staticg.sportskeeda.com/editor/2022/02/92ef9-16442055826904-1920.jpg",
    },
    {
      username: "Ruto",
      avatar:
        "https://i.pinimg.com/474x/48/9c/79/489c79244750f919f27723470813aa19.jpg",
    },
    {
      username: "Naruto",
      avatar:
        "https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/61koHqSlR-L._AC_UF894,1000_QL80_.jpg",
    },
    {
      username: "Tails",
      avatar:
        "https://scontent.fcor10-3.fna.fbcdn.net/v/t39.30808-6/293166324_413539210817384_7113673314125101691_n.png?_nc_cat=109&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeHZrWlqDl-cnBZzIRpiSa6cDyuWZ81THxEPK5ZnzVMfESVGSJxfEuz_iMzpLfdZfHDV9hWQmyTjrajnQuyL-2tU&_nc_ohc=zS7T5SPoUKwAX_eihRB&_nc_ht=scontent.fcor10-3.fna&oh=00_AfAgVJOxbyAA0k0ZYZB3v-vOso0MMTZAyFDsDasd9kmoYQ&oe=658E0B0A",
    },
    {
      username: "1905",
      avatar:
        "https://cdn.eldoce.tv/sites/default/files/nota/2023/12/19/vegetti-posible-regreso-belgrano.jpg",
    },
  ];
  return (
    <div>
      <Box display="block" stickyHeader>
        <Grid container>
          <Grid item xs={1}>
            <Card
              align="center"
              sx={{
                position: "absolute",
                zIndex: "tooltip",
              }}
              style={{
                maxHeight: 300,
                overflow: "auto",
                minWidth: 300,
                maxWidth: 400,
                position: "fixed",
                bottom: 16,
                right: 16,
                marginRight: isMediumScreen ? 130 : 5,
                marginBottom: isMediumScreen ? 0 : isHost ? 120 : 80,
              }}
            >
              {userList.map(({ username, id }) => {
                if (!avatars[username]) getAvatar(username);
                return (
                  <ListItem key={id}>
                    <ListItemButton
                      disableRipple
                      sx={{
                        cursor: "default",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar alt="Album Cover" src={avatars[username]} />
                      </ListItemAvatar>
                      <ListItemText primary={username} />
                      {isHost && username != currentUser && (
                        <Tooltip
                          title="Kick User"
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          enterNextDelay={500}
                        >
                          <IconButton
                            onClick={() => {
                              kickUser(username);
                            }}
                          >
                            <PersonRemoveIcon></PersonRemoveIcon>
                          </IconButton>
                        </Tooltip>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
