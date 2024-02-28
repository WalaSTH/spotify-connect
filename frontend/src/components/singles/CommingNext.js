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
  Box,
  Grid,
  TextField,
  FormHelperText,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Switch,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  List,
  IconButton,
  InputAdornment,
  Card,
  Tooltip,
  Icon,
  Fade,
} from "@mui/material";
import QueueIcon from "@mui/icons-material/Queue";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useEffect, useState } from "react";
import equaliser from "./../equaliser.gif";
import * as colors from "./../../static/colors";
import Search from "./MusicSearch";
//Queue manage
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import * as endpoints from "./../../static/endpoints";
import MusicPlayer from "../MusicPlayer";

export default function CommingNext({
  song,
  userID,
  queue,
  userQueue,
  socket,
  isHost,
  guestManage,
  room,
  csrf,
  musicPlayerSize,
}) {
  const [hovering, setHovering] = useState(-1);
  const [userHover, setUserHover] = useState(-1);
  async function removeSong(queueId) {
    const formData = new FormData();
    formData.append("queue_id", queueId);
    formData.append("user_id", userID);
    await axios
      .post(endpoints.BASE_BACKEND + "/api/remove-song", formData)
      .then((response) => {
        socket.send(
          JSON.stringify({
            type: "chat_message",
            user: "sessionUser",
            message: "queue_message",
            avatar: "AVATAR_USER",
            code: "queue",
          })
        );
      })
      .catch((error) => console.log(error));
  }
  async function move(queueId, position, useUser) {
    console.log("Trying to move " + queueId + " to position: " + position);
    const formData = new FormData();
    formData.append("user_id", userID);
    formData.append("queue_id", queueId);
    formData.append("position", position);
    formData.append("use_user", useUser);
    await axios
      .post(endpoints.BASE_BACKEND + "/api/move-song", formData)
      .then((response) => {
        console.log(response);
        socket.send(
          JSON.stringify({
            type: "chat_message",
            user: "sessionUser",
            message: "queue_message",
            avatar: "AVATAR_USER",
            code: "queue",
          })
        );
      })
      .catch((error) => console.log(error));
  }
  return (
    <Box>
      <Card>
        <ListItem>
          <Typography variant="h6">Music Queue</Typography>
        </ListItem>
        <Grid item xs={12} justifyContent="center">
          {!song.no_song && (isHost || room["guest_add_queue"]) && (
            <Search userID={userID} csrf={csrf} socket={socket}></Search>
          )}
        </Grid>
        <Card
          style={{ overflow: "auto", height: musicPlayerSize.height + 346 }}
        >
          <Grid container direction="column" spacing={0}>
            <Grid item></Grid>

            <Grid item>
              <ListItem>
                {!song.no_song && (
                  <Typography variant="subtitle1">Now playing</Typography>
                )}
                {song.no_song && (
                  <Typography variant="subtitle1">
                    Play on Spotify and add to queue
                  </Typography>
                )}
              </ListItem>
            </Grid>
            {!song.no_song && (
              <Grid item>
                <ListItem
                  sx={{
                    backgroundColor: colors.nowPlayingColor,
                  }}
                >
                  <Icon>1</Icon>
                  <ListItemButton
                    disableRipple
                    sx={{
                      cursor: "default",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="Album Cover"
                        src={song.image_url}
                        style={{ borderRadius: 0 }}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={song.title}
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          ></Typography>
                          {song.artist}
                          <br></br>
                          {song.added_by != "" && (
                            <Typography variant="caption">
                              Added by: {song.added_by}
                            </Typography>
                          )}
                        </React.Fragment>
                      }
                    />
                    {song.is_playing && (
                      <img
                        src={equaliser}
                        style={{
                          backgroundColor: "transparent",
                          width: 60,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
                {userQueue.length > 0 && (
                  <Grid item>
                    <ListItem>
                      <Typography variant="subtitle1">Users's queue</Typography>
                    </ListItem>
                  </Grid>
                )}
                {userQueue.map(
                  (
                    { title, image_url, artist, id, queue_id, added_by },
                    index
                  ) => (
                    <ListItem
                      key={index}
                      onMouseEnter={() => setUserHover(index)}
                      onMouseLeave={() => setUserHover(-1)}
                    >
                      <Icon>{index + 2}</Icon>
                      <ListItemButton
                        disableRipple
                        sx={{
                          cursor: "default",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt="Album Cover"
                            src={image_url}
                            style={{ borderRadius: 0 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={title}
                          secondary={
                            <div>
                              <React.Fragment>
                                <Typography
                                  sx={{ display: "inline" }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                ></Typography>
                                {artist}
                                <br></br>
                                <Typography variant="caption">
                                  Added by: {added_by}
                                </Typography>
                              </React.Fragment>
                            </div>
                          }
                        />
                        {index != 0 &&
                          index == userHover &&
                          (isHost || guestManage) && (
                            <Tooltip
                              title="Move up"
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              enterNextDelay={500}
                            >
                              <IconButton
                                onClick={() => {
                                  move(
                                    Number(queue_id),
                                    Number(index - 1),
                                    true
                                  );
                                }}
                              >
                                <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
                              </IconButton>
                            </Tooltip>
                          )}
                        {index != userQueue.length - 1 &&
                          index == userHover &&
                          (isHost || guestManage) && (
                            <Tooltip
                              title="Move down"
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              enterNextDelay={500}
                            >
                              <IconButton
                                onClick={() => {
                                  move(
                                    Number(queue_id),
                                    Number(index + 1),
                                    true
                                  );
                                }}
                              >
                                <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                              </IconButton>
                            </Tooltip>
                          )}
                        {index == userHover && (isHost || guestManage) && (
                          <Tooltip
                            title="Remove from queue"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            enterNextDelay={500}
                          >
                            <IconButton
                              onClick={() => {
                                removeSong(queue_id);
                              }}
                            >
                              <DeleteIcon></DeleteIcon>
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemButton>
                    </ListItem>
                  )
                )}
                <Grid item>
                  <ListItem>
                    <Typography variant="subtitle1">Comming up next</Typography>
                  </ListItem>
                </Grid>
                {queue.map(
                  ({ title, image_url, artist, id, queue_id }, index) => (
                    <ListItem
                      key={index}
                      onMouseEnter={() => setHovering(index)}
                      onMouseLeave={() => setHovering(-1)}
                    >
                      <Icon>{index + 2 + userQueue.length}</Icon>
                      <ListItemButton
                        disableRipple
                        sx={{
                          cursor: "default",
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt="Album Cover"
                            src={image_url}
                            style={{ borderRadius: 0 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={title}
                          secondary={
                            <React.Fragment>
                              <Typography
                                sx={{ display: "inline" }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              ></Typography>
                              {artist}
                            </React.Fragment>
                          }
                        />
                        {index != 0 &&
                          index == hovering &&
                          (isHost || guestManage) && (
                            <Tooltip
                              title="Move up"
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              enterNextDelay={500}
                            >
                              <IconButton
                                onClick={() => {
                                  move(
                                    Number(queue_id),
                                    Number(index - 1),
                                    false
                                  );
                                }}
                              >
                                <KeyboardArrowUpIcon></KeyboardArrowUpIcon>
                              </IconButton>
                            </Tooltip>
                          )}
                        {index != queue.length - 1 &&
                          index == hovering &&
                          (isHost || guestManage) && (
                            <Tooltip
                              title="Move down"
                              TransitionComponent={Fade}
                              TransitionProps={{ timeout: 600 }}
                              enterNextDelay={500}
                            >
                              <IconButton
                                onClick={() => {
                                  move(
                                    Number(queue_id),
                                    Number(index + 1),
                                    false
                                  );
                                }}
                              >
                                <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                              </IconButton>
                            </Tooltip>
                          )}
                        {index == hovering && (isHost || guestManage) && (
                          <Tooltip
                            title="Remove from queue"
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            enterNextDelay={500}
                          >
                            <IconButton
                              onClick={() => {
                                removeSong(queue_id);
                              }}
                            >
                              <DeleteIcon></DeleteIcon>
                            </IconButton>
                          </Tooltip>
                        )}
                      </ListItemButton>
                    </ListItem>
                  )
                )}
              </Grid>
            )}
          </Grid>
        </Card>
      </Card>
    </Box>
  );
}
